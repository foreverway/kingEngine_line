<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="720px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="日志类型"
              prop="logType"
            >
              <ke-dict
                v-model="tableData.logType"
                code="log_type"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="故障类型"
              prop="errorType"
            >
              <ke-dict
                v-model="tableData.errorType"
                code="fault_type"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="值班时间段"
              prop="startTime"
            >
              <el-date-picker
                v-model="tableData.startTime"
                clearable
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetime"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="至"
              prop="endTime"
            >
              <el-date-picker
                v-model="tableData.endTime"
                clearable
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetime"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="日期"
              prop="logDate"
            >
              <el-date-picker
                v-model="tableData.logDate"
                value-format="yyyy-MM-dd"
                clearable
                type="date"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="上岗情况"
          prop="inductionConditions"
        >
          <el-input
            v-model="tableData.inductionConditions"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="设备情况"
          prop="operationgConditions"
        >
          <el-input
            v-model="tableData.operationgConditions"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="其他动态"
          prop="otherConditions"
        >
          <el-input
            v-model="tableData.otherConditions"
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
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = {}
  private rules:object = {
    logType: [
      { required: true, message: '请选择日志类型', trigger: 'change' }
    ],
    errorType: [
      { required: true, message: '请选择故障类型', trigger: 'change' }
    ],
    startTime: [
      { required: true, message: '请选择值班开始时间', trigger: 'change' }
    ],
    endTime: [
      { required: true, message: '请选择值班结束时间', trigger: 'change' }
    ],
    logDate: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ]
  }
  created() {
    if (this.id){
      this.initData()
    } else {
      this.tableData = {
        checkType: 1,
        logType: '',
        errorType: '',
        startTime: '',
        endTime: '',
        logDate: '',
        inductionConditions: '',
        operationgConditions: '',
        otherConditions: ''
      }
    }
  }
  private initData():void{
    this.$http.request({
      url: '/evt/log/common/findCommonLogById',
      method: 'post',
      data: {
        id: this.id
      }
    }).then((res:any) => {
      this.tableData = res.data
      this.tableData.checkType = 1
    })
  }
  private saveData(): void { // 保存/修改 接口
    let url = ''
    this.id ? url = '/evt/log/common/updateCommonLog' : url = '/evt/log/common/addCommonLog  '
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
      this.$base.win.msg('成功','success')
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
}
</script>

<style lang="scss" scoped>
.el-form{
  height: 500px;
  padding-right: 20px;
  overflow: auto;
}
</style>
