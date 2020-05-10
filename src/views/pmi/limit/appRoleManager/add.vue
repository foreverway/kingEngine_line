<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <div
      v-loading="loading"
      class="add-department"
    >
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
            :roles.sync="roles"
          />
        </el-tab-pane>
        <el-tab-pane
          label="对应角色"
          name="second"
        >
          <roles
            ref="myRoles"
            :roles.sync="basicData.roles"
          />
        </el-tab-pane>
        <el-tab-pane
          label="APP菜单权限"
          name="third"
        >
          <menus
            ref="myLimit"
            :menus.sync="basicData.menus"
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
  name: 'AppRoleManagerAdd',
  components: {
    BasicInfo: () => import('./basic.vue'),
    Roles: () => import('./roles.vue'),
    Menus: () => import('./menus.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: object
  @Prop({ type: Object, default: {} }) dialog !: any
  private activeName:string = 'first'
  private saveFlag: boolean = false
  private basicData: object = this.selectionItem
  private loading: boolean = false
  public $refs: any = { quickEntry: HTMLFormElement }
  private roles: any = {
    name: '111'
  }
  private saveLoading: boolean = false

  async handleSave() {
    // console.log(this.title)
    await this.$refs.myBasic.submitForm()
    // // console.log(this.basicData)
    await this.$refs.myRoles.commitRoles()
    await this.$refs.myLimit.commitMenus()
    this.saveLoading = true
    await this.editApp()
    this.saveLoading = false
    // this.$emit('update:visible', false)
  }
  private editApp() {
    let res = new Promise((resolve, reject) => {
      this.loading = true
      let url = ''
      if (this.dialog.title === '新增') {
        url = '/appRole/addAppRole'
      } else {
        url = '/appRole/updateAppRole'
      }
      this.$http.request({
        url: url,
        method: 'post',
        data: this.basicData
      }).then((response: any) => {
        // console.log(res)
        this.loading = false
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$emit('update:dialog', dialog)
        this.$base.win.msg('成功', 'success')
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
  .add-department{
    height: 440px;
  }
</style>
