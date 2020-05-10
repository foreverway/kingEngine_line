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
        label-width="85px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="区域名称"
              prop="areaName"
            >
              <el-input
                v-model="tableData.areaName"
                placeholder="请输入区域名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="上级区域"
              prop="parentId"
            >
              <el-cascader
                ref="dIdCascader"
                v-model="tableData.parentId"
                placeholder="请选择上级区域"
                :options="treeData"
                :props="defaultProps"
                :show-all-levels="false"
                clearable
                @change="handleChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="区域编码"
              prop="areaCode"
            >
              <el-input
                v-model="tableData.parentCode"
                disabled
                style="width: 30%;"  
              /> - 
              <el-input
                v-model="tableData.areaCode"
                placeholder="请输入区域编码"
                clearable
                style="width: 65%;" 
              /> 
              <!-- @input="changeValue" -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="区域级别"
              prop="areaLevel"
            >
              <ke-dict 
                v-model="tableData.areaLevel" 
                code="qyjbvalue"
                :disabled="true"
              />
              <!-- <el-input
                v-model="tableData.areaLevel"
                :disabled="true"
              /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="总面积"
              prop="totalArea"
            >
              <el-input
                v-model="tableData.totalArea"
                placeholder="请输入总面积"
                type="number" 
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="人口总数"
              prop="areaPeople"
            >
              <el-input
                v-model="tableData.areaPeople"
                placeholder="请输入人口总数"
                type="number"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="排序号"
              prop="orderNo"
            >
              <el-input
                v-model.trim="tableData.orderNo"
                placeholder="请输入排序号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="备注"
              prop="note"
            >
              <el-input
                v-model="tableData.note"
                type="textarea"
                :rows="4"
                resize="none"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'addOne'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: Object, default: {} }) dialog!: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private saveLoading: boolean = false
  private defaultProps: any = {
    children: 'children',
    label: 'areaName',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private dbStatusOptions: Array<any> = [
    {
      value: 1,
      label: '正常'
    },
    {
      value: 0,
      label: '删除'
    }
  ]
  // 
  
  private rules: object = {
    areaName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入区域名称', trigger: 'change' }
    ],
    areaCode: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateCode, trigger: 'change' } 
    ],
    parentId: [
      { required: true, message: '请选择上级区域', trigger: 'change' }
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
    this.tableData.areaCode = this.tableData.areaCode.replace(this.tableData.parentCode,'')
  }
  private initTreeData(): void {
    this.$http.request({
      url: 'sys/area/tree',
      method: 'get',
      params: {disableId: this.tableData.id}
    }).then((res: any) => {
      this.treeData = res.data
    })
  }
  private validateCode(rule: any, value: string, callback: any) {
    if (!value) {
      return callback(new Error('请输入区域编码'))
    }
    if (this.tableData.areaLevel <= 3 && value.length !== 2) {
      return callback(new Error('只能输入2位数字'))
    } else if (this.tableData.areaLevel > 3 && value.length !== 3) {
      return callback(new Error('只能输入3位数字'))
    }
    let reg = /^[0-9]+$/
    if (reg.test(value)) {
      return callback()
    }
    return callback(new Error('区域编码只能输入数字'))
  }
  private validateAreaCode(code: string): any {
    return this.$http
      .request({
        url: '/area/validateAreaCode',
        method: 'post',
        data: { code: code }
      })
      .then((res: any) => {
        return true
      })
      .catch((err: any) => {
        console.log(err)
        return false
      })
  }
  private saveData(): void {
    // 保存/修改 接口
    this.$http
      .request({
        url: this.tableData.id ? `sys/area/edit/${this.tableData.id}` : '/sys/area/add',
        method: this.tableData.id ? 'put' : 'post',
        data: this.tableData
      })
      .then((res: any) => {
        if (res.code === 200) {
          let dialog = {
            title: '',
            visible: false,
            isAdd: true
          }
          this.$emit('update:dialog', dialog)
        }
        this.$base.win.msgJson(res)
        this.saveLoading = false
      })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async (valid: boolean) => {
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
      level: 1,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
  @Watch('tableData.parentId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.$refs.dIdCascader.toggleDropDownVisible()
  }
  private handleChange(value,options): void {
    let list = this.$refs.dIdCascader.getCheckedNodes()[0].data
    this.tableData.parentCode = list.areaCode
    this.tableData.areaLevel = list.areaLevel + 1
  }
}
</script>

<style lang="scss" scoped>
</style>
