<template>
  <div class="menus">
    <el-tree
      ref="tree"
      :data="menusData"
      :props="props"
      node-key="id"
      :default-checked-keys="checkedKeys"
      show-checkbox
      highlight-current
      @check-change="handleCheck"
    />
    <!--:default-expanded-keys="checkedKeys" -->
    <!-- <el-button @click="getData">dedao</el-button> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Array, default: {} }) privileges !: any
  @Prop({ type: Number, default: 0 }) types !: number // 详情参数
  private input: string = ''
  private value: any = []
  private menusData: Array<any> = []
  // 默认选中的
  private checkedKeys: Array<any> = []
  public $refs: any = { quickEntry: HTMLFormElement }
  private props: object = {
    label: 'menuName',
    children: 'children'
  }
  mounted() {
    this.initData()
    // console.log(this.menus)
    if (this.privileges.length) {
      this.formateMenus()
    }
  }
  private formateMenus(): void {
    let data = this.$base.common.extend(this.privileges)
    data.forEach((el: any) => {
      this.checkedKeys.push(el.id)
    })
  }
  // 初始化角色数据
  private initData(): void {
    this.$http.request({
      url: '/pmi/menu/tree',
      method: 'get',
      params: this.types ? {disabledAll: 1} : {}
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
      let array: any = []
      arr.forEach((val,key) => {
        array.push( val.id )
      })
      this.$emit('update:privileges', array)
      resolve()
    })
    return res
  }
  @Watch('privileges')
  private onDialogVisibleChanged(val: any, oldVal: any): void {
    if (this.id) {
      this.initData()
      this.formateMenus()
    }
  }
}
</script>

<style lang="scss" scoped>
.menus{
  height: 380px;
}
.el-checkbox{
  margin-right: 10px;
}
</style>
