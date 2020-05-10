<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="850px"
    append-to-body
    :close-on-click-modal="false"
  >
    <div
      v-loading="loading"
      class="add-department"
      style="min-height:500px;"
    >
      <el-tabs
        v-model="activeName"
        class="add-el-personnel"
        @tab-click="handleClick"       
      >
        <el-tab-pane
          label="选择人员"
          name="first"
        >
          <choice-personnel-form1
            :id="id"
            ref="myBasic"
            :active-name.sync="activeName"
            :user.sync="basicData.user"
            :save-flag="saveFlag"
          />
        </el-tab-pane>
        <el-tab-pane
          label="选择部门"
          name="second"
          class="pane-item"
        >
          <choice-personnel-form2
            ref="dept"
            :dept.sync="basicData.dept"
          />
        </el-tab-pane>
        <el-tab-pane
          label="选择角色"
          name="third"
          class="pane-item"
        >
          <choice-personnel-form3
            ref="role"
            :role.sync="basicData.role"
          />
        </el-tab-pane>
        <el-tab-pane
          label="选择巡查员"
          name="fourth"
          class="pane-item"
        >
          <choice-personnel-form4
            ref="patrol"
            :patrol.sync="basicData.patrol"
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
  name: '',
  components: {
    ChoicePersonnelForm1: () => import('./choicePersonnel-form1.vue'),
    choicePersonnelForm2: () => import('./choicePersonnel-form2.vue'),
    choicePersonnelForm3: () => import('./choicePersonnel-form3.vue'),
    choicePersonnelForm4: () => import('./choicePersonnel-form4.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Number, default: 0 }) sonId!: number
  @Prop({ type: Object, default: {} }) dialog!: any
  @Prop({ type: Object, default: {} }) selectionItem!: any
  private activeName: string = 'first'
  private saveFlag: boolean = false
  private basicData: any = this.selectionItem
  private tableData: Array<any> = []
  private loading: boolean = false
  public $refs: any = { quickEntry: HTMLFormElement }
  created() {
    // this.initData()
    // console.log(this.basicData)
  }
  async handleSave() {
    await this.$refs.myBasic.form1()
    await this.$refs.dept.form2()
    await this.$refs.role.form3()
    await this.$refs.patrol.form4()
    await this.editApp()
  }
  private editApp() {
    let dialog = {
      title: '',
      visible: false,
      isAdd: true
    }
    this.$emit('update:dialog', dialog)
    const data = this.$base.common.extend(this.basicData)
    this.$emit('update:selectionItem', data)
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
  .add-el-personnel{
    .el-tabs__content{
      height: calc(100% - 55px);
      overflow-y: auto;
    }
  }
</style>

<style lang="scss" scoped>
.el-tabs{
    height: 500px;
    margin-bottom: 20px;
  }
</style>
