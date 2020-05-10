<template>
  <el-dialog
    v-dialog-drag
    :title="settingsDialog.title"
    :visible.sync="settingsDialog.visible"
    :modal-append-to-body="false"
    width="500px"
    :close-on-click-modal="false"
  >
    <div class="add-department">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="个人信息"
          name="first"
        >
          <information
            ref="myBasic1"
            :selection-item="selectionItem"
            :data-params.sync="params"
          />
        </el-tab-pane>
        <el-tab-pane
          label="修改密码"
          name="second"
        >
          <changePwd
            ref="myBasic2"
            :selection-item="selectionItem"
            :data-params.sync="params"
          />
        </el-tab-pane>
      </el-tabs>
      <div class="opeate-buttons">
        <el-button
          @click="cancel"
        >
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { getUserId } from '@/utils/cookies'
@Component({
  name: '',
  components: {
    information: () => import('./information.vue'),
    changePwd: () => import('../changePwd/index.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) settingsDialog !: any
  private saveLoading: boolean = false
  private activeName:string = 'first'
  public userId: number = getUserId()
  public $refs: any = { quickEntry: HTMLFormElement }
  private selectionItem: any = {}
  private params: any = {
    userId: this.userId,
    newLoginPwd: '',
    oldLoginPwd: '',
    userMobile: '',
    email: '',
    userName: '',
    deptName: '',
    type: 0 // 1 修改密码  2 修改用户信息
  }
  created() {
    this.initTableData()
  }
  private initTableData(): void {
    this.$http
      .request({
        url: `/pmi/user/${this.userId}`,
        method: 'get',
        params: {id: this.userId}
      })
      .then((res: any) => {
        if (res.code === 200){
          this.selectionItem = res.data
        }
      })
  }
  private handleClick(tab: any, event: any): void {
    // console.log(tab, event);
  }
  async handleSave() {
    await this.$refs.myBasic2.submitForm()
    await this.$refs.myBasic1.submitForm()
    this.saveLoading = true
    await this.editApp()
  }
  private editApp() {
    this.$http.request({
      url: this.params.type === 1 ? '/pmi/user/password' : 'pmi/user/updateConcat',
      method: 'put',
      data: this.params
    }).then((response: any) => {
      this.saveLoading = false
      if (response.code === 200) {
        let dialog = {
          title: '',
          visible: false,
          isAdd: true,
          type: 1
        }
        this.$emit('update:settingsDialog', dialog)
      }
      this.$base.win.msgJson(response)
    }).catch(() => {
      this.saveLoading = false
      this.$base.win.msg('保存失败', 'error')
    })
  }
  private cancel(): void {
    let settingsDialog = {
      title: '',
      visible: false,
      type: 0
    }
    this.$emit('update:settingsDialog', settingsDialog)
  }
}
</script>

<style lang="scss" scoped>
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  .el-input,.el-select,.el-cascader{
    width: 100%;
  }
  // .el-input-rank{
  //   width: 170px;
  // }
  .no-margin{
    margin-bottom: 0px;
  }
</style>
