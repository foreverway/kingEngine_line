<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="740px"
    :close-on-click-modal="false"
  >
    <el-tabs
      v-model="activeName"
      class="person-tabs"
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
          @func="getMsgFormSon"
        />
      </el-tab-pane>
      <el-tab-pane
        label="所在部门"
        name="second"
      >
        <menus
          :id="sonId"
          ref="myLimit"
          :types="dialog.type"
          :departments.sync="basicData.departmentIds"
        />
      </el-tab-pane>
      <el-tab-pane
        label="拥有角色"
        name="third"
      >
        <roles
          :id="sonId"
          ref="myRoles"
          :types="dialog.type"
          :active-name.sync="activeName"
          :roles.sync="basicData.roleIds"
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
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  components: {
    BasicInfo: () => import('./basic.vue'),
    Roles: () => import('./roles.vue'),
    Menus: () => import('./menus.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Number, default: 0 }) deptId !: number
  @Prop({ type: Number, default: 0 }) sonId !: number
  @Prop({ type: Object, default: {} }) dialog !: any
  private activeName:string = 'first'
  private saveFlag: boolean = false
  private basicData: any = {}
  private loading: boolean = false
  public $refs: any = { quickEntry: HTMLFormElement }
  private saveLoading: boolean = false
  created() {
    this.initData()
    // console.log(this.basicData)
  }
  private initData() {
    this.basicData = {
      userName: '',
      deptId: this.deptId, // 默认部门
      loginName: '',
      loginPwd: '',
      qqNo: '',
      userMail: '',
      userMobile: '',
      userOph: '',
      orderNo: 0,
      note: '',
      isAdmin: false,
      avatarId: 0, // 用户头像id
      departmentIds: [{id: this.deptId}],
      roleIds: []
    }
    if (this.sonId) {
      this.$http.request({
        url: `/pmi/user/${this.sonId}`,
        method: 'get'
      }).then((res: any) => {
        this.basicData = res.data
        this.basicData.img = []
        if (this.basicData.avatarUrl) {
          this.basicData.img = [{name: 'xx.png',id: this.basicData.avatarId,url: this.basicData.avatarUrl}]
          // 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
        }
        this.basicData.roleIds = res.data.roles
        this.basicData.departmentIds = res.data.departments
        if (res.data.departments.length === 0) {
          this.basicData.departmentIds = [{id: 0}]
        }
        console.log('departments',this.basicData.departmentIds)
      })
    }
    console.log('原数据',this.basicData)
  }
  async handleSave() {
    await this.$refs.myBasic.submitForm()
    await this.$refs.myRoles.commitRoles()
    await this.$refs.myLimit.commitMenus()
    this.saveLoading = true
    await this.editApp()
    this.saveLoading = false
    this.$emit('update:visible', false)
  }
  private getMsgFormSon(data) {
    // this.basicData.departmentIds = [data]
    let list = this.basicData.departmentIds
    let flg = false
    list.forEach((el:any,i) => {
      if ( i + 1 === list.length) {
        flg = true
      }
    })
    if (flg) {
      this.basicData.departmentIds.push(data)
    }
  }
  private editApp() {
    let res = new Promise((resolve, reject) => {
      this.loading = true
      this.basicData.userType = 1
      this.$http.request({
        url: this.basicData.id ? `/pmi/user/${this.basicData.id}` : '/pmi/user/',
        method: this.basicData.id ? 'put' : 'post',
        data: this.basicData
      }).then((response: any) => {
        this.loading = false
        if (response.code === 200) {
          let dialog = {
            title: '',
            visible: false,
            isAdd: true
          }
          this.$emit('update:dialog', dialog)
          resolve()
        }
        this.$base.win.msgJson(response)
      }).catch(() => {
        this.loading = false
        this.$base.win.msg('保存失败', 'error')
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

<style lang="scss">
.person-tabs{
  .el-tabs__content{
    height: 420px;
    overflow-y: auto;
  }
}
</style>

<style lang="scss" scoped>
  .el-dialog {
    height: 640px;
  }
</style>
