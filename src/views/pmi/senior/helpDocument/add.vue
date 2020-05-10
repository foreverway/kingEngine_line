<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="550px"
    :close-on-click-modal="false"
  >
    <!-- {{ data | dateFormat('yyyy-MM-dd HH:mm:ss') }} -->
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="文件名称"
          prop="docDescribe"
        >
          <el-input
            v-model="tableData.docDescribe"
            placeholder="请输入文件名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="文件类型"
          prop="docType"
        >
          <el-select
            v-model="tableData.docType"
            placeholder="请选择文件类型"
            clearable
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.dictValue"
              :label="item.dictName"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="上传日期"
          prop="createTime"
        >
          <el-input
            v-model="tableData.createTime"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNum"
        >
          <el-input
            v-model="tableData.orderNum"
            placeholder="请输入排序号"
            type="number"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="上传附件"
          prop="note"
        >
          <div class="upload">
            <!-- accept=".xls,.xlsx,.txt,.rtf,.doc,.ppt,.wpd,.pdf,.png,.jpg,.bmp,.gif" -->
            <el-upload
              class="upload-demo"
              :action="action"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-success="handleSuccess"
              multiple
              :file-list="fileList"
            >
              <el-button
                size="small"
                type="primary"
              >
                点击上传
              </el-button>
              <!-- <div
                slot="tip"
                class="el-upload__tip"
              >
                只能上传jpg/png文件，且不超过500kb
              </div> -->
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private value1: string = ''
  private action: string = `${sessionStorage.getItem('baseURL')}sys/file/fileUpload`
  private fileList: Array<any> = []
  // 上传日期
  private data: number = 0
  private typeOptions: Array<any> = []
  private rules:object = {
    docDescribe: [
      { required: true,pattern: '[^ \x22]+', message: '请输入文件名称', trigger: 'change' }
    ],
    // fileCode: [
    //   { required: true, message: '请输入文件夹编号', trigger: 'change' }
    // ],
    orderNum: [
      { required: false, message: '请输入排序号', trigger: 'change' },
      {            
        validator(rule,value,callback){            
          if (Number.isInteger(Number(value)) && (Number(value) > 0 || Number(value) === 0)){                
            callback()
          } else {                 
            callback(new Error('请输入大于等于0的数字'))           
          }             
        },             
        trigger: 'change'          
      }
    ]
  }
  async created() {
    if (this.tableData.id) {
      this.fileList = this.tableData.annexeList
      for (let i = 0; i < this.fileList.length; i++){
        this.fileList[i].name = this.fileList[i].fileName
        this.fileList[i].url = this.fileList[i].filePath
      }
    }
    this.data = (new Date()).getTime()
    this.typeOptions = await this.$base.dict.getItems('sysHelpDocs')
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/pmi/sysHelp/addSysHelp',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      if (res.code === 200 ){
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$emit('update:dialog', dialog)
      }
      this.$base.win.msgJson(res)
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        let array = this.fileList.map(function(arr,index){
          if (arr.response) {
            return arr.response.data.id
          } 
          return arr.id
        })
        this.tableData.annexeIds = array.join(',')
        this.saveData()
      }
    })
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
  private handleRemove(file: any, fileList: any) {
    this.fileList = fileList
  }
  private handlePreview(file: any) {
    console.log(file)
  }
  private handleSuccess(response: any, file: any, fileList: any) { // 上传文件成功
    this.fileList = fileList
  }
  private beforeRemove(file: any, fileList: any) {
    return this.$confirm(`确定移除 ${file.name}？`)
  }
}
</script>

<style lang="scss" scoped>
  .upload{
    width: 100%;
    height: 150px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 5px 15px;
    overflow: auto;
    .upload-demo{
      height: 100%;

    }
  }
</style>
