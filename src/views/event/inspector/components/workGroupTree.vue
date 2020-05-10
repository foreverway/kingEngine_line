<!-- 工作网格选择树 -->
<template>
  <el-cascader
    ref="treeCascader"
    v-model="treeValue"
    clearable
    value="value"
    :props="props"
    placeholder="请选择工作网格"
    :options="options"
    :show-all-levels="false"
    @change="handleChange"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'DrTree'
})
export default class extends Vue {
    // 绑定的值
    @Prop() private value:any
    private treeValue: any = []
    private options:Array<any>=[]
    private props:any = {
      multiple: true
    }
    mounted() {
      this.treeValue = this.value ? this.value.split(',') : []
      console.log('mounted',this.treeValue)
      this.handleGetGroup()
    }

    @Watch('value')
    handleValueChange(newVal,oldVal){
      console.log('change',newVal)
      this.treeValue = this.value ? this.value.split(',') : []
    }
    private groupFactory(item){
      return Object.assign({
        value: item.id,
        label: item.gridName,
        leaf: true
      },item)
    }
    private FormatGroup(list:Array<any>){
      // eslint-disable-next-line guard-for-in
      for (let i in list){
        list[i] = this.groupFactory(list[i])
      }
      return list
    }
    private handleGetGroup(){
      this.$http({
        url: '/obs/workGrid/findAllWorkGridList',
        method: 'post'
      }).then((res) => {
        this.options = this.FormatGroup(res.data)
      })
    }
    change(val:string) {
      console.log('val',val)
      this.$emit('input', val)
    }
    handleChange(val:any){
      this.$nextTick(() => {
        let tree = this.$refs.treeCascader as any
        let nodes = tree.getCheckedNodes(true)
        let ids:any = []
        nodes.forEach((item) => {
          ids.push(item.data.id)
        })
        this.$emit('update:value',ids.join(','))
        // console.log()
        // this.$emit('change', ids.join(','), nodes, tree)
      })
    }
}
</script>
<style lang="scss" scoped>

</style>
