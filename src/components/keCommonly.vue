<template>
  <span :class="['ke-commonly-parent',isTop?'ke-commonly-parent-top':'']">
    <el-autocomplete
      ref="word"
      :value="value"
      type="textarea"
      placeholder="请输入或选择常用语"
      :maxlength="max"
      show-word-limit
      resize="none"
      :fetch-suggestions="querySearchAsync"
      @input="change($event)"
    />
    <div class="tools">
      <div
        class="up"
        @click="handleAdd"
      >
        <i
          class="el-icon-plus"
          style="color:#028CFF;"
        />
      </div>
      <div
        class="down"
        handleOpen
      >
        <i class="el-icon-collection" />
      </div>
    </div>
  </span>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'

@Component({
  name: 'DrTree'
})
export default class extends Vue {
    @Prop({default: true}) private isTop!:boolean
    // 最大字符
    @Prop({default: 200}) private max:any
    // 绑定的值
    @Prop() private value:any
    // 附加参数
    @Prop() private params:any
    private list:Array<any>=[]
    change(val:string) {
      this.$emit('input', val)
    }
    handleFocus(){
      (this.$refs.word as any).focus()
    }
    @Watch('params')
    private onParamsChanged(): void {
      this.list = []
    }
    querySearchAsync(queryString:string, cb:any) {
      const flag = this.isSubmit(false)
      if (flag === false){
        cb(null)
        return
      }
      if (this.list.length > 0){
        const list = this.list.filter((item) => {
          return item.value.indexOf(this.value) > -1 
        })
        cb(list)
        return 
      }
      this.$http.request({
        url: 'evt/commonLanguage/findCommonLanguageByFlowTache',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        if (res.data !== null && res.data.length > 0){
          this.list = res.data.map((node) => {
            return {value: node} 
          })
          cb(this.list)
        } else {
          cb(null)
        }
      })
    }
    handleAdd() {
      if (this.value.trim().length === 0){
        this.handleFocus()
        this.$base.win.msg('请输入常用语！')
        return
      }
      const flag = this.isSubmit(true)
      if (flag === false){
        return
      }
      this.$base.win.confirm('确认添加常用语？','添加常用语','warning').then(() => {
        this.params.word = this.value
        this.$http.post('evt/commonLanguage/addCommonLanguage',this.params)
          .then((res) => {
            this.$base.win.msgJson(res)
          })
      })
    }
    private isSubmit(flag):boolean{
      if (!this.params.flowId){
        if (flag) {
          this.$base.win.msg('流程id不能为空') 
        }
        return false
      }
      if (!this.params.sworkFlowTache){
        if (flag) {
          this.$base.win.msg('开始环节不能为空') 
        }
        return false
      }
      // if (!this.params.eworkFlowTache){
      // if (flag) {
      // this.$base.win.msg('结束环节不能为空') 
      // }
      // return false
      // }
      return true
    }
    handleOpen() {
      
    }
}
</script>
<style lang="scss">
.ke-commonly-parent-top{
  .el-autocomplete-suggestion{
     position: absolute;
     top:-65px;
   }
   .el-input__count{
       right:60px;
     }
}
 .ke-commonly-parent{
   width:100%;
   position: relative;
   display: inline-block;
   .el-input__count{
       right:60px;
     }
   .el-autocomplete-suggestion{
     position: absolute;
   }
   .tools{
     position: absolute;
     right:1px;
     top:1px;
     width:50px;
     display: flex;
     height:calc(100% - 2px);
     border-radius: 0 4px 4px 0;
     border-left:1px solid #DCDFE6;
     flex-direction: column;
     > div{
       height:50%;
       width:100%;
       display: flex;
       align-items: center;
       justify-content: center;
       i{
         font-size: 18px;
       }
       i:hover{
         color: #409EFF;
         cursor: pointer;
       }
     }
     .up{
       height: calc(50% - 1px);
       border-bottom:1px solid #DCDFE6;
       i{
         font-weight: 600;
       }
     }
     .down{
       i{
         color:#999;
       }
     }
   }
 }
</style>
