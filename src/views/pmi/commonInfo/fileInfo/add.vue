<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
    :close-on-click-modal="false"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="上级目录"
          prop="parent"
        >
          <el-cascader
            v-model="tableData.parentId"
            placeholder="请选择上级目录"
            :options="treeData"
            :props="defaultProps"
            :show-all-levels="false"
            clearable
            :disabled="disable"
          />
        </el-form-item>
        <el-form-item
          label="文件夹名称"
          prop="fileName"
        >
          <el-input 
            v-model="tableData.fileName" 
            placeholder="请输入文件夹名称"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="文件夹编号"
          prop="fileCode"
        >
          <el-input 
            v-model="tableData.fileCode" 
            placeholder="请输入文件夹编号"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="note"
        >
          <el-input
            v-model="tableData.note"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div class="opeate-buttons">
        <el-button @click="handleCancel">
          <svg-icon name="hamburger" />取消
        </el-button>
        <el-button
          type="primary"
          :loading="saveLoading"
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
  name: 'FileInfoAdd'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: Object, default: {} }) dialog!: any
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private saveLoading: boolean = false
  private disable: boolean = false
  private defaultProps: any = {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private rules: object = {
    fileName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入文件夹名称', trigger: 'change' }
    ],
    fileCode: [
      { required: true,pattern: '[^ \x22]+', message: '请输入文件夹编号', trigger: 'change' },
      {            
        validator(rule,value,callback){          
          let reg1 = new RegExp(/^[0-9A-Za-z]+$/)
          if (reg1.test(value)){                
            callback()
          } else {                 
            callback(new Error('请输入大于等于0的数字或字母'))           
          }            
        },             
        trigger: 'change'          
      }
    ]
  }
  created() {
    this.initTreeData()
    if (!this.tableData.parentId){
      this.disable = true
    } 
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/system/file/fileTree',
        method: 'get',
        data: {}
      })
      .then((res: any) => {
        // console.log(res)
        this.treeData = res.data
      })
  }
  private saveData(): void {
    // 保存/修改 接口
    this.$http
      .request({
        url: this.id ? '/system/file/editSysFile' : '/system/file/addSysFile',
        method: 'post',
        data: this.tableData
      })
      .then((res: any) => {
        // console.log(res)
        if (res.code === 200) {
          let dialog = {
            title: '',
            visible: false,
            isAdd: true
          }
          this.$emit('update:dialog', dialog)
        }
        this.saveLoading = false
        this.$base.win.msgJson(res)
      })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async (valid: boolean) => {
      if (valid) {
        this.saveLoading = true
        this.saveData()
      } else {
        return false
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
}
</script>

<style lang="scss" scoped>
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
.el-cascader {
  width: 100%;
}
</style>
