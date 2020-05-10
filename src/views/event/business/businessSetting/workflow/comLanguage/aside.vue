<template>
  <div
    class="nav-wrapper ke-body"
    :class="{
      'w190': !show, 'w30': show
    }"
  >
    <header>
      <span v-show="!show">流程列表</span>
      <i
        class="el-icon-arrow-left"
        @click="show = !show"
      />
    </header>
    <el-tree
      v-show="!show"
      :data="treeData"
      :props="defaultProps"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'App'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  private pageName = '导航'
  private show: boolean = false
  private parentId: number = this.id
  private params: any= {
    allVersion: true
  }
  // 列表数据
  private treeData: Array<any> = []
  private defaultProps: any= {
    children: 'children',
    label: 'processDefinitionName'
  }
  created() {
    // console.log(this.parentId + '---------')
    this.initTreeData()
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/event/queryAllFlowData',
      method: 'post',
      data: this.params
    }).then((res: any) => {
      this.treeData = res.rows
    })
  }
  private handleNodeClick(data: any) :void {
    // console.log(Number(data.id))
    this.$emit('update:id', Number(data.id))
  }
}
</script>
<style lang="scss" scoped>
.w190{
  width: 330px;
  transition: all linear 0.4s;
}
.w30{
  width: 30px;
  transition: all linear 0.4s;
}
.nav-wrapper{
  // height: 100%;
  // background: #fff;
  // border-radius: 4px;
  // padding: 10px;
  // box-sizing: border-box;
  header{
    display: flex;
    justify-content: space-between;
    color: #4a5460;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 30px;
    i{
      font-weight: 600;
      cursor: pointer;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      border-radius: 2px;
      &:hover{
        background-color: rgb(238, 238, 238);
      }
    }
  }
}
</style>
