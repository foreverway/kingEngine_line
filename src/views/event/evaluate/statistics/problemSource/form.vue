<template>
  <el-container class="ke-layout statistics-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-main>
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="tableData"
            stripe
            height="100%"
            show-summary
            style="width: 100%"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            @row-click="handleClickRow"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="数字化城市管理系统问题来源统计表（2018-12-04 至 2018-12-04）"
              align="center"
            >
              <el-table-column
                type="index"
                align="center"
                width="60"
              />
              <el-table-column
                type="selection"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="问题来源"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="上报数"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="有效上报数"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="立案数"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="占区域立案数比例"
                align="center"
                width="160"
              />
              <el-table-column
                prop="roleName"
                label="处置数"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="按期处置数"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="结案数"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="结案率"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="同比"
                align="center"
              />
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer height="auto">
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev, pager, next,total,jumper, sizes"
            :total="params.total"
            :page-size.sync="params.rows"
            :current-page.sync="params.page"
            @current-change="handlePage"
          />
        </el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
})
export default class extends Vue {
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private tableData: Array<any> = [
    {
      roleName: '12'
    },
    {
      roleName: '34'
    },
    {
      roleName: '12'
    },
    {
      roleName: '34'
    },
    {
      roleName: '12'
    },
    {
      roleName: '34'
    },
    {
      roleName: '12'
    },
    {
      roleName: '34'
    },
    {
      roleName: '12'
    },
    {
      roleName: '34'
    }
  ]
  // 弹窗新增或者删除
  private type: string = ''
  // 选中要修改的数据
  private selectionItem: any = {}
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    name: ''
  }
  created() {
    // this.initTableData()
    this.listLoading = false
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http.request({
      url: '/role/findRolesByPage',
      method: 'post',
      data: this.params
    }).then((res: any) => {
      this.params.total = res.total
      this.tableData = res.rows
    }).finally(() => {
      this.listLoading = false
    })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: '/role/deleteRole',
            method: 'post',
            data: {
              ids: ids
            }
          })
          .then((res: any) => {
            this.$base.win.msg('成功', 'success')
            this.initTableData()
          })
      })
      .catch(() => {})
  }
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
  }
}
</script>

<style lang="scss">
.statistics-layout{
  .ke-body{
    padding: 0!important;
    margin: 0!important;
  }
  .el-main{
    padding: 0!important;
  }
}
</style>
