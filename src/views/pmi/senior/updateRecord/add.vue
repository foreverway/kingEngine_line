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
          label="基础信息"
          name="first"
        >
          <basic-info
            ref="MyBasic"
            :active-name.sync="activeName"
            :basic-data.sync="basicData"
          />
        </el-tab-pane>
        <el-tab-pane
          label="明细"
          name="second"
        >
          <details-info
            ref="MyDetail"
            :items.sync="basicData.itemList"
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
    DetailsInfo: () => import('./details.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  private activeName:string = 'first'
  private basicData: any = this.$base.common.extend(this.selectionItem)
  public $refs: any = { quickEntry: HTMLFormElement }
  private saveLoading: boolean = false
  async handleSave() {
    await this.$refs.MyBasic.submitBasic()
    await this.$refs.MyDetail.commitDetail()
    this.saveLoading = true
    await this.editDeploy()
  }
  created() {
    console.log('jjjjj',this.basicData.itemList)
  }
  private editDeploy() {
    let res = new Promise((resolve, reject) => {
      this.$http.request({
        url: '/pmi/sysDeployLog/addOrUpdateDeployLog',
        method: 'post',
        data: this.basicData
      }).then((response: any) => {
        if (response.code === 200) {
          let dialog = {
            title: '',
            visible: false,
            isAdd: true
          }
          this.$emit('update:dialog', dialog)
          resolve()
        }
        this.saveLoading = false
        this.$base.win.msgJson(response)
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
