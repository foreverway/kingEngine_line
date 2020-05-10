<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <div class="ke-clear">
            <div class="ke-buttons ke-float-left">
              <el-button @click="handleEdit">
                <svg-icon name="edit" />修改
              </el-button>
              <el-button @click="handleReload">
                <svg-icon name="reset" />刷新
              </el-button>
            </div>
          </div>
        </el-header>
        <el-main>
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="tableData"
            stripe
            height="100%"
            style="width: 100%"
            @row-click="handleClickRow"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="index"
              align="center"
            />
            <el-table-column
              type="selection"
              align="center"
            />
            <el-table-column
              prop="limitRuleName"
              label="时限名称"
              align="center"
            />
            <el-table-column
              prop="createTime"
              label="创建时间"
              align="center"
            />
            <el-table-column
              prop="description"
              label="时限描述"
              align="center"
            />
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
            @size-change="initTableData(1)"
          />
        </el-footer>
      </el-container>
    </el-main>
    <add-form
      v-if="dialog.visible"
      :limit-rule="limitRule"
      :dialog.sync="dialog"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'timeLimit',
  components: {
    AddForm: () => import('./add.vue')
  }
})
export default class extends Vue {
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private limitRule: string = ''
  private tableData: Array<any> = []
  // 选中要修改的数据
  private selectionItem: any = {}
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page
  }
  created() {
    this.initTableData()
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  private initTableData(page?:any): void {
    if (page){
      this.params.page = 1
      this.params.total = 0
    }
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http.request({
      url: '/evt/timeLimitSetting/findTimeLimitSettingPage',
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
  private handleEdit(): void {
    this.$base.grid.row(this.selections).then((row: any) => {
      this.limitRule = this.selections[0].limitRule
      this.dialog.title = '修改'
      this.dialog.visible = true
      this.dialog.isAdd = false
    }).catch(() => {})
  }
  private handleReload(): void {
    this.$base.common.reload(this)
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
}
</script>

<style lang="scss" scoped>
</style>
