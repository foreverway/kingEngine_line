<template>
  <el-dialog
    v-dialog-drag
    title="修改"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <el-form
      ref="rulesForm"
      :model="params"
      :rules="rules"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="报警类型">
            <span>{{ formData.alarmType }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            {{ formData.createTime }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col
          :span="24"
          class="setting-form"
        >
          <el-form-item
            label="规则"
            prop="alarmParamSet"
            class="setting-form"
          >
            停留某地超过<el-input v-model="params.alarmParamSet" />小时触发报警
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="报警描述">
            {{ formData.note }}
          </el-form-item>
        </el-col>
      </el-row>
      <div class="opeate-buttons btn-container">
        <el-button
          @click="handleCancel"
        >
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
@Component({
  name: 'edit',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private loading: boolean = false
  private formData: any = {}
  private params:any = {
    alarmParamSet: ''
  }
  private setValid = (rule, value, callback) => {
    let double = value.toString().split('.')[1]
    if (isNaN(value)){
      callback(new Error('请输入数字'))
    } else if (double && double.length > 2){
      callback(new Error('只能输入小数点后两位'))
    }
  }
  private rules: any = {
    alarmParamSet: [
      { required: true, message: '请输入报警规则', trigger: 'change' },
      { validator: this.setValid, trigger: 'blur' }
    ]
  }
  mounted(){
    this.params.id = this.dialog.item.id
    this.initData()
  }
  private initData(){
    this.loading = true
    this.$http({
      url: '/obs/alarm/getObserverAlarmDetail',
      method: 'post',
      data: {
        id: this.dialog.item.id
      }
    }).then((res) => {
      this.formData = res.data
      this.params.alarmParamSet = this.formData.alarmParamSet
      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  private handleSubmit(){
    let form = this.$refs.rulesForm as ElForm
    form.validate((valid) => {
      if (valid){
        this.handleSave()
      }
    })
  }
  private handleSave(){
    this.$http({
      url: '/obs/alarm/updateObserverAlarm',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleInit')
      this.handleCancel()
    })
  }
  private handleCancel(){
    let dialog = {
      visible: false
    }
    this.$emit('update:dialog',dialog)
  }
}
</script>

<style scoped>
.btn-container {
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-end;
}
.search-item {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-bottom: 15px;
  padding-right: 10px;
}
.search-item label {
  width: 95px;
  line-height: 35px;
}
.setting-form{
  display: flex;
  flex-flow: row;
  align-items: center;
}
.setting-form{
  width: 100%;
}
.setting-form .el-input{
  width:90px;
  margin: 0 10px;
}
</style>
