<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="560px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="检测时间"
          prop="logDate"
        >
          <el-date-picker
            v-model="tableData.logDate"
            value-format="yyyy-MM-dd"
            clearable
            type="date"
          />
        </el-form-item>
        <el-form-item
          label="运行情况"
          prop="overallOperation"
        >
          <el-input
            v-model="tableData.overallOperation"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="主要问题"
          prop="hasProblem"
        >
          <el-input
            v-model="tableData.hasProblem"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="解决方法"
          prop="solutions"
        >
          <el-input
            v-model="tableData.solutions"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="其他情况"
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
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = {}
  private rules:object = {
    logDate: [
      { required: true, message: '请选择检测时间', trigger: 'change' }
    ]
  }
  created() {
    if (this.id){
      this.initData()
    } else {
      this.tableData = {
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
      url: '/evt/log/complexInspect/findCommonLogById',
      method: 'post',
      data: {
        id: this.id
      }
    }).then((res:any) => {
      this.tableData = res.data
    })
  }
  private addData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/evt/log/complexInspect/addComplexInspectLog',
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
  private editData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/evt/log/complexInspect/updateComplexInspectLog',
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
        if (this.dialog.title === '修改') {
          this.editData()
        } else {
          this.addData()
        }
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
    height: 460px;
    padding-right: 20px;
    overflow: auto;
  }
</style>
