<template>
  <el-container class="ke-layout ka-departent"> 
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <ke-aside
          width="229px"
          title="导航"
          class="ke-body"
        >
          <template>
            <el-scrollbar class="tree-container">
              <el-tree
                ref="tree"
                node-key="id"
                :data="treeData"
                :props="defaultProps"
                highlight-current
                @node-click="handleNodeClick"
              />
            </el-scrollbar>
          </template>
        </ke-aside>
        <el-container class="ke-layout-body">
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
                  :url="'dept/importDept'"
                  :data="file"
                  :is-upload.sync="isUpload"
                />
                <el-button 
                  v-power  
                  code="exportExcel"
                  @click="handleExport"
                >
                  <svg-icon name="export" />导出
                </el-button>
              </div>
              <div class="ke-float-right ke-search-right">
                <label>部门名称</label>
                <el-input
                  v-model="params.deptName"
                  placeholder=""
                  class="dep-inp"
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
              height="100%"
              style="width:100%;"
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
                prop="deptName"
                label="部门名称"
                align="center"
                width="250"
              />
              <el-table-column
                prop="parentName"
                label="上级部门"
                align="center"
              />
              <el-table-column
                align="center"
                label="类型"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.deptType === 1">市级</span>
                  <span v-if="scope.row.deptType === 2">局级</span>
                  <span v-if="scope.row.deptType === 3">区级</span>
                </template>
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
              @size-change="handleSizeChange"
            />
          </el-footer>
        </el-container>
      </el-container>
      <add-form
        v-if="dialog.visible"
        :id="id"
        :dialog.sync="dialog"
        :selection-item="selectionItem"
      />
      <event-details
        v-if="dialogDes.visible"
        :id="id"
        :dialog.sync="dialogDes"
      />
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
import { UserModule } from '@/store/modules/user'
@Component({
  name: 'Department',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    AddForm: () => import('./add.vue'),
    EventDetails: () => import('./details.vue'),
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
  private ids: Array<any> = []
  private baseURL: any = sessionStorage.getItem('baseURL')
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private tableData: Array<any> = []
  private file: any = {}
  // 详情
  private dialogDes: any = {
    title: '',
    visible: false
  }
  // 选中要修改的数据
  private selectionItem: any = {}
  private parentParams: any = {
    parentId: 0,
    parentCode: ''
  }
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'name'
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
    deptName: ''
  }
  private isUpload: boolean = false
  created() {
    this.initTableData()
    this.initTreeData()
  }
  @Watch('isUpload')
  private handleUploadChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
      this.initTreeData()
    }
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
      this.initTreeData()
    }
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/pmi/department/tree',
        method: 'get',
        params: {}
      })
      .then((res: any) => {
        this.treeData = res.data
        // this.setparentParams(res.data[0])
      })
  }
  private setparentParams(data: any): void {
    this.parentParams = {
      parentId: Number(data.id),
      parentCode: data.code
    }
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: '/pmi/department/list',
        method: 'get',
        params: this.params
      })
      .then((res: any) => {
        this.listLoading = false
        this.params.total = res.total
        this.tableData = res.rows
      })
  }
  private handleNodeClick(data: any): void {
    this.params.parentId = Number(data.id)
    this.setparentParams(data)
    this.initTableData()
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
    this.dialogDes.title = '详情'
    this.dialogDes.visible = true
    this.id = row.id
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.selectionItem = {
      areaId: 0,
      deptCode: '',
      deptIcon: '',
      deptName: '',
      deptType: 1,
      logoId: [0],
      note: '',
      orderNo: 0, 
      parentCode: this.parentParams.parentCode,
      parentId: this.parentParams.parentId,
      img: []
    }
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        let id = this.selections[0].id
        this.$http
          .request({
            url: `pmi/department/${id}`,
            method: 'get',
            params: {id: id}
          })
          .then((res: any) => {
            if (res.code === 200){
              this.selectionItem = res.data
              this.selectionItem.deptCode = this.selectionItem.deptCode.replace(this.selectionItem.parentCode,'')
              this.selectionItem.img = []
              if (this.selectionItem.logoUrl) {
                this.selectionItem.img = [{name: 'xx.png',id: this.selectionItem.logoId,url: this.selectionItem.logoUrl}]
                // 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
              }
              this.dialog.title = '修改'
              this.dialog.isAdd = false
              this.dialog.visible = true
            } 
          })
      })
      .catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: `/pmi/department/${ids}`,
            method: 'delete'
          })
          .then((res: any) => {
            if (res.code === 200) {
              this.$base.win.msg('成功', 'success')
              this.initTableData()
              this.initTreeData()
            } else {
              this.$base.win.msg(res.msg, 'success')
            }
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.handleReset()
    this.initTableData()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(null)
    })
  }
  private handlePage(currentPage: number): void {
    // this.params.deptName = ''
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
    this.params.parentId = 0
    this.initTableData()
  }
  private handleReset(): void {
    this.params.deptName = ''
    this.params.parentId = 0
    this.params.page = 1
  }
  private handleExport(): any {
    // 导出
    let str = ''
    if (this.selections.length) {
      let ids: Array<any> = []
      this.selections.forEach((el) => {
        ids.push(el.id)
      })
      str = ids.join(',')
      let url = this.baseURL + `dept/exportDept?ids=${str}`
      window.open(url, '_blank')
      this.$base.win.msg('导出成功', 'success')
    } else {
      let url =
        this.baseURL +
        `dept/exportDept?parentId=${this.params.parentId}&deptName=${this.params.deptName}`
      window.open(url, '_blank')
      this.$base.win.msg('导出成功', 'success')
    }
  }
}
</script>

<style scoped>
  .tree-container >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .ka-departent >>> thead .el-table-column--selection .cell{
    display: none!important;
  }
</style>
<style lang="scss" scoped>
.ke-layout-body {
  width:calc(100% - 229px)
}
.left-border {
  margin-left: 0;
}
.el-upload {
  margin-right: 10px;
}
.dep-inp {
  width: 150px;
}
.tree-container {
  height: calc(100% - 22px);
}
</style>
