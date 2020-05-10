<template>
  <span>
    <el-input
      v-model="newText"
      :placeholder="placeholder"
      clearable
      @clear="handleClear"
    >
      <i
        slot="suffix"
        class="el-input__icon dr-cursor el-icon-user-solid"
        @click="handleCreate"
      />
    </el-input>
    <input
      type="text"
      class="hide"
      :value="value"
      @input="change($event)"
    >
    <component
      :is="path"
      v-if="dialog.visible"
      :dialog.sync="dialog"
      @setData="setData"
    />
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  components: {
    user: () => import('./user.vue'),
    driver: () => import('./driver.vue'),
    administrativeArea: () => import('./administrativeArea.vue') ,
    observer: () => import('./observerobsOne.vue') 
  }
})
export default class extends Vue {
  // 弹窗选择时的标题
    @Prop() private title:any
    // 绑定的path
    @Prop() private path:any
    @Prop({default: '请选择'}) private placeholder!:string
    // 搜索时带的参数
    @Prop() private params!:any
    // 搜索时的url
    @Prop({default: null}) private url!:string
    // 返回值的name
    @Prop({default: 'id'}) private valueField!:string
    // 返回名称的name
    @Prop({default: 'userName'}) private textField!:string
    // 绑定的值
    @Prop() private value:any
    // 绑定的name
    @Prop() private text:any
    // 绑定的name新
    private newText:string=''
    private loading:boolean=false
    private options:Array<any>=[]
    private pars:any
    private dialog: any = {
      title: this.title,
      visible: false
    }
    private handleCreate(): void {
      this.dialog.visible = true
      this.dialog.title = this.dialog.title || '弹窗选择'
    }
    private change(val:string) {
      this.$emit('input', val)
    }
    private setData(item:any){
      debugger
      this.$emit('input', item[this.valueField])
      this.newText = item[this.textField]
    }
    private handleClear(){
      this.$emit('input', null)
      this.newText = ''
    }
    @Watch('text')
    private onTextChanged(newVal:string,oleVal:string){
      this.newText = newVal
    }
}
</script>
<style lang="scss" scoped>
 .hide{
   display: none;
 }
 .el-input__icon{
   cursor: pointer;
   float: right;
   &:hover{
    color:#1989fa;
  }
 }
</style>
