<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
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
            :roles.sync="roles"
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
  private roles: any = {
    name: '111'
  }
  private saveLoading: boolean = false
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
    // margin-bottom: 20px;
  }
</style>
