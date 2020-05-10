<template>
  <div>
    <el-table
      ref="eltableCurrentRow"
      :data="tableData"
      stripe
      height="390px"
      style="width: 100%"
      @row-click="handleClickRow"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="index"
        align="center"
      />
      <el-table-column
        prop="userName"
        label="接收人员"
        align="center"
      />
      <el-table-column
        prop="userMobile"
        label="接收号码"
        align="center"
      />
      <el-table-column
        prop="deptName"
        label="发送时间"
        align="center"
      />
      <el-table-column
        prop="deptName"
        label="发送状态"
        align="center"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: [] }) roles !: any
  private tableData: any = this.$base.common.extend(this.roles)
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
}
</script>

<style lang="scss" scoped>

</style>
