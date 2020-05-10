<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="90px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="车辆"
              prop="vehicle"
            >
              <el-input
                v-model="tableData.vehicle"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="投保时间"
              prop="insuranceTime"
            >
              <el-date-picker
                v-model="tableData.insuranceTime"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="投保类型"
              prop="typesInsurance"
            >
              <el-select v-model="tableData.typesInsurance">
                <el-option 
                  label="全部" 
                  value="0"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="保费(元)"
              prop="premium"
            >
              <el-input
                v-model="tableData.premium"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="起始时间"
              prop="startDate"
            >
              <el-date-picker
                v-model="tableData.startDate"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="截至时间"
              prop="endDate"
            >
              <el-date-picker
                v-model="tableData.endDate"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="备注"
              prop="dictName"
            >
              <el-input
                v-model="tableData.x11"
                type="textarea"
                maxlength="200"
                show-word-limit=""
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item
          label="保险名称"
          prop="dictName"
        >
          <el-input
            v-model="tableData.dictName"
            class="el-input-rank"
          />
        </el-form-item>
        <el-form-item
          label="保险金额"
          prop="amount"
        >
          <el-input
            v-model.number="tableData.amount"
            class="el-input-rank"
          />
        </el-form-item> -->
      </el-form>
      <div class="opeate-buttons">
        <el-button
          @click="cancel"
        >
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: ''
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private value1: string = ''
  private value2: string = ''
  private classes: string = ''
  private classesOptions: Array<any> = [
    {
      value: 1,
      label: '上午班'
    },
    {
      value: 2,
      label: '下午班'
    }
  ]
  private defaultProps: any= {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private ruleForm:object = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  }
  private rules:object = {
    vehicle: [
      { required: true, message: '请输入车牌号', trigger: 'change' }
    ],
    insuranceTime: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ],
    typesInsurance: [
      { required: true, message: '请选择投保类型', trigger: 'change' }
    ],
    premium: [
      { required: true, validator: this.validateRole, trigger: 'change' }
    ],
    startDate: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ],
    endDate: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ]
  }
  private validateRole(rule: any, value: string, callback: any) {
    if (!value) {
      return callback(new Error('请输入保费'))
    } 
    if (/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value)) {
      return callback()
    } 
    return callback(new Error('数字，可输入小数点后两位')) 
  }
  created() {
    this.initTreeData()
  }
  @Watch('tableData.parentId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.$refs.dIdCascader.toggleDropDownVisible()
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/dictionary/findDictionaryTree',
      method: 'post',
      data: {}
    }).then((res: any) => {
      // console.log(res)
      this.treeData = res.data
    })
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/dictionary/addOrUpdateDictionary',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      // console.log(res)
      let dialog = {
        title: '',
        visible: false,
        isAdd: true
      }
      this.$emit('update:dialog', dialog)
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        // console.log(this.tableData)
        this.saveData()
      } else {
        this.$base.win.msg('必填项不能为空', 'error')
        return false
      }
    })
  }
  private cancel(): void {
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
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  .el-input,.el-select,.el-cascader{
    width: 100%;
  }
  // .el-input-rank{
  //   width: 170px;
  // }
  .no-margin{
    margin-bottom: 0px;
  }
</style>
