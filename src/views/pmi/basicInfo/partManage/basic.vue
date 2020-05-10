<template>
  <el-container
    v-loading="loading"
    class="basic"
  >
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="120px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="事部件名称"
            prop="className"
          >
            <el-input
              v-model="tableData.className"
              placeholder="请输入事部件名称"
              maxlength="32"
              show-word-limit
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="上级事部件"
            prop="parentClassName"
          >
            <el-input
              v-model="tableData.parentClassName"
              placeholder="请输入上级事部件"
              maxlength="32"
              show-word-limit
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="事部件编码"
            prop="classCode"
          >
            <el-input
              v-model="tableData.classCode"
              placeholder="请输入事部件编码"
              maxlength="32"
              show-word-limit
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="主管部门"
            prop="directorDeptId"
          >
            <el-cascader
              ref="dIdCascader"
              v-model="tableData.directorDeptId"
              placeholder="请选择主管部门"
              :options="departTree"
              :props="defaultProps"
              :show-all-levels="false"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="上班时段"
            prop="worktimeStart"
          >
            <el-time-select
              v-model="tableData.worktimeStart"
              placeholder="请选择时间"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:59',
                maxTime: tableData.worktimeEnd
              }"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="下班时段"
            prop="worktimeEnd"
          >
            <el-time-select
              v-model="tableData.worktimeEnd"
              placeholder="请选择时间"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:59',
                minTime: tableData.worktimeStart
              }"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="部门联系人"
            prop="directorPerson"
          >
            <el-input
              v-model="tableData.directorPerson"
              placeholder="请输入部门联系人"
              maxlength="32"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="默认处置时间"
            prop="defaultDisposeTime"
          >
            <el-input
              v-model="tableData.defaultDisposeTime"
              placeholder="请输入处置时间"
              class="w100"
              type="number"
              maxlength="32"
              show-word-limit
              clearable
            />
            <span>分钟</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-form-item
            label="是否周六上班"
            prop="isSaturdaywork"
            label-width="170px"
          >
            <el-checkbox v-model="tableData.isSaturdaywork">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="是否周日上班"
            prop="isSundaywork"
            label-width="140px"
          >
            <el-checkbox v-model="tableData.isSundaywork">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="13">
          <el-form-item
            label="是否核实"
            prop="isverify"
            label-width="170px"
          >
            <el-checkbox v-model="tableData.isverify">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="是否核查"
            prop="ischeck"
            label-width="140px"
          >
            <el-checkbox v-model="tableData.ischeck">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="是否制定核查时限"
            label-width="170px"
            prop="useCheckTime"
          >
            <el-checkbox v-model="tableData.useCheckTime">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col
          v-if="tableData.useCheckTime"
          :span="13"
        >
          <el-form-item
            label="核查时限"
            prop="checkTime"
            label-width="140px"
          >
            <el-input
              v-model="tableData.checkTime"
              placeholder="请输入核查时限"
              class="w100"
              type="number"
              maxlength="32"
              show-word-limit
              clearable
            />
            <span>分钟</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="是否制定核实时限"
            prop="useVerifyTime"
            label-width="170px"
          >
            <el-checkbox v-model="tableData.useVerifyTime">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col
          v-if="tableData.useVerifyTime"
          :span="12"
        >
          <el-form-item
            label="核实时限"
            prop="verifyTime"
            label-width="140px"
          >
            <el-input
              v-model="tableData.verifyTime"
              placeholder="请输入核实时限"
              class="w100"
              type="number"
              maxlength="32"
              show-word-limit
              clearable
            />
            <span>分钟</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="是否启用一般性处置时限"
            label-width="170px"
            prop="useDisposeTimea"
          >
            <el-checkbox v-model="tableData.useDisposeTimea">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col
          v-if="tableData.useDisposeTimea"
          :span="12"
        >
          <el-form-item
            label="一般性处置时限"
            prop="disposeTimea"
            label-width="140px"
          >
            <el-input
              v-model="tableData.disposeTimea"
              placeholder="请输入一般时限"
              class="w100"
              type="number"
              maxlength="32"
              show-word-limit
              clearable
            />
            <span>分钟</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="是否启用工程性处置时限"
            label-width="170px"
            prop="useDisposeTimeb"
          >
            <el-checkbox v-model="tableData.useDisposeTimeb">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col
          v-if="tableData.useDisposeTimeb"
          :span="12"
        >
          <el-form-item
            label="工程性处置时限"
            prop="disposeTimeb"
            label-width="140px"
          >
            <el-input
              v-model="tableData.disposeTimeb"
              placeholder="请输入工程时限"
              class="w100"
              type="number"
              maxlength="32"
              show-word-limit
              clearable
            />
            <span>分钟</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="是否启用特殊性处置时限"
            label-width="170px"
            prop="useDisposeTimec"
          >
            <el-checkbox v-model="tableData.useDisposeTimec">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col
          v-if="tableData.useDisposeTimec"
          :span="12"
        >
          <el-form-item
            label="特殊性处置时限"
            prop="disposeTimec"
            label-width="140px"
          >
            <el-input
              v-model="tableData.disposeTimec"
              placeholder="请输入特殊时限"
              class="w100"
              type="number"
              maxlength="32"
              show-word-limit
              clearable
            />
            <span>分钟</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item
            label="是否申请不设时限"
            prop="isUsetime"
            label-width="170px"
          >
            <el-checkbox v-model="tableData.isUsetime">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item
            label="是否发送来件短信"
            prop="isSendMsg"
            label-width="140px"
          >
            <el-checkbox v-model="tableData.isSendMsg">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item
            label="是否估算时限"
            label-width="170px"
            prop="isreckon"
          >
            <el-checkbox v-model="tableData.isreckon">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="立案标准"
        prop="legalstd"
      >
        <el-input
          v-model="tableData.legalstd"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="结案标准"
        prop="closedstd"
      >
        <el-input
          v-model="tableData.closedstd"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="200"
          show-word-limit
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
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { METHODS } from 'http'
import md5 from 'js-md5'
@Component({
  name: 'PartManageBasic'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: String, default: '' }) activeName !: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private departTree: Array<any> = []
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private value1: any = ''
  private value2: any = ''
  private defaultProps: any= {
    children: 'children',
    label: 'name',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private rules:object = {
    disposeTimea: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateDisposeTimeA, trigger: 'change' }
    ],
    verifyTime: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateDisposeTimeA, trigger: 'change' }
    ],
    checkTime: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateDisposeTimeA, trigger: 'change' }
    ],
    disposeTimeb: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateDisposeTimeA, trigger: 'change' }
    ],
    disposeTimec: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateDisposeTimeA, trigger: 'change' }
    ],
    defaultDisposeTime: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateDisposeTimeA, trigger: 'change' }
    ]
  }

  created() {
    this.initDepartTree()
    this.loading = false
    // console.log(this.tableData)
  }
  @Watch('tableData.directorDeptId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    if (val && oldVal) {
      this.$refs.dIdCascader.toggleDropDownVisible()
    }
  }
  private formateData(): void {
    let data = this.tableData
    if (data.id) {
      data.isSaturdaywork = this.initChecked(data.isSaturdaywork)
      data.isSundaywork = this.initChecked(data.isSundaywork)
      data.ischeck = this.initChecked(data.ischeck)
      data.useCheckTime = this.initChecked(data.useCheckTime)
      data.useVerifyTime = this.initChecked(data.useVerifyTime)
      data.isverify = this.initChecked(data.isverify)
      data.useDisposeTimea = this.initChecked(data.useDisposeTimea)
      data.useDisposeTimeb = this.initChecked(data.useDisposeTimeb)
      data.useDisposeTimec = this.initChecked(data.useDisposeTimec)
      data.use_disposeTimeB = this.initChecked(data.use_disposeTimeB)
      data.isSendMsg = this.initChecked(data.isSendMsg)
      data.isreckon = this.initChecked(data.isreckon)
      data.isUsetime = this.initChecked(data.isUsetime)
    }
    // console.log(this.tableData)
  }
  private initChecked(data: any) {
    if (data === 1 || !data) {
      return false
    }
    return true
  }
  private validateDisposeTimeA(rule: any, value: string, callback: any) {
    if (this.tableData.useDisposeTimea || this.tableData.useVerifyTime || this.tableData.useCheckTime || this.tableData.useDisposeTimeb || this.tableData.useDisposeTimec) {
      // if (this.tableData.disposeTimea && this.tableData.disposeTimeb && this.tableData.disposeTimea > this.tableData.disposeTimeb) { // 工程性处置时限
      //   debugger
      //   return callback(new Error('工程性处置时限要大于一般性处置时限'))
      // }
      if (!value) {
        return callback(new Error('请输入时限'))
      } 
      return callback()     
    }
    if (rule.field === 'defaultDisposeTime'){
      if (!value) {
        return callback(new Error('请输如处置时间'))
      } 
      return callback() 
    }
    return callback()
  }
  private hasClassCode(code: string): any { // 验证事部件编码是否存在
    return this.$http.request({
      url: '/eventClass/validateEventClassCode',
      method: 'post',
      data: {
        code: code
      }
    }).then((res: any) => {
      return true
    }).catch((err: any) => {
      console.log(err)
      return false
    })
  }
  private initDepartTree(): void {
    this.$http.request({
      url: '/pmi/department/tree',
      method: 'get',
      params: {}
    }).then((res: any) => {
      this.departTree = res.data
    })
  }
  private formatChecked(data: any) {
    if (data) {
      return 2
    }
    return 1
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          let data = this.$base.common.extend(this.tableData)
          this.$emit('update:selectionItem', data)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
          return false
        }
      })
    })
    return res
  }
  @Watch('selectionItem')
  private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
    if (this.id) {
      this.tableData = val
      this.formateData()
    }
  }
}
</script>
<style lang="scss">
.basic{
    .el-input__inner{
      padding-right: 0px!important;
    }
  }
</style>
<style lang="scss" scoped>
  .basic{
    height: 430px;
    overflow-y: auto;
    padding-right: 20px;
    box-sizing: border-box;
    width:750px;
  }
  .w100{
    width: 120px;
    margin-right: 10px;
  }
  // .el-tabs__content{
  //   padding: 0 40px;
  //   box-sizing: border-box;
  //   height: 350px;
  // }
</style>
