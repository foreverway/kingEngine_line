<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    :append-to-body="true"
    width="400px"
    :close-on-click-modal="false"
  >
    <div class="add-details">
      <el-form
        ref="ruleForm"
        :model="params"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="系统名称"
          prop="system"
        >
          <el-input v-model="params.system" />
        </el-form-item>
        <el-form-item
          label="发布明细"
          prop="content"
        >
          <el-input v-model="params.content" />
        </el-form-item>
      </el-form>
      <div class="opeate-buttons">
        <el-button @click="handleCancel">
          <svg-icon name="hamburger" />取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          <svg-icon name="hamburger" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) addDetail !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  private params: any = {
    system: '',
    content: ''
  }
  private rules:object = {
    system: [
      { required: true, message: '请输入系统名称', trigger: 'change' }
    ],
    content: [
      { required: true, message: '请输入发布明细', trigger: 'change' }
    ]
  }
  created() {
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          this.$emit('update:addDetail', this.params)
          let dialog = {
            title: '',
            visible: false
          }
          this.$emit('update:dialog', dialog)
          resolve()
        }
      })
    })
    return res
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
  .opeate-buttons{
    text-align: right;
    margin-top: 60px;
  }
  // .el-input,.el-select{
  //   width: 210px;
  // }
  .el-input-rank{
    width: 70px;
  }
  .no-margin{
    margin-bottom: 0px;
  }
</style>
