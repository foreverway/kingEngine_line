<template>
  <div class="menus">
    <el-tree
      ref="tree"
      :data="menusData"
      :props="props"
      node-key="id"
      :default-checked-keys="checkedKeys"
      :default-expanded-keys="checkedKeys"
      show-checkbox
      @check-change="handleCheck"
    />
    <!-- <el-button @click="getData">dedao</el-button> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: [] }) department !: any
  private input: string = ''
  private value: any = []
  // private menusData: Array<any> = []
  private menusData: Array<any> = [
    {
      text: '图片',
      children: [
        {
          text: '美术'
        }
      ]
    },
    {
      text: '音乐',
      children: [
        {
          text: 'heiyou'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    }
  ]
  // 默认选中的
  private checkedKeys: Array<any> = []
  public $refs: any = { quickEntry: HTMLFormElement }
  private props: object = {
    label: 'text',
    children: 'children'
  }
  mounted() {
    // this.initData()
    if (this.department.length) {
      this.formateMenus()
    }
  }
  private formateMenus(): void {
    let data = this.$base.common.extend(this.department)
    data.forEach((el: any) => {
      this.checkedKeys.push(el.id)
    })
  }
  // 初始化角色数据
  private initData(): void {
    this.$http.request({
      url: '/dept/getDepartTreeData',
      method: 'post',
      data: {}
    }).then((res: any) => {
      this.menusData = res.data
    })
  }
  private handleCheck(data: any) {
    let arr = this.$refs.tree.getCheckedNodes()
  }
  private commitDepartment() {
    let res = new Promise((resolve, reject) => {
      let arr = this.$refs.tree.getCheckedNodes()
      this.$emit('update:department', arr)
      resolve()
    })
    return res
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox{
  margin-right: 10px;
}
</style>
