<!-- eslint-disable no-irregular-whitespace -->
<template>
  <div
    v-loading="loading"
    class="basic"
  >
    <el-form
      ref="basicForm"
      :model="tableData"
      :rules="rules"
      label-width="110px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="设 备 编 号"
            prop="deviceNo"
          >
            <el-input
              v-model="tableData.deviceNo"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="城 管 通 号 "
            prop="personNo"
          >
            <el-input
              v-model="tableData.personNo"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="设备IEMI号"
            prop="iemiNo"
          >
            <el-input
              v-model="tableData.iemiNo"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="P D A 用 途 "
            prop="useWay"
          >
            <el-select
              v-model="tableData.useWay"
              placeholder="请选择"
            >
              <el-option
                v-for="item in pdaOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="设 备 品 牌 "
            prop="deviceBrand"
          >
            <el-input
              v-model="tableData.deviceBrand"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="设 备 型 号 "
            prop="deviceType"
          >
            <el-input
              v-model="tableData.deviceType"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="版　本　号"
            prop="version"
          >
            <el-input
              v-model="tableData.version"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="item-panel">
            <el-checkbox v-model="isCenter">
              是否归属管理中心
            </el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-form-item
        label="随 机 配 件 "
        prop="parts"
      >
        <el-input
          v-model="tableData.parts"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="250"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="备　　注 "
        prop="note"
      >
        <el-input
          v-model="tableData.note"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="250"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { METHODS } from 'http'
import md5 from 'js-md5'
@Component({
  name: 'TaskForm'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: Object, default: {} }) roles!: object
  @Prop({ type: String, default: '' }) activeName!: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private departTree: Array<any> = []
  private tableData: any = {
    deviceNo: '',
    personNo: '',
    iemiNo: '',
    useWay: '',
    deviceBrand: '',
    deviceType: '',
    version: '',
    isCenter: false,
    parts: '',
    note: ''
  }
  private loading: boolean = true
  private originalLoginName: String = ''
  private addressOptions: any = [
    {
      label: '南山区',
      value: '南山区'
    }
  ]
  private pdaOptions: any = [
    {
      label: '管理机',
      value: '管理机'
    },{
      label: '网络机',
      value: '网络机'
    },{
      label: '备用机',
      value: '备用机'
    }
  ]
  private defaultProps: any = {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private rules: object = {
    deviceNo: [
      { required: true, message: '请输入设备编号', trigger: 'change' }
    ],
    personNo: [
      { required: false, message: '请输入城管通号', trigger: 'change' }
    ],
    iemiNo: [
      { required: true, message: '请输入设备IMEI号', trigger: 'change' }
    ],
    useWay: [{ required: false, message: '请选择PDA用途', trigger: 'change' }],
    deviceBrand: [
      { required: false, message: '请输入设备品牌', trigger: 'change' }
    ],
    deviceType: [
      { required: false, message: '请输入设备型号', trigger: 'change' }
    ],
    version: [{ required: true, message: '请输入版本号', trigger: 'change' }],
    parts: [{ required: false, message: '请输入随机配件', trigger: 'change' }],
    note: [{ required: false, message: '请输入备注', trigger: 'change' }]
  }

  created() {
    this.formateData()
    this.loading = false
    this.originalLoginName = this.tableData.loginName
    // console.log(md5(this.tableData.loginPwd))
  }
  @Watch('tableData.deptId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.$refs.dIdCascader.toggleDropDownVisible()
  }
  private formateData(): void {
    let data = this.tableData
    console.log(data)
    if (data.id) {
      // console.log(data.is_admin)
      data.is_admin === 1 ? (data.is_admin = true) : (data.is_admin = false)
    }
    // console.log(this.tableData)
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async (valid: boolean) => {
        if (valid) {
          // console.log(this.tableData)
          let data = this.$base.common.extend(this.tableData)
          data.loginPwd = md5(data.loginPwd)
          data.is_admin === true ? (data.is_admin = 1) : (data.is_admin = 0)
          this.$emit('update:selectionItem', data)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
          // this.$base.win.msg('必填项不能为空')
          return false
        }
      })
    })
    return res
  }
}
</script>
<style scoped>
.basic >>> .el-dialog__body{
  padding-left: 10px !important;
}
</style>
<style lang="scss" scoped>
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
.item-panel {
  padding-left: 25px;
  height: 38px;
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
}

</style>
