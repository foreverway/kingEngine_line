<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="520px"
  >
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="0px"
    >
      <el-form-item
        prop="note"
      >
        <el-input
          v-model="tableData.content"
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
      <el-button @click="cancel">
        <svg-icon name="close" />取 消
      </el-button>
      <el-button
        type="primary"
        @click="submitForm"
      >
        <svg-icon name="save" />确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'PublishMsg'
})
export default class extends Vue {
  // @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  // private tableData: any = this.$base.common.extend(this.selectionItem)
  private tableData:any={}
  private rules:object = {
    content: [
      { required: true, message: '请输入留言', trigger: 'change' }
    ]
  }
  created() {
  }
  private saveData(): void { // 保存/修改 接口
    this.tableData.title = '1'
    this.tableData.msgType = 0
    this.$http.request({
      url: '/evt/messageboard/addMessageboard',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      let dialog = {
        title: '',
        visible: false,
        isAdd: true
      }
      this.$emit('update:dialog', dialog)
      this.$base.win.msg('成功', 'success')
      this.$emit('emitLoad',1)
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
</style>
