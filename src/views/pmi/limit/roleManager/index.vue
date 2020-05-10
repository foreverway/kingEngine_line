<template>
  <el-container class="ke-layout ka-departent">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <div class="ke-clear">
            <div class="ke-buttons ke-float-left">
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
              <import-file
                :url="'role/importRole'"
                :data="files"
                :is-upload.sync="isUpload"
              />
            </div>
            <div class="ke-float-right ke-search-right">
              <label>角色名称</label>
              <el-input
                v-model="params.roleName"
                placeholder="请输入角色名称"
                class="name-inp"
                clearable
              />
              <el-button
                v-power  
                code="search"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
              >
                查询
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
            style="width: 100%"
            height="100%"
            highlight-current-row
            @row-click="handleClickRow"
            @selection-change="handleSelectionChange"
            @row-dblclick="handleDbclick"
          >
            <el-table-column
              type="index"
              align="center"
            />
            <!-- <el-table-column
              type="selection"
              align="center"
            /> -->
            <el-table-column
              prop="roleName"
              label="角色名称"
              align="center"
            />
            <el-table-column
              prop="roleCode"
              label="角色编码"
              align="center"
            />
            <el-table-column
              prop="note"
              label="备注"
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
            @size-change="handleSizeChange"
          />
        </el-footer>
      </el-container>
    </el-main>
    <add-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
    />
    <add-details
      v-if="dialogdes.visible"
      :id="id"
      :dialog.sync="dialogdes"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'RoleManager',
  components: {
    AddForm: () => import('./add.vue'),
    AddDetails: () => import('./addDetails.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private files: object = {}
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private tableData: Array<any> = []
  // 弹窗新增或者删除
  private type: string = ''
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
    rows: this.$base.grid.page,
    roleName: ''
  }
  private isUpload: boolean = false
  created() {
    this.initTableData()
    let reg = /^[0-9a-zA-Z]+$/
    let str = 'hhhhh556缉私局6'
    console.log(reg.test(str))
  }
  @Watch('isUpload')
  private handleUploadChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: '/pmi/role/page',
        method: 'get',
        params: this.params
      })
      .then((res: any) => {
        this.params.total = res.total
        this.tableData = res.rows
      })
      .finally(() => {
        this.listLoading = false
      })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
    if (val.length > 1) {
      this.$refs.eltableCurrentRow.clearSelection()
      this.$refs.eltableCurrentRow.toggleRowSelection(val.pop())
    } 
  }
  private handleDbclick(row: any): void {
    this.dialogdes.title = '详情'
    this.dialogdes.visible = true
    this.id = row.id
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.id = 0
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.id = this.selections[0].id
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
            url: `/pmi/role/${ids}`, 
            method: 'DELETE'
          })
          .then((res: any) => {
            this.$base.win.msg('成功', 'success')
            this.initTableData()
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.params.roleName = ''
    this.params.page = 1
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
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
<style scoped>
  .ka-departent >>> thead .el-table-column--selection .cell{
    display: none!important;
  }
</style>
<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.name-inp {
  width: 150px;
}
</style>
