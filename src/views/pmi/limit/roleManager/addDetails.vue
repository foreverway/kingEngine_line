<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="650px"
    :close-on-click-modal="false"
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
          <basic-details
            :id="id"
            ref="myBasic"
            :active-name.sync="activeName"
            :selection-item.sync="basicData"
            :save-flag="saveFlag"
          />
        </el-tab-pane>
        <el-tab-pane
          label="对应人员"
          name="second"
        >
          <roles
            :id="id"
            ref="myRoles"
            :types="1"
            :user-ids.sync="basicData.userIds"
          />
        </el-tab-pane>
        <el-tab-pane
          label="对应资源"
          name="third"
        >
          <menus
            :id="id"
            ref="myMenus"
            :types="1"
            :privileges.sync="basicData.menuIds"
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
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'Add',
  components: {
    basicDetails: () => import('./basicDetails.vue'),
    // BasicInfo: () => import('./basic.vue'),
    Roles: () => import('./roles.vue'),
    Menus: () => import('./menus.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) dialog !: object

  private activeName:string = 'first'
  private saveFlag: boolean = false
  private basicData: any = {}
  private loading: boolean = false
  public $refs: any = { quickEntry: HTMLFormElement }
  private saveLoading: boolean = false
  
  created() {
    this.initData()
  }
  private initData() {
    this.basicData = {
      roleCode: '',
      roleName: '',      
      note: '',
      roleType: 1,
      areaId: 0,
      orderNo: 0,
      userIds: [],
      menuIds: []
    }
    if (this.id) {
      this.$http.request({
        url: `/pmi/role/${this.id}`, 
        method: 'get'
      }).then((res: any) => {
        this.basicData = res.data
        this.basicData.userIds = res.data.users
        this.basicData.menuIds = res.data.menus
      })
    }
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
    height: 470px;
  }
</style>
