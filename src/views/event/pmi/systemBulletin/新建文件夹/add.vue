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
        v-if="flag"
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
          label="工作网格"
          name="second"
        >
          <web-info
            ref="myLimit"
            :departments.sync="basicData.departments"
          />
        </el-tab-pane>
        <el-tab-pane
          label="工作人员"
          name="third"
          class="pane-item"
        >
          <person
            ref="myRoles"
            :roles.sync="basicData.roles"
          />
        </el-tab-pane>
      </el-tabs>
      <div class="opeate-buttons">
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
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
  name: 'TaskForm',
  components: {
    BasicInfo: () => import('./basic.vue'),
    WebInfo: () => import('./webInfo.vue'),
    Person: () => import('./person.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Number, default: 0 }) sonId!: number
  @Prop({ type: Object, default: {} }) dialog!: any
  private activeName: string = 'first'
  private saveFlag: boolean = false
  private basicData: any = {}
  private loading: boolean = false
  private flag = false
  public $refs: any = { quickEntry: HTMLFormElement }
  private roles: any = {
    name: '111'
  }
  created() {
    this.initData()
    // console.log(this.basicData)
  }
  private initData() {
    if (this.sonId) {
      this.$http
        .request({
          url: '/user/getUserById',
          method: 'post',
          data: {
            id: this.sonId
          }
        })
        .then((res: any) => {
          // console.log(res)
          this.basicData = res.rows
          this.flag = true
        })
    } else {
      this.basicData = {
        userName: '',
        deptId: '',
        deptName: '',
        loginName: '',
        loginPwd: '',
        userMail: '',
        userMobile: '',
        orderNo: 0,
        note: '',
        is_admin: false,
        userOph: '',
        roles: [],
        departments: []
      }
      this.flag = true
    }
  }
  async handleSave() {
    // console.log(this.title)
    await this.$refs.myBasic.submitForm()
    // // console.log(this.basicData)
    await this.$refs.myRoles.commitRoles()
    await this.$refs.myLimit.commitMenus()
    // console.log(this.basicData)
    await this.editApp()
    // this.$emit('update:visible', false)
  }
  private editApp() {
    let res = new Promise((resolve, reject) => {
      this.loading = true
      this.$http
        .request({
          url: '/user/addOrUpdateUserInfo',
          method: 'post',
          data: this.basicData
        })
        .then((response: any) => {
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
        .catch(() => {
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

<style lang="scss" scoped>
.pane-item{
    height: 100%;
}
.add-department {
  height: 470px;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
// .el-input,.el-select{
//   width: 210px;
// }
.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
