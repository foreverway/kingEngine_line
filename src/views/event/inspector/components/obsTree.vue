<!-- 根据工作组选择人员 -->
<template>
  <el-cascader
    ref="treeCascader"
    v-model="treeValue"
    placeholder="请选择监督员"
    clearable
    value="value"
    :props="props"
    :options="options"
    :show-all-levels="false"
    @change="handleChange"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'DrTree'
})
export default class extends Vue {
    // 绑定的值
    @Prop() private value:any
    private treeValue: any = []
    private options:Array<any>=[]
    private props:any = {
      multiple: false
    }
    created() {
      this.handleGetGroup()
    }
    private obsFactory(item){
      return Object.assign({
        value: item.id,
        label: item.userName
      },item)
    }
    private groupFactory(item){
      return Object.assign({
        value: item.id,
        label: item.workGroupName,
        children: item.observers
      },item)
    }
    private FormatGroup(list:Array<any>){
      // eslint-disable-next-line guard-for-in
      for (let i in list){
        list[i] = this.groupFactory(list[i])
        if (list[i].observers && list[i].observers.length > 0){
          for (let j in list[i].observers){
            if (list[i].observers[j]){
              list[i].observers[j] = this.obsFactory(list[i].observers[j])
            }
          }
        }
      }
      return list
    }
    private handleGetGroup(){
      this.$http({
        url: '/obs/workGroup/findWorkGroupList',
        method: 'post'
      }).then((res) => {
        this.options = this.FormatGroup(res.data)
        console.log(this.options)
      })
    }
    change(val:string) {
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
        // this.$emit('update:value',ids.join(','))
        this.$emit('update:value', ids.join(','))
      })
    }
}
</script>
<style lang="scss" scoped>

</style>
