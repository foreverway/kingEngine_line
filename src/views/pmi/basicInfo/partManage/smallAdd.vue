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
          label="事部件名称"
          prop="className"
        >
          <el-input
            v-model="tableData.className"
            placeholder="请输入事部件名称"
            maxlength="32"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item
          label="事部件编码"
          prop="classCode"
        >
          <el-input
            v-model="tableData.classCode"
            placeholder="请输入事部件编码"
            maxlength="32"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNo"
        >
          <el-input
            v-model.trim="tableData.orderNo"
            placeholder="请输入排序号"
            maxlength="32"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item
          label="案件类型"
          prop="parentId"
        >
          <el-cascader
            ref="dIdCascader"
            v-model="tableData.parentId"
            placeholder="请选择案件类型"
            :options="treeData"
            :props="defaultProps"
            :show-all-levels="false"
            clearable
            @change="handleChange"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="handelCancel">
          <svg-icon name="close" />取消
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
  name: 'SmallAdd'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private saveLoading: boolean = false
  private rules:object = {
    className: [
      { required: true,pattern: '[^ \x22]+', message: '请输入事部件名称', trigger: 'change' }
    ],
    classCode: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateCode, trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
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
  created() {
    this.initTreeData()
  }
  private initTreeData(): void {
    this.$http.request({
      url: 'evt/class/findEventClassAddTree',
      method: 'post',
      data: {id: this.tableData.id}
    }).then((res: any) => {
      this.treeData = res.data
    })
  }
  private validateCode(rule: any, value: string, callback: any) {
    // console.log(value)
    if (!value) {
      return callback(new Error('请输入事部件编码'))
    } 
    this.validateAreaCode(value).then((res: any) => {
      if (res) {
        return callback()
      } 
      return callback(new Error('事部件编码格式不正确'))     
    })   
  }
  private validateAreaCode(code: string): any {
    return this.$http.request({
      url: '/evt/class/validateEventClassCode',
      method: 'post',
      data: { classCode: code, id: this.tableData.id }
    }).then((res: any) => {
      return true
    }).catch((err: any) => {
      console.log(err)
      return false
    })
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: this.tableData.id ? 'evt/class/editClass' : '/evt/class/addClass',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      if (res.code === 200) {
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$base.win.msg('成功', 'success')
        this.$emit('update:dialog', dialog)
        this.saveLoading = false
      } else {
        this.$base.win.msg(res.msg, 'error')
      }
      
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        // console.log(this.tableData)
        this.saveLoading = true
        this.saveData()
      } else {
        // this.$base.win.msg('必填项不能为空', 'error')
        return false
      }
    })
  }
  private handelCancel(): any {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
  private handleChange(value,options): void {
    // let list = this.$refs.dIdCascader.getCheckedNodes()[0].data
    // this.tableData.parentId = list.id
  }

}
</script>

<style lang="scss" scoped>
</style>
