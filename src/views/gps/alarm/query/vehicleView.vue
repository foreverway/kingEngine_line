<template>
  <el-dialog
    :title="viewDialog.title"
    :visible.sync="viewDialog.visible"
    width="700px"
  >
    <el-container class="ke-layout-body ka-vehicle">
      <el-main>
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          height="100%"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            align="center"
          />
          <el-table-column
            prop="roleName"
            label="车牌号码"
            align="center"
          />
          <el-table-column
            prop="roleCode"
            label="是否在线"
            align="center"
          />
          <el-table-column
            prop="note"
            label="车辆类型"
            align="center"
          />
          <el-table-column
            prop="note"
            label="所属部门"
            align="center"
          />
        </el-table>
      </el-main>
      <el-footer height="auto">
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper"
          :total="total"
          :current-page.sync="params.page"
          :page-size.sync="params.rows"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: ''
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) viewDialog !: any
  // 表格数据是否正在加载
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    name: ''
  }
  created() {
    this.initTableData()
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/role/findRolesByPage',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.total = res.total
        this.tableData = res.rows
      })
      .finally(() => {
        this.listLoading = false
      })
  }
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private cancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:viewDialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
  .ka-vehicle {
    height: 400px;
  }
</style>
