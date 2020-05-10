<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <div class="ke-clear">
            <div class="ke-buttons ke-float-left">
              <el-button @click="handleAdd">
                <svg-icon name="add" />新增
              </el-button>
              <el-button @click="handleEdit">
                <svg-icon name="edit" />修改
              </el-button>
              <el-button @click="handleDelete">
                <svg-icon name="remove" />删除
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
              prop="name"
              label="条件组名称"
              align="center"
            />
            <el-table-column
              prop="isDefault"
              label="是否默认"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.isDefault === 2 ? '是':'否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="orderNum"
              label="排序号"
              align="center"
            />
            <el-table-column
              prop="note"
              label="备注"
              align="center"
            />
            <el-table-column
              prop="createUserName"
              label="创建人"
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
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'CaseRechecking',
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
      url: '/evt/repeatCondition/findRepeatConditionPage',
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
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.id = 0
  }
  private handleEdit(): void {
    this.$base.grid.row(this.selections).then((row: any) => {
      this.id = this.selections[0].id
      this.dialog.title = '修改'
      this.dialog.visible = true
      this.dialog.isAdd = false
    }).catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid.remove(this.selections).then((ids: string) => {
      this.$http.request({
        url: '/evt/repeatCondition/deleteRepeatCondition',
        method: 'post',
        data: {
          ids: ids
        }
      }).then((res: any) => {
        this.$base.win.msg('成功', 'success')
        this.initTableData()
      })
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
