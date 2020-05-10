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
        label-width="110px"
      >
        <el-form-item
          label="来访开始日期"
          prop="startTime"
        >
          <el-date-picker
            v-model="tableData.startTime"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item
          label="来访结束日期"
          prop="endTime"
        >
          <el-date-picker
            v-model="tableData.endTime"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item
          label="参观日期"
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
          label="来访人数"
          prop="visitNum"
        >
          <el-input
            v-model.number="tableData.visitNum"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="来访单位及主要人员"
          prop="textFirst"
        >
          <el-input
            v-model="tableData.textFirst"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="座谈内容"
          prop="textSecond"
        >
          <el-input
            v-model="tableData.textSecond"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="接待安排及领导批示"
          prop="textThird"
        >
          <el-input
            v-model="tableData.textThird"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="实景描述"
          prop="textFourth"
        >
          <el-input
            v-model="tableData.textFourth"
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
    startTime: [
      { required: true, message: '请选择来访开始日期', trigger: 'change' }
    ],
    endTime: [
      { required: true, message: '请选择来访结束日期', trigger: 'change' }
    ],
    logDate: [
      { required: true, message: '请选择参观日期', trigger: 'change' }
    ],
    visitNum: [
      { required: true, message: '请输入来访人数', trigger: 'change' },
      { type: 'number', message: '来访人数必须为数字值', trigger: 'change' }
    ]
  }
  created() {
    if (this.id){
      this.initData()
    } else {
      this.tableData = {
        startTime: '',
        endTime: '',
        logDate: '',
        visitNum: 0,
        textFirst: '',
        textSecond: '',
        textThird: '',
        textFourth: ''
      }
    }
  }
  private initData():void{
    this.$http.request({
      url: '/evt/log/visitReception/findById',
      method: 'post',
      data: {
        id: this.id
      }
    }).then((res:any) => {
      this.tableData = res.data
    })
  }
  private addData(): void { // 新增 接口
    this.$http.request({
      url: '/evt/log/visitReception/addVisitReceptionLog',
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
  private editData(): void { // 修改 接口
    this.$http.request({
      url: '/evt/log/visitReception/updateVisitReceptionLog',
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
        this.id ? this.editData() : this.addData()
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
