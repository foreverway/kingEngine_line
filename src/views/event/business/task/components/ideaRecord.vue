<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="640px"
  >
    <div class="add-department">
      <el-table
        ref="eltableCurrentRow"
        v-loading="listLoading"
        :data="tableData"
        stripe
        height="300px"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          prop="operatorName"
          label="操作人"
        />
        <el-table-column
          align="center"
          label="操作时间"
          prop="operaterTime"
          show-overflow-tooltip
        />
        <el-table-column
          prop="handleIdea"
          align="center"
          label="意见"
          show-overflow-tooltip
        />
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'ideaRecord'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog !: any
  @Prop({ type: Number, default: 0 }) id !: any
  @Prop({ type: Number, default: 0 }) type !: any
  private listLoading:boolean=true
  private tableData:Array<any>=[]
  private url:any
  created() {
    this.initURL(this.type)
  }
  // type 1:督办 2：撤回 3：催办 4：回退
  private initURL(type?:number):void{
    switch (type){
    case 1:
      this.url = ''
      this.initData()
      break
    case 2:
      this.url = ''
      this.initData()
      break
    case 3:
      this.url = 'evt/urg/findEvtUrgByEvtId'
      this.initData()
      break
    case 4:
      this.url = ''
      this.initData()
      break
    default:
      break
    }

  }
  private initData():void{
    this.listLoading = true
    this.$http.request({
      url: this.url,
      method: 'post',
      data: {id: this.id}
    }).then((res:any) => {
      if (res.code === 200){
        this.listLoading = false
        this.tableData = res.data
      }
    })
  }
  private cancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
</style>
