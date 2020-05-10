<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="800px"
  >
    <el-tabs
      class="details-el-tab"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="基本信息"
        name="first"
      >
        <event-basic />
      </el-tab-pane>
      <el-tab-pane
        label="案件流程"
        name="second"
      >
        <event-flow />
      </el-tab-pane>
      <el-tab-pane
        label="修改信息"
        name="third"
      >
        <update-rows />
      </el-tab-pane>
      <el-tab-pane
        label="知识库"
        name="forth"
      >
        <knowle-dge />
      </el-tab-pane>
    </el-tabs>
    <footer>
      <span>当前环节：<span class="bold">办理登记</span> </span>
      <span>已用时间：<span class="orange">20分18秒</span> </span>
      <span>上一环节：（案件登记） </span>
      <span>办理意见：无 </span>
    </footer>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'Search',
  components: {
    EventBasic: () => import('./basic.vue'),
    UpdateRows: () => import('../task/updateRows.vue'),
    KnowleDge: () => import('../task/knowledge.vue'),
    EventFlow: () => import('../task/components/flow.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectItems !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectItems)
  created() {
  }
  private handleClick(): void {
    console.log('11')
  }
}
</script>

<style lang="scss" scoped>
footer{
  display: flex;
  justify-content: space-between;
  padding-top: 14px;
  margin-top: 20px;
  border-top:1px solid #CCCCCC;
}
.bold{
  font-weight: bold;
}
.orange{
  color: #FFBA00;
  font-weight: bold;
}
</style>
<style lang="scss">
.details-el-tab{
  .el-tabs__content{
    height: 400px;
    .el-tab-pane{
      height: 100%;
      .el-container{
        height: 100%;
      }
    }
  }
}
</style>
