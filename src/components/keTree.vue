<template>
  <span>
    <el-cascader
      v-if="!isTree"
      ref="treeCascader"
      :props="defaultPropst"
      :options="options"
      :clearable="clearable"
      :value="value"
      :show-all-levels="false"
      @change="handleChange"
      @input="change($event)"
    />
    <el-select
      v-else
      ref="tree"
      :placeholder="placeholder"
      :value="text"
      :clearable="clearable"
      @clear="handleClear"
    >
      <el-option
        :value="value"
        style="height: auto"
      >
        <el-tree
          ref="treeCascader"
          :data="options"
          node-key="id"
          :expand-on-click-node="false"
          highlight-current
          :props="defaultPropst"
          @current-change="handleCheckChange"
        />
      </el-option>
    </el-select>
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'DrTree'
})
export default class extends Vue {
    @Prop({default: true}) private clearable!:boolean
    @Prop({ default: '请选择' }) placeholder!: any
    // 绑定的值
    @Prop() private value:any
    @Prop({default: true}) private isTree:any
    // 绑定的TEXT
    private text:string=''
    private defaultPropst: any= {
      children: 'children',
      label: 'areaName',
      value: 'id',
      checkStrictly: true,
      emitPath: false
    }
    private options:Array<any>=[]
    created() {
      this.$http.request({
        url: '/sys/area/tree',
        method: 'get',
        params: {}
      }).then((res: any) => {
        this.options = res.data
      })
    }
    updated(){
      if (this.value > 0 && this.isTree === true){
        (this.$refs.treeCascader as any).setCurrentKey(this.value)
        const node = (this.$refs.treeCascader as any).getCurrentNode()
        if (node !== null){
          this.text = node.areaName
        }
      }
    }
    @Watch('value')
    private handleValueChange(newVal,oldVal){
      if (newVal === ''){
        this.text = ''
      }
    }
    handleCheckChange(data:any, node:any) {
      (this.$refs.tree as any).blur()
      this.$emit('input', data.id)
      this.text = data.areaName
      this.$emit('change', data, this.$refs.tree)
    }
    handleClear(){
      this.$emit('input', '')
      this.text = ''
    }
    change(val:string) {
      this.$emit('input', val)
    }
    handleChange(val:any){
      let tree = this.$refs.treeCascader as any
      let nodes = tree.getCheckedNodes()
      this.$emit('change', val, nodes, tree)
    }
}
</script>
<style lang="scss" scoped>
 .el-select-dropdown__item{
   padding: 5px 0;
   background: #ffffff;
 }
</style>
