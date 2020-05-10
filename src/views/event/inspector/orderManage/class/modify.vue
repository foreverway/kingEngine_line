<template>
  <el-dialog
    v-dialog-drag
    title="排班调整"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="form"
    >
      <el-form-item
        label="班次名称"
        prop="scheduleClassId"
      >
        <el-select
          v-model="form.scheduleClassId"
          placeholder="请选择班次"
        >
          <el-option
            v-for="(item,index) in listData"
            :key="index"
            :label="item.className"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="上班时间"
        prop="startTime"
      >
        <el-time-picker
          v-model="form.startTime"
          placeholder="请选择上班时间"
          value-format="HH:mm"
        />
      </el-form-item>
      <el-form-item
        label="下班时间"
        prop="endTime"
      >
        <el-time-picker
          v-model="form.endTime"
          placeholder="请选择下班时间"
          value-format="HH:mm"
        />
      </el-form-item>
      <el-form-item
        label="排班日期"
        prop="scheduleTime"
      >
        <el-date-picker
          v-model="form.scheduleTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="请选择排班时间"
        />
      </el-form-item>
    </el-form>
    <div class="opeate-buttons">
      <el-button @click="handleCancel">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        v-power
        type="primary"
        code="save"
        @click="handleSubmit"
      >
        <svg-icon name="save" />保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
@Component({
  name: 'TaskForm',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Object, default: { } }) dialog!: any
  private listLoading: boolean = true
  private listData: Array<any> = []
  private form:any = {
    endTime: '',
    scheduleClassId: '',
    scheduleTime: '',
    startTime: ''
  }
  private selectedClass: any = ''
  private rules: any = {
    scheduleClassId: [
      { required: true, message: '请选择班次', trigger: 'change' }
    ],
    startTime: [
      { required: true, message: '请选择上班时间', trigger: 'change' }
    ],
    endTime: [
      { required: true, message: '请选择下班时间', trigger: 'change' }
    ],
    scheduleTime: [
      { required: true, message: '请选择排班日期', trigger: 'change' }
    ]
  }
  created() {
    this.initData()
  }
  private initData() {
    this.listLoading = true
    this.$http({
      url: '/obs/scheduleClass/findScheduleClassList',
      method: 'post'
    }).then((res) => {
      this.listData = res.data
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }
  private handleSubmit(){
    let form = this.$refs.ruleForm as ElForm
    form.validate((valid) => {
      if (valid){
        this.$http({
          url: '/obs/scheduleClass/adjustSchedule',
          method: 'post',
          data: this.form
        }).then((res) => {
          this.$base.win.msg('操作成功','success')
          this.$emit('handleInit')
          this.handleCancel()
        })
      }
    })
  }
  private handleCancel(): void {
    let dialog = {
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
.pane-item {
  height: 100%;
}
.add-department {
  height: 470px;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
// .el-input,.el-select{
//   width: 210px;
// }
.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
