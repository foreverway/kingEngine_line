<template>
  <el-dialog
    :title="dialog.title"
    width="430px"
    :visible.sync="dialog.visible"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
    >
      <el-form-item
        prop="applyType"
        label="申请类型"
      >
        <el-select v-model="form.applyType">
          <el-option value="11">
            一般性处理时限
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        prop="applyReason"
        label="申请理由"
      >
        <el-input
          v-model="form.applyReason"
          type="textarea"
          maxlength="200"
          show-word-limit
          resize="none"
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dr-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取 消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit('ruleForm')"
      >
        <svg-icon name="save" />确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component
export default class extends Vue {
  @Prop() private dialog:any
  private loading:boolean=false
  private form:any={}
  private items:Array<any>=[]
  private rules:any={
    applyReason: [
      { pattern: '[^ \x22]+', required: true,message: '申请理由不能为空' }
    ],
    applyType: [
      { required: true,message: '申请类型不能为空' }
    ]
  }
  created(){
    this.$http.post('evt/delay/findDelayApplyTypeByEvtId',{evtId: this.dialog.data.id,curTache: this.dialog.data.workTache})
      .then((res) => {
        this.items = res.data
      })
  }
  private handleSubmit() {
    this.loading = true
    let form = (this.$refs.ruleForm as any)
    form.validate((valid) => {
      if (valid) {
        this.form.curTache = this.dialog.data.workTache
        this.form.evtId = this.dialog.data.id
        this.$http.post('evt/delay/addDelay',this.form).then((res: any) => {
          if (res.code === 200){
            this.$emit('reLoad')
            this.handleCancel()
          }
          this.loading = false
          this.$base.win.msgJson(res)
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.loading = false
      }
    })
  }
  private handleCancel(): void {
    this.$emit('update:dialog', {
      visible: false
    })
  }
}
</script>
 
<style lang="scss" scoped>

</style>
