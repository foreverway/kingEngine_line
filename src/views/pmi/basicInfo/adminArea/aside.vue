<template>
  <div
    class="nav-wrapper ke-body"
    :class="{
      'w190': !show, 'w30': show
    }"
  >
    <header>
      <span v-show="!show">分类导航</span>
      <i
        class="el-icon-arrow-left"
        @click="show = !show"
      />
    </header>
    <div
      v-show="!show"
      class="scroll-container"
    >
      <el-tree
        :data="treeData"
        :props="defaultProps"
        highlight-current
        @node-click="handleNodeClick"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'aside'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  private pageName = '导航'
  private show: boolean = false
  private parentId: number = this.id
  // 列表数据
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'text'
  }
  created() {
    // console.log(this.parentId + '---------')
    this.initTreeData()
  }
  @Watch('$route')
  private handleRouteChange(val: any, oldVal: any): void {
    if (val !== oldVal) {
      console.log(val)
      if (!val.query.item) {
        this.initTreeData()
      }
    }
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/area/findAreaTree',
        method: 'post',
        data: {}
      })
      .then((res: any) => {
        // console.log(res)
        this.treeData = res.data
      })
  }
  private handleNodeClick(data: any): void {
    // console.log(data)
    // this.$emit('update:areaSelection', data)
    let arr = JSON.stringify(data)
    if (data.level === 4) {
      this.$router.push({
        path: '/pmi/basicInfo/adminArea/cell',
        query: { item: arr }
      })
    } else {
      this.$router.push({
        path: '/pmi/basicInfo/adminArea/area',
        query: { item: arr }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.scroll-container {
  height: calc(100% - 22px);
}
.w190 {
  width: 190px;
  transition: all linear 0.4s;
}
.w30 {
  width: 30px;
  transition: all linear 0.4s;
}
.nav-wrapper {
  // height: 100%;
  // background: #fff;
  // border-radius: 4px;
  // padding: 10px;
  // box-sizing: border-box;
  header {
    display: flex;
    justify-content: space-between;
    color: #4a5460;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 30px;
    i {
      font-weight: 600;
      cursor: pointer;
      width: 16px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      border-radius: 2px;
      &:hover {
        background-color: rgb(238, 238, 238);
      }
    }
  }
}
</style>
