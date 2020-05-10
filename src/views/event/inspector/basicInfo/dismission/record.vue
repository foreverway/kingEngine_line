<template>
  <el-dialog
    v-dialog-drag
    title="离职记录"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <div class="table-container">
      <el-table
        ref="eltableCurrentRow"
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
        height="100%"
      >
        <el-table-column
          type="index"
          align="center"
          fixed="left"
        />
        <el-table-column
          prop="operatorUserName"
          label="操作人员"
          align="center"
          fixed="left"
        />
        <el-table-column
          prop="leftTime"
          label="离职时间"
          width="100"
          align="center"
          fixed="left"
        />
        <el-table-column
          prop="reason"
          label="离职原因"
          :show-overflow-tooltip="true"
          align="center"
          fixed="left"
        />
      </el-table>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import { Prop,Component } from 'vue-property-decorator'
@Component({
  name: 'Record'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private tableData: Array<any> = []
  private listLoading: Boolean = true
  private handleInitTableData(): void{
    this.listLoading = true
    this.$http({
      url: '/obs/dimission/findDimissionRecord',
      method: 'post',
      data: {
        obsId: this.dialog.id
      }
    }).then((res) => {
      this.tableData = res.data
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }
  created(){
    this.handleInitTableData()
  }
}
</script>
<style lang="scss" scoped>
.table-container{
  height: 300px;
}
</style>
