<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    width="410px"
    :visible.sync="dialog.visible"
  >
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
    >
      <!-- <el-form-item
        prop="handleUser"
        label="操作人员"
      >
        <el-input
          v-model="form.handleUser"
        />
      </el-form-item> -->
      <el-form-item
        prop="handleIdea"
        label="催办意见"
      >
        <el-input
          v-model="form.handleIdea"
          type="textarea"
          :rows="8"
          resize="none"
          maxlength="200"
          show-word-limit
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
        @click="handleSubmit()"
      >
        <svg-icon name="save" />确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  components: {
  }
})
export default class extends Vue {
    @Prop()private dialog:any
    private loading:boolean=false
     @Prop({ type: Object, default: {} }) form !: any
    private rules:any = {
      handleIdea: [
        { required: true,pattern: '[^ \x22]+', message: '请输入催办意见', trigger: 'blur' }
      ]
      // handleUser: [
      //   { required: true,pattern: '[^ \x22]+', message: '请输入操作人员', trigger: 'blur' }
      // ]
    }
    private handleSubmit() {
      this.loading = true
      let form = (this.$refs.ruleForm as any)
      form.validate((valid) => {
        if (valid) {
          this.$http.post('evt/urg/addUrg',this.form).then((res: any) => {
            if (res.code === 200){
              this.loading = false
              this.$base.win.msg('成功','success')
              this.handleCancel()
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
    private handleCancel(): void {
      this.dialog.visible = false
      let dialog = {
        title: '催办',
        visible: false
      }
      this.$emit('update:dialog', dialog)
      this.$emit('emitLoad')
    }
}
</script>
 
<style lang="scss" scoped>

</style>
