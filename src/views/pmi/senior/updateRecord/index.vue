<template>
  <div class="page">
    <el-container>
      <el-container>
        <el-main class="ke-body">
          <div class="ke-buttons">
            <el-button
              v-power  
              code="add" 
              @click="handleAdd"
            >
              <svg-icon name="add" />新增
            </el-button>
            <el-button 
              v-power  
              code="edit"
              @click="handleEdit"
            >
              <svg-icon name="edit" />修改
            </el-button>
            <el-button 
              v-power  
              code="del"
              @click="handleDelete"
            >
              <svg-icon name="remove" />删除
            </el-button>
            <el-button 
              v-power  
              code="refresh"
              @click="handleReload"
            >
              <svg-icon name="reset" />刷新
            </el-button>
          </div>
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="tableData"
            stripe
            style="width: 100%"
            height="100%"
            @row-click="handleClickRow"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleDbclick"
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
              prop="version"
              label="系统版本"
              align="center"
            />
            <el-table-column
              prop="deployTime"
              label="发布时间"
              align="center"
            />
            <el-table-column
              prop="remark"
              label="备注"
              align="center"
            />
          </el-table>
          <el-footer>
            <el-pagination
              background
              class="ke-page"
              :page-sizes="[10,20,30,50,100]" 
              layout="prev, pager, next,total,jumper, sizes"
              :total="params.total"
              :page-size.sync="params.rows"
              :current-page.sync="params.page"
              @current-change="handlePage"
              @size-change="handleSizeChange"
            />
          </el-footer>
        </el-main>
      </el-container>
    </el-container>
    <add-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
    <add-details
      v-if="dialogdes.visible"
      :dialog.sync="dialogdes"
      :selection-item="selectionItem"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'UpdateRecord',
  components: {
    AddForm: () => import('./add.vue'),
    AddDetails: () => import('./addDetails1.vue')
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
  private dialogdes: any = {
    title: '',
    visible: false
  }
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
      // console.log(val)
      this.initTableData()
    }
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: '/pmi/sysDeployLog/findDeployLogByPage',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        // console.log(res)
        this.listLoading = false
        this.params.total = res.total
        this.tableData = res.rows
      })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleDbclick(row: any): void {
    this.dialogdes.title = '详情'
    this.dialogdes.visible = true
    this.selectionItem = row
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.selectionItem = {
      deployTime: '',
      version: '',
      remark: '',
      itemList: []
    }
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.selectionItem = this.selections[0]
        this.dialog.title = '修改'
        this.dialog.visible = true
        this.dialog.isAdd = false
      })
      .catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: `/pmi/sysDeployLog/delete/${ids}`,
            method: 'DELETE',
            data: {}
          })
          .then((res: any) => {
            if (res.code === 200) {
              this.initTableData()
            }
            this.$base.win.msgJson(res)
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
    this.initTableData()
  }
}
</script>

<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.page,
.el-container {
  height: 100%;
}
.el-footer {
  height: auto !important;
}
.ke-body {
  display: flex;
  flex-flow: column;
}
</style>
