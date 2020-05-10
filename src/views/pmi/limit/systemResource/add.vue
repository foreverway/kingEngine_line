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
          label="对应角色"
          name="second"
        >
          <roles
            :id="id"
            ref="myRoles"
            :roles.sync="roles"
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  components: {
    BasicInfo: () => import('./basic.vue'),
    basicDetails: () => import('./basicDetails.vue'),
    Roles: () => import('./roles.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) dialog !: object

  private parentId = this.$base.common.extend(this.dialog)
  private activeName:string = 'first'
  private saveFlag: boolean = false
  private basicData: any = {}
  private roles: any = {}
  public $refs: any = { quickEntry: HTMLFormElement }
  private saveLoading: boolean = false

  created() {
    this.initData()
  }
  private initData() {
    this.basicData = {
      menuName: '', // 权限名称
      parentId: this.parentId.parentId, // 父级联id
      menuCode: '', // 资源编码 1
      menuType: '', // 资源类型
      orderNo: 0, // 排序号 1
      menuPath: '', // 资源路径 1
      menuIcon: '', // 资源图标 1
      sysIcon: '', // 系统图标 1
      openType: '', // 打开类型
      doubleScreen: true, // 是否双屏
      note: '' // 备注 1
    }
    this.roles = []// 角色
    if (this.id) {
      this.$http.request({
        url: `/pmi/menu/${this.id}`, 
        method: 'get'
      }).then((res: any) => {
        this.basicData = res.data
        this.roles = res.data.roleList
        if (!this.roles || this.roles.length === 0) {
          this.roles = [{id: 0}]
        }
      })
    }
  }
  async handleSave() {
    await this.$refs.myBasic.submitForm()
    await this.$refs.myRoles.commitRoles()
    this.basicData.roles = this.roles
    await this.editPort()
  }
  private editPort() {
    let res = new Promise((resolve, reject) => {
      this.saveLoading = true
      this.$http.request({
        url: this.basicData.id ? `/pmi/menu/${this.basicData.id}` : '/pmi/menu/add',
        method: this.basicData.id ? 'put' : 'post',
        data: this.basicData
      // eslint-disable-next-line no-shadow
      }).then((res: any) => {
        if (res.code === 200) {
          let dialog = {
            title: '',
            visible: false,
            isAdd: true
          }
          this.$emit('update:dialog', dialog)
          this.$base.win.msg('成功', 'success')
        } else {
          this.$base.win.msg(res.msg, 'error')
        }
        this.saveLoading = false
        resolve()
      }).catch((err: any) => {
        this.saveLoading = false
        this.$base.win.msg(err, 'error')
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
  // @Watch('basicData')
  // private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
  //   debugger
  // }
}
</script>

<style lang="scss" scoped>
  .add-department{
    height: 475px;
  }
</style>
