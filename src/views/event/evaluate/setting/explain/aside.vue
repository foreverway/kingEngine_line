<template>
  <div
    class="nav-wrapper ke-body"
    :class="{
      'w190': !show, 'w30': show
    }"
  >
    <header
      :class="{
        'between': !show, 'tc': show
      }"
    >
      <span v-show="!show">分类导航</span>
      <i
        class="el-icon-arrow-left"
        @click="show = !show"
      />
    </header>
    <el-tree
      v-show="!show"
      :data="treeData"
      :props="defaultProps"
      :highlight-current="true"
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
  @Prop({ type: Object, default: {} }) selectTree !: any
  private pageName = '导航'
  private show: boolean = false
  // 列表数据
  private treeData: Array<any> = []
  private defaultProps: any= {
    children: 'children',
    label: 'text'
  }
  created() {
    // console.log(this.parentId + '---------')
    this.initTreeData()
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/systemFile/findSystemFileTree',
      method: 'post',
      data: {}
    }).then((res: any) => {
      console.log(res)
      this.treeData = res.data
    })
  }
  private handleNodeClick(data: any) :void {
    // console.log(Number(data.id))
    this.$emit('update:selectTree', data)
  }
}
</script>
<style lang="scss" scoped>
.w190{
  width: 190px;
  transition: all linear 0.4s;
}
.w30{
  width: 30px;
  transition: all linear 0.4s;
}
.nav-wrapper{
  margin-right: 0;
  .tc{
    justify-content: center;
  }
  .between{
    justify-content: space-between;
  }
  header{
    display: flex;
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
