<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="800px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="110px"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item
              label="条件组名："
              prop="name"
            >
              <el-input
                v-model="tableData.name"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item
              label="排序号："
              prop="orderNum"
            >
              <el-input
                v-model.number="tableData.orderNum"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
          >
            <el-checkbox
              v-model="tableData.isDefault"
              class="el-col-checkbox"
              @change="handleDefault"
            >
              默认启动
            </el-checkbox>
          </el-col>
        </el-row>
        <table>
          <tr>
            <td>
              <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
              />使用
            </td>
            <td>名称</td>
            <td>取值</td>
            <td>提示</td>
          </tr>
          <tr>
            <td>
              <el-checkbox
                v-model="tableData.useBigClass"
                @change="handleCheckedCitiesChange"
              />
            </td>
            <td>大类</td>
            <td />
            <td>大类是否相同</td>
          </tr>
          <tr>
            <td>
              <el-checkbox
                v-model="tableData.useSmallClass"
                @change="handleCheckedCitiesChange"
              />
            </td>
            <td>小类</td>
            <td />
            <td>小类是否相同</td>
          </tr>
          <tr>
            <td>
              <el-checkbox
                v-model="tableData.useTimeRange"
                @change="handleCheckedCitiesChange"
              />
            </td>
            <td>时间范围</td>
            <td>
              <el-form-item
                prop="timeRangValue"
                label-width="0px"
                class="no-margin"
              >
                <el-input
                  v-model="tableData.timeRangValue"
                  :disabled="!editTimeRange"
                  clearable
                />
              </el-form-item>
            </td>
            <td>此案件上报先后时间范围，单位为天</td>
          </tr>
          <tr>
            <td>
              <el-checkbox
                v-model="tableData.useCoord"
                @change="handleCheckedCitiesChange"
              />
            </td>
            <td>坐标距离</td>
            <td>
              <el-form-item
                class="no-margin"
                prop="coordValue"
                label-width="0px"
              >
                <el-input
                  v-model="tableData.coordValue"
                  :disabled="!editCoordRange"
                  clearable
                />
              </el-form-item>
            </td>
            <td>此案件坐标范围，单位为米</td>
          </tr>
        </table>
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
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
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
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  // private tableData: any = this.$base.common.extend(this.selectionItem)
  private tableData: any={}
  // 全选/反选
  private checkAll: boolean = false
  private isIndeterminate: boolean = false
  private checkedArray: Array<any> = []
  // 是否能编辑时间范围
  private editTimeRange: boolean = false
  // 是否能编辑坐标范围
  private editCoordRange: boolean = false
  // 是否存在默认
  private hasDefault: boolean = false
  private initDefault:any
  private rules:any = {
    name: [
      { required: true,pattern: '[^ \x22]+', message: '请输入条件组名', trigger: 'blur' }
    ],
    orderNum: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      { type: 'number', message: '排序号必须为数字值', trigger: 'change' }
    ],
    timeRangValue: [
      { required: this.tableData.useTimeRange === 2, validator: this.validateTimeRangValue, trigger: 'change' }
    ],
    coordValue: [
      { required: this.tableData.useCoord === 2, validator: this.validateCoordValue, trigger: 'change' }
    ]
  }
  private validateTimeRangValue(rule: any, value: string, callback: any) {
    if (this.rules.timeRangValue[0].required) {
      if (!value) {
        return callback(new Error('请设置时间范围'))
      } 
      if (this.$base.common.validateNumberFixTwo(value)) {
        return callback()
      } 
      return callback(new Error('数字，可输入小数点后两位')) 
    } 
    return callback()
  }
  private validateCoordValue(rule: any, value: string, callback: any) {
    if (this.rules.coordValue[0].required) {
      if (!value) {
        return callback(new Error('请设置坐标范围'))
      } 
      if (this.$base.common.validateNumberFixTwo(value)) {
        return callback()
      } 
      return callback(new Error('数字，可输入小数点后两位')) 
    } 
    return callback()
  }
  created() {
    if (this.id){
      this.initData()
    } else {
      this.tableData = {
        name: '',
        orderNum: 0,
        isDefault: '',
        useSmallClass: '',
        useBigClass: '',
        useTimeRange: '',
        timeRangValue: '',
        useCoord: '',
        coordValue: '',
        note: ''
      }
    }
    this.existCondition()
    this.initDefault = this.tableData.isDefault === 2
  }
  private initData():void{
    this.$http.request({
      url: '/evt/repeatCondition/findRepeatConditionById',
      method: 'post',
      data: {id: this.id}
    }).then((res:any) => {
      if (res.code === 200){
        this.tableData = res.data
        this.forMateDate()
        this.checkAll = this.tableData.useSmallClass && this.tableData.useBigClass && this.tableData.useTimeRange && this.tableData.useCoord === true
      }
  
    })
  }
  private forMateDate(): void {
    this.tableData.useSmallClass === 2 ? this.tableData.useSmallClass = true : this.tableData.useSmallClass = false
    this.tableData.useBigClass === 2 ? this.tableData.useBigClass = true : this.tableData.useBigClass = false
    this.tableData.useTimeRange === 2 ? this.tableData.useTimeRange = true : this.tableData.useTimeRange = false
    this.tableData.useCoord === 2 ? this.tableData.useCoord = true : this.tableData.useCoord = false
    this.tableData.isDefault === 2 ? this.tableData.isDefault = true : this.tableData.isDefault = false
    this.editTimeRange = this.tableData.useTimeRange
    this.editCoordRange = this.tableData.useCoord
  }
  // 查询是否存在默认查重条件
  private existCondition(): void {
    this.$http.request({
      url: '/evt/repeatCondition/findExistDefaultCondition',
      method: 'post',
      data: {}
    }).then((res: any) => {
      if (res.code === 200) {
        this.hasDefault = false
      } else {
        this.hasDefault = true
      }
    })
  }
  private handleCheckAllChange(val): void {
    if (val) {
      this.tableData.useSmallClass = true
      this.tableData.useBigClass = true
      this.tableData.useTimeRange = true
      this.tableData.useCoord = true
      this.editTimeRange = true
      this.rules.timeRangValue[0].required = true
      this.editCoordRange = true
      this.rules.coordValue[0].required = true
    } else {
      this.tableData.useSmallClass = false
      this.tableData.useBigClass = false
      this.tableData.useTimeRange = false
      this.tableData.useCoord = false
      let form = this.$refs.ruleForm as ElForm
      this.editTimeRange = false
      this.rules.timeRangValue[0].required = false
      // this.tableData.timeRangValue = ''
      form.validateField('timeRangValue', (errMsg) => {})
      this.editCoordRange = false
      this.rules.coordValue[0].required = false
      // this.tableData.coordValue = ''
      form.validateField('coordValue', (errMsg) => {})
    }
    this.isIndeterminate = false
  }
  private handleCheckedCitiesChange(): void {
    let form = this.$refs.ruleForm as ElForm
    this.checkedArray = []
    let data = this.tableData
    if (data.useSmallClass) {
      this.checkedArray.push('useSmallClass')
    }
    if (data.useBigClass) {
      this.checkedArray.push('useBigClass')
    }
    if (data.useTimeRange) {
      this.checkedArray.push('useTimeRange')
      this.editTimeRange = true
      this.rules.timeRangValue[0].required = true
    } else {
      this.editTimeRange = false
      this.rules.timeRangValue[0].required = false
      // this.tableData.timeRangValue = ''
      form.validateField('timeRangValue', (errMsg) => {})
    }
    if (data.useCoord) {
      this.checkedArray.push('useCoord')
      this.editCoordRange = true
      this.rules.coordValue[0].required = true
    } else {
      this.editCoordRange = false
      this.rules.coordValue[0].required = false
      // this.tableData.coordValue = ''
      form.validateField('coordValue', (errMsg) => {})
    }
    if (this.checkedArray.length !== 0 && this.checkedArray.length < 4) {
      this.isIndeterminate = true
    } else if (this.checkedArray.length === 4){
      this.checkAll = true
      this.isIndeterminate = false
    } else {
      this.checkAll = false
      this.isIndeterminate = false
    }
  }
  private saveData(): void { // 保存/修改 接口
    this.tableData.useSmallClass === true ? this.tableData.useSmallClass = 2 : this.tableData.useSmallClass = 1
    this.tableData.useBigClass === true ? this.tableData.useBigClass = 2 : this.tableData.useBigClass = 1
    this.tableData.useTimeRange === true ? this.tableData.useTimeRange = 2 : this.tableData.useTimeRange = 1
    this.tableData.useCoord === true ? this.tableData.useCoord = 2 : this.tableData.useCoord = 1
    this.tableData.isDefault === true ? this.tableData.isDefault = 2 : this.tableData.isDefault = 1
    let url = ''
    this.dialog.title === '修改' ? url = '/evt/repeatCondition/editRepeatCondition' : url = '/evt/repeatCondition/addRepeatCondition'
    this.$http.request({
      url: url,
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
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
        this.saveData()
      } else {
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
  private handleDefault(value:any):void{
    if (this.hasDefault && value && !this.initDefault){
      this.$confirm('存在默认查询条件, 是否更改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'cancel') {
            this.tableData.isDefault = false
            done()
          } else {
            done()
          }
        }
      }).catch()
    } 
  }
}
</script>

<style lang="scss" scoped>
  .el-checkbox{
    margin-right: 10px;
  }
  .el-col-checkbox{
    margin-left: 30px!important;
    margin-top: 10px;
  }
  table,tr,td{
    border: 1px solid #EBEEF5;
    padding: 10px 15px;
    border-bottom: 0;
    border-top: 0;
  }
  tr:last-child{
    td{
      border-bottom: 1px solid #EBEEF5;
    }
  }
  tr:first-child{
    td{
      border-bottom: 1px solid #EBEEF5;
      border-top: 1px solid #EBEEF5;
      background-color: #f2f2f2;
      color: #606266;
      font-weight: 600;
    }
  }
  tr{
    td:first-child{
      width: 18%;
    }
    td:nth-child(2){
      width: 22%;
    }
    td:nth-child(3){
      width: 25%;
    }
    td:last-child{
      width: 35%;
    }
  }
  table{
    width: 100%;
    table-layout: fixed;
    border-collapse:collapse;
    margin-bottom: 20px;
  }
  .no-margin{
    margin-bottom: 0px!important;
  }
</style>
