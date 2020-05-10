<template>
  <span>
    <el-radio-group
      v-if="getType==='radio'"
      :value="value"
      clearable
      @input="change($event)"
    >
      <el-radio
        v-for="(item, key) in options"
        :key="key"
        :label="item.dictValue"
      >
        {{ item.dictName }}
      </el-radio>
    </el-radio-group>
    <el-select
      v-if="getType==='select'"
      ref="select"
      :placeholder="placeholder"
      clearable
      :value="value"
      :disabled="disabled"
      @input="change($event)"
    >
      <el-option
        v-for="(item, key) in options"
        :key="key"
        :label="item.dictName"
        :value="item.dictValue"
      />
    </el-select>
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import IDict from '@/interface/dict'

@Component({
  name: 'DrTree'
})
export default class extends Vue {
    // 是否禁用
    @Prop({ type: Boolean, default: false }) disabled !: boolean
    // 字典code
    @Prop() private code!:string
    // 组件显示类型combo radio checkbox
    @Prop() private type!:string
    // 绑定的值
    @Prop() private value:any
    @Prop() private placeholder:any
    private options:Array<IDict>=[]
    async created() {
      this.options = await this.$base.dict.getItems(this.code)
      // console.log(this.options)
    }
    change(val:string) {
      this.$emit('input', val)
    }
    get getType(){
      if (this.options.length === 0){
        return 'select'
      }
      if (this.type){
        return this.type
      }
      if (this.options.length < 4){
        return 'radio'
      }
      return 'select'
    }
}
</script>
<style lang="scss" scoped>

</style>
