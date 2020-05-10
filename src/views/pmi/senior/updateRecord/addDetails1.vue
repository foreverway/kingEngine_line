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
          <basic-details
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
            :types="1"
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
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  components: {
    basicDetails: () => import('./basicDetails.vue'),
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
  created() {
    console.log('kkkk',this.basicData.itemList)
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
