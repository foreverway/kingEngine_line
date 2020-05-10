<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="车辆"
          prop="vehicle"
        >
          <el-input
            v-model="tableData.vehicle"
            class="el-input-rank"
          />
        </el-form-item>
        <el-form-item
          label="维修时间"
          prop="maintenanceTime"
        >
          <el-date-picker
            v-model="tableData.maintenanceTime"
            type="datetime"
            placeholder="请选择维修时间"
          />
        </el-form-item>
        <el-form-item
          label="费用(元)"
          prop="cost"
        >
          <el-input
            v-model.number="tableData.cost"
            class="el-input-rank"
          />
        </el-form-item>
        <el-form-item
          label="维修方式"
          prop="maintenanceMode"
        >
          <el-select v-model="tableData.maintenanceMode">
            <el-option 
              label="更换配件" 
              value="0"
            />
            <el-option 
              label="修理配件" 
              value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="维修原因"
          prop="maintenanceReason"
        >
          <el-input
            v-model="tableData.maintenanceReason"
            type="textarea"
            maxlength="200"
            show-word-limit=""
          />
        </el-form-item>
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
      { required: true, message: '请输入车辆', trigger: 'change' }
    ],
    maintenanceTime: [
      { required: true, message: '请输入时间', trigger: 'change' }
    ],
    cost: [
      { required: true, message: '请输入费用', trigger: 'change' },
      { type: 'number', message: '费用必须为数字值', trigger: 'change' }
    ],
    maintenanceMode: [
      { required: true, message: '请选择维修方式', trigger: 'change' }
    ],
    maintenanceReason: [
      { required: true, message: '请输入维修原因', trigger: 'change' }
    ]
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
