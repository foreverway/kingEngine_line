<template>
  <div class="menus">
    <el-tree
      ref="tree"
      :data="menusData"
      :props="props"
      node-key="id"
      :default-checked-keys="checkedKeys"
      show-checkbox
      @check-change="handleCheck"
    />
    <!-- <el-button @click="getData">dedao</el-button> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'AppRoleManagerMenus',
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: {} }) menus !: any
  private input: string = ''
  private value: any = []
  private menusData: Array<any> = []
  // 默认选中的
  private checkedKeys: Array<any> = []
  private data: any = [{
    id: 1,
    label: '一级 1',
    children: [{
      id: 4,
      label: '二级 1-1',
      children: [{
        id: 9,
        label: '三级 1-1-1'
      }, {
        id: 10,
        label: '三级 1-1-2'
      }]
    }]
  }, {
    id: 2,
    label: '一级 2',
    children: [{
      id: 5,
      label: '二级 2-1'
    }, {
      id: 6,
      label: '二级 2-2'
    }]
  }, {
    id: 3,
    label: '一级 3',
    children: [{
      id: 7,
      label: '二级 3-1'
    }, {
      id: 8,
      label: '二级 3-2'
    }]
  }]
  public $refs: any = { quickEntry: HTMLFormElement }
  private props: object = {
    label: 'text',
    children: 'children'
  }
  mounted() {
    this.initData()
    // console.log(this.menus)
    if (this.menus.length) {
      this.formateMenus()
    }
  }
  private formateMenus(): void {
    let data = this.$base.common.extend(this.menus)
    data.forEach((el: any) => {
      this.checkedKeys.push(el.id)
    })
    // console.log(this.checkedKeys)
  }
  // 初始化角色数据
  private initData(): void {
    this.$http.request({
      url: '/appMenu/findAppMenuTree',
      method: 'post',
      data: {
        dbStatus: 1
      }
    }).then((res: any) => {
      // console.log(res)
      this.menusData = res.data
    })
  }
  private handleCheck(data: any) {
    // console.log(data)
    let arr = this.$refs.tree.getCheckedNodes()
    // console.log(arr)
  }
  private commitMenus() {
    let res = new Promise((resolve, reject) => {
      let arr = this.$refs.tree.getCheckedNodes()
      this.$emit('update:menus', arr)
      resolve()
    })
    return res
  }
}
</script>

<style lang="scss" scoped>
.menus{
  height: 350px;
}
.el-checkbox{
  margin-right: 10px;
}
</style>
