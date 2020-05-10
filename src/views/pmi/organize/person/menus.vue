<template>
  <div class="menus">
    <el-tree
      ref="tree"
      :data="menusData"
      :check-strictly="flg"
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Number, default: 0 }) types !: number // 详情参数
  @Prop({ type: Array, default: [] }) departments !: any
  private input: string = ''
  private flg: boolean = true
  private value: any = []
  private menusData: Array<any> = []
  // 默认选中的
  private checkedKeys: Array<any> = []
  private data: any = []
  public $refs: any = { quickEntry: HTMLFormElement }
  private props: object = {
    label: 'name',
    children: 'children'
  }
  mounted() {
    this.initData()
    if (this.departments.length) {
      this.formateMenus(this.departments)
    }
  }
  private formateMenus(list:any): void {
    let data = this.$base.common.extend(list)
    data.forEach((el: any) => {
      this.checkedKeys.push(el.id)
    })
  }
  // 初始化角色数据
  private initData(): void {
    this.$http.request({
      url: '/pmi/department/tree',
      method: 'get',
      params: this.types ? {disabledAll: 1} : {}
    }).then((res: any) => {
      this.menusData = res.data
    })
  }
  private handleCheck(data: any, flg: boolean) {
    let arr = this.$refs.tree.getCheckedNodes()
    if (flg) {
      if (data && this.checkedKeys.join(',').indexOf(data.id) === -1){
        this.checkedKeys.push(data.id)
      }
      if (data && data.parentId && this.checkedKeys.join(',').indexOf(data.parentId) === -1){
        this.checkedKeys.push(data.parentId)
      }
    } else {
      if (arr.length === 0) {
        return 
      }
      let arry: any = [data]
      let k = 0
      do {
        for (let j = 0; j < arr.length; j++){
          if (arr[j].parentId === arry[k].id) {
            arry.push(arr[j])
          }
        }
        k++
      } while (k > arry.length)
      for (let i = 0; i < arry.length; i++){
        let newarry: any = []
        for (let l = 0; l < this.checkedKeys.length; l++){
          if (this.checkedKeys[l] !== arry[i].id) {
            newarry.push(this.checkedKeys[l])
          }
        }
        this.checkedKeys = newarry
      }
    }
    this.initData()
  }
  private commitMenus() {
    let res = new Promise((resolve, reject) => {
      let arr = this.$refs.tree.getCheckedNodes()
      let ids: any = []
      arr.forEach((el: any) => {
        ids.push(el.id)
      })
      if (ids.length === 0) {
        ids = [0]
      }
      this.$emit('update:departments', ids)
      resolve()
    })
    return res
  }
  @Watch('departments')
  private onDialogVisibleChanged(val: any, oldVal: boolean): void {
    let len = val.length
    this.handleCheck(val[len - 1],true)
    this.formateMenus(val)
    // if (!this.id ) {
    //   let len = val.length
    //   this.handleCheck(val[len - 1],true)
    // } else if (val.length){
    //   // this.checkedKeys = []
    //   this.formateMenus(val)
    // }
  }
}
</script>

<style lang="scss" scoped>
.el-checkbox{
  margin-right: 10px;
}
</style>
