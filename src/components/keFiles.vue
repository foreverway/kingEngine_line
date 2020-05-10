<template>
  <div
    class="auto"
    :style="styles"
  >
    <el-upload
      ref="upload"
      list-type="picture-card"
      :auto-upload="true"
      class="ke-files"
      :multiple="true"
      :data="params"
      :disabled="disabled"
      :limit="limit"
      :headers="{'X-Access-Token':token}"
      :before-upload="handleBeforeAvatarUpload"
      :action="uploadUrl"
      :on-success="handleUploadSuccess"
      :on-exceed="handleExceed"
      :file-list="data"
    >
      <div
        v-if="tip"
        slot="tip"
        class="el-upload__tip"
      >
        {{ tip }}
      </div>
      <i
        slot="default"
        class="el-icon-plus"
      />
      <div
        slot="file"
        slot-scope="{file}"
      >
        <label
          v-show="getSuccess(file)"
          class="el-upload-list__item-status-label"
        >
          <i class="el-icon-upload-success el-icon-check" />
        </label>
        <div
          :class="['percentage',getSuccess(file)?'hide':'']"
        >
          <el-progress
            type="circle"
            :percentage="getPercentage(file)"
            :width="70"
            color="#e6a23c"
          />
        </div>
        <img
          class="el-upload-list__item-thumbnail"
          :src="getFileType(file)"
          alt=""
        >
        {{ file.absUrl }}
        <span class="el-upload-list__item-actions">
          <span
            v-if="isImage(file)"
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            v-if="!isImage(file)"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download" />
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog
      :visible.sync="dialogVisible"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        class="img"
      >
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'

@Component
export default class extends Vue {
    // 组件样式 如:{width:300px,height:200px;}
    @Prop() private styles:any
    // 上传时附加的参数
    @Prop() private params:any
    // 回传的附件ids []
    @Prop({default: ''}) private ids!:string
    // 上传时的URL 默认为共用上传接口 等待对接
    @Prop({default: 'evt/file/fileUpLoad'}) private action:any
    // 上传文件个数 默认8个
    @Prop({default: 8}) private limit:any
    // 组件是否禁用
    @Prop({default: false})private disabled:any
    // 修改时绑定的列表
    @Prop() private data:any
    // 上传明说
    @Prop() private tip:any
    // 文件上传类型，如：['.jpg','.png']
    @Prop() private accept!:Array<string>
    // 文件大小限制kb
    @Prop({default: 10 * 1024}) private size!:number
    private dialogImageUrl:string= ''
    private dialogVisible:boolean= false
    private newIds:Array<number>=[]
    handleRemove(file:any) {
      let fileList = (this.$refs.upload as any).uploadFiles
      let index = fileList.findIndex( (fileItem) => {
        return fileItem.uid === file.uid
      })
      fileList.splice(index, 1)
      this.newIds.splice(index, 1)
      this.$emit('update:ids', this.newIds.join(','))
    }
    updated(){
      if (this.data && this.data.length > 0){
        this.newIds = this.data.map((item) => {
          return item.id
        })
        this.$emit('update:ids',this.newIds.join(','))
      }
    }
    handleBeforeAvatarUpload(file:any){
      const fileList = (this.$refs.upload as any).uploadFiles
      if (fileList.findIndex((item) => {
        return item.name === file.name && item.percentage > 0
      }) > -1){
        this.$base.win.msg('文件已经存在！','error')
        return false
      }
      if (this.accept && this.accept.length > 0){
        const name = this.getExtName(file.name)
        if (this.accept.indexOf(name) < 0){
          this.$base.win.msg('不支持的文件格式！','error')
          return false
        }
      }
      if (this.size){
        const isLt = file.size / 1024 > this.size
        if (isLt){
          this.$base.win.msg('上传大小超限制！','error')
          return false
        }
      }
      return true
    }
    handlePictureCardPreview(file:any) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
    handleDownload(file:any) {
      window.open(file.url)
    }
    handleUploadSuccess(resp:any,file:any,fileList:any){
      if (resp.code === 200) {
        this.newIds.push(resp.data.id)
        this.$emit('update:ids', this.newIds.join(','))
      }
    }
    handleExceed(){
      this.$base.win.msg(`当前最多允许上传${this.limit}个附件`,'error')
    }
    get uploadUrl(){
      return `${sessionStorage.getItem('baseURL')}${this.action}`
    }
    get token(){
      return UserModule.token
    }
    isImage(file:any){
      let extName = this.getExtName(file.name)
      return ['.jpg','.png','.jpeg','.gif'].indexOf(extName) > -1
    }
    private getSuccess(file:any){
      if (file && file.percentage !== undefined) {
        return file.percentage >= 100 
      }
      return true
    }
    private getPercentage(file:any){
      if (file && file.percentage !== undefined) {
        return Number(file.percentage.toFixed(1)) 
      }
      return 100
    }
    private getExtName(name:string){
      let ext:string = ''
      name = name.toLowerCase()
      let i = name.lastIndexOf('.')
      if (i > -1) {
        ext = name.substring(i)
      }
      return ext
    }
    private getFileType(file:any){
      let contain:Function = function (obj, extName) {
        for (let i = 0; i < obj.length; i++) {
          if (obj[i] === extName) {
            return true 
          }
        }
        return false
      }
      let extName = this.getExtName(file.name)
      let img = ['.png', '.jpg', '.jpeg', '.bmp', '.gif']
      let doc = ['.doc', '.docx']
      let xls = ['.xls', '.xlsx']
      let rar = ['.rar', '.zip']
      let pdf = ['.pdf']
      let txt = ['.txt']
      if (contain(img, extName)) {
        file.absUrl = file.url
      } else if (contain(doc, extName)) {
        file.absUrl = require('@/assets/files/word.png')
      } else if (contain(xls, extName)) {
        file.absUrl = require('@/assets/files/excel.png')
      } else if (contain(rar, extName)) {
        file.absUrl = require('@/assets/files/winrar.png')
      } else if (contain(pdf, extName)) {
        file.absUrl = require('@/assets/files/pdf.png')
      } else if (contain(txt, extName)) {
        file.absUrl = require('@/assets/files/txt.png')
      } else {
        file.absUrl = require('@/assets/files/oos.png')
      }
      return file.absUrl
    }
}
</script>
<style lang="scss">
.ke-files{
    $width:90px;
    .el-upload-list{
        .el-upload-list__item{
            width: $width;
            height: $width;
            margin: 0 8px 0px 0;
            > div{
                height:100%;
                position: relative;
                .percentage{
                  position: absolute;
                  height:100%;
                  width:100%;
                  background: #fff;
                  opacity: 1;
                  transition-property:opacity;
                  transition-duration:.5s;
                  -webkit-transition-property:opacity;
                  -webkit-transition-duration:.5s;
                  z-index: 1;
                  &.hide{
                      opacity: 0;
                      z-index: -1
                  }
                  > div{
                    width:70px;
                  }
                }
            }
        }
    }
    .el-upload--picture-card{
        width: $width;
        height: $width;
        line-height: 96px;
    }
    .el-upload-list--picture-card .el-upload-list__item-actions span + span{
        margin-left: 5px;
    }
}
</style>
<style lang="scss" scoped>
.auto{
    overflow: auto;
}
.img{
  width:100%;
  max-height: 600px;
  max-width: 1200px;
}
</style>
