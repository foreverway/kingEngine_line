<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
    append-to-body
  >
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="60px"
    >
      <el-form-item
        label="点评"
        prop="note"
      >
        <el-input
          v-model="tableData.note"
          type="textarea"
          :rows="8"
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
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'comment'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private rules:object = {
    note: [
      { required: true, message: '请输入点评', trigger: 'change' }
    ]
  }
  created() {
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/dictionary/addOrUpdateDictionary',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      // console.log(res)
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
        // console.log(this.tableData)
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
</style>
