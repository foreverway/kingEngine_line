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
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'App',
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: {} }) dept!: any
  private input: string = ''
  private value: any = []
  private menusData: Array<any> = []
  // 默认选中的
  private checkedKeys: Array<any> = []
  public $refs: any = { quickEntry: HTMLFormElement }
  private props: object = {
    label: 'name',
    children: 'children'
  }
  mounted() {
    this.initData()
    // console.log(this.menus)
    if (this.dept.length) {
      this.formateMenus()
    }
  }
  private formateMenus(): void {
    let data = this.$base.common.extend(this.dept)
    data.forEach((el: any) => {
      this.checkedKeys.push(el.id)
    })
  }
  // 初始化角色数据
  private initData(): void {
    this.$http.request({
      url: '/pmi/department/tree/user',
      method: 'get',
      data: {}
    }).then((res: any) => {
      this.menusData = res.data
    }).catch((error: any) => {
      this.$base.win.msg(error, 'error')
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
      this.$emit('update:dept', arr)
      resolve()
    })
    return res
  }
  private form2(): any {
    let arr = this.$refs.tree.getCheckedNodes()
    let list:any = []
    arr.forEach((el: any) => {
      if (!el.children){
        list.push({name: el.name,id: el.id,type: 'dept'})
      }
    })
    this.$emit('update:dept', list)
  }
}
</script>

<style lang="scss" scoped>
.menus{
  max-height: 380px;
}
.el-checkbox{
  margin-right: 10px;
}
</style>
