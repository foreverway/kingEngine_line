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
        :rules="rules"
        :model="tableData"
        label-width="100px"
      >
        <el-form-item
          label="文件名称："
          prop="docDescribe"
        >
          {{ tableData.docDescribe }}
        </el-form-item>
        <el-form-item
          label="文件类型："
          prop="docType"
        >
          <!-- <el-select
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
          </el-select> -->
          {{ tableData.docType }}
        </el-form-item>
        <el-form-item
          label="上传日期："
          prop="createTime"
        >
          {{ tableData.createTime }}
        </el-form-item>
        <el-form-item
          label="排序号："
          prop="orderNum"
        >
          {{ tableData.orderNum }}
        </el-form-item>
        <el-form-item
          label="上传附件："
          prop="note"
        >
          <div class="upload">
            <el-upload
              action=""
              class="upload-demo"
              multiple
              :file-list="fileList"
            />
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
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private fileList: Array<any> = []
  // 上传日期
  private data: number = 0
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
    let val = await this.$base.dict.dictByCode('sysHelpDocs',this.tableData.docType)
    this.tableData.docType = val.dictName
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>
<style lang="scss">
  .add-department{
    .el-upload--text{
      display: none;
    }
    .upload{
      border: none!important;
    }
    .upload-demo{
      height: 90%!important;
    }
  }
</style>
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
