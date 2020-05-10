<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
    :close-on-click-modal="false"
  >
    <div class="add-department">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="基本信息"
          name="first"
        >
          <basic-info
            :id="id"
            ref="myBasic"
            :active-name.sync="activeName"
            :selection-item.sync="basicData"
            :save-flag="saveFlag"
          />
        </el-tab-pane>
        <el-tab-pane
          label="接收人员"
          name="second"
        >
          <people
            ref="myRoles"
            :roles.sync="basicData.roles"
          />
        </el-tab-pane>
      </el-tabs>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="handleSave"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  components: {
    BasicInfo: () => import('./basic.vue'),
    People: () => import('./people.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: object
  @Prop({ type: Object, default: {} }) dialog !: object

  private activeName:string = 'first'
  private saveFlag: boolean = false
  private basicData: object = this.$base.common.extend(this.selectionItem)
  public $refs: any = { quickEntry: HTMLFormElement }
  private saveLoading: boolean = false

  async handleSave() {
    // console.log(this.$refs.myBasic.submitForm)
    await this.$refs.myBasic.submitForm()
    // console.log(this.basicData)
    await this.$refs.myRoles.commitRoles()
    console.log(this.basicData)
    this.saveLoading = true
    await this.editPort()
    let dialog = {
      title: '',
      visible: false,
      isAdd: true
    }
    this.$emit('update:dialog', dialog)
    this.$base.win.msg('成功', 'success')
    this.saveLoading = false

  }
  private editPort() {
    let res = new Promise((resolve, reject) => {
      this.$http.request({
        url: '/privilege/addOrUpdatePrivilege',
        method: 'post',
        data: this.basicData
      }).then((response: any) => {
        // console.log(res)
        resolve()
      })
    })
    return res
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
  private handleClick(tab: any, event: any): void {
    // console.log(tab, event);
  }
}
</script>

<style lang="scss" scoped>
  .el-tabs{
    height: 480px;
    margin-bottom: 20px;
  }
</style>
