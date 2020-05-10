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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: 'Depart',
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: [] }) disposalUnits !: any
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
    if (this.disposalUnits.length) {
      this.formateMenus()
    }
  }
  private formateMenus(): void {
    let data = this.$base.common.extend(this.disposalUnits)
    this.checkedKeys = data
    // data.forEach((el:any) => {
    //   this.checkedKeys.push(el.id)
    // })
  }
  // 初始化角色数据
  private initData(): void {
    this.$http.request({
      url: '/pmi/department/tree',
      method: 'get',
      params: {}
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
      let ids = arr.map(function name(params:any) {
        return params.id
      })
      this.$emit('update:disposalUnits', ids)
      resolve()
    })
    return res
  }
  @Watch('disposalUnits')
  private onDialogVisibleChanged(val: any, oldVal: any): void {
    if (this.disposalUnits) {
      this.formateMenus()
    }
  }
}
</script>

<style lang="scss" scoped>
.menus{
  height: 430px;
  padding: 20px;
  box-sizing: border-box;
}
.el-checkbox{
  margin-right: 10px;
}
</style>
