<template>
  <div class="page ka-departent">
    <el-container>
      <el-container>
        <ke-aside
          class="ke-body ke-scroll"
          width="229px"
          title="导航"
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
        <el-main class="ke-body">
          <div>
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
            </div>
            <div class="ke-float-right ke-search-right">
              <label>字典名称</label>
              <el-input
                v-model="params.dictName"
                placeholder="请输入字典名称"
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
              prop="dictName"
              label="字典名称"
              align="center"
              width="120"
            />
            <el-table-column
              prop="dictCode"
              label="字典编码"
              align="center"
            />
            <el-table-column
              prop="dictValue"
              label="指定值"
              align="center"
            />
            <el-table-column
              prop="parentName"
              label="上级字典"
              align="center"
            />
            <el-table-column
              prop="note"
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
      v-if="parentDialog.visible"
      :id="id"
      :parent-dialog.sync="parentDialog"
      :selection-item="selectionItem"
    />
    <event-details
      v-if="dialogDes.visible"
      :selection-item="selectionItem"
      :parent-dialog.sync="dialogDes"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'ddic',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    AddForm: () => import('./add.vue'),
    EventDetails: () => import('./details.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 详情
  private dialogDes: any = {
    title: '',
    visible: false
  }
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private parentId: number = 0
  private tableData: Array<any> = []
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'dictName'
  }
  // 选中要修改的数据
  private selectionItem: any = {}
  private parentDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    parentId: null,
    dictName: ''
  }
  created() {
    this.initTableData()
    this.initTreeData()
  }
  @Watch('parentDialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      // console.log(val)
      this.initTableData()
      this.initTreeData()
    }
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/sys/dict/tree',
        method: 'get',
        params: {}
      })
      .then((res: any) => {
        // console.log(res)
        this.treeData = res.data
        // this.parentId = Number(res.data[0].id)
      })
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: '/sys/dict/list',
        method: 'get',
        params: this.params
      })
      .then((res: any) => {
        // console.log(res)
        this.listLoading = false
        this.params.total = res.total
        this.tableData = res.rows
      })
  }
  private handleNodeClick(data: any): void {
    this.params.parentId = Number(data.id)
    this.params.dictName = ''
    this.parentId = Number(data.id)
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
    this.selectionItem = row
  }
  private handleAdd(): void {
    this.parentDialog.title = '新增'
    this.parentDialog.visible = true
    this.parentDialog.isAdd = false
    this.selectionItem = {
      dictName: '',
      dictCode: '',
      orderNo: 0,
      dictValue: 0,
      parentId: this.parentId,
      dictIcon: '', // 'assets/dataDictionary/suishoupai.png',
      note: ''
    }
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.selectionItem = this.selections[0]
        this.parentDialog.title = '修改'
        this.parentDialog.visible = true
        this.parentDialog.isAdd = false
      })
      .catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: `sys/dict/delete/${ids}`,
            method: 'DELETE',
            data: { ids: ids }
          })
          .then((res: any) => {
            if (res.code === 200) {
              this.$base.win.msg('成功')
              this.initTableData()
              this.initTreeData()
            } else {
              this.$base.win.msg(res.msg)
            }
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.params.dictName = ''
    this.params.parentId = null
    this.params.page = 1
    this.initTableData()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(null)
    })
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
    this.params.parentId = null
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.name = ''
    this.params.parentId = 1
    this.params.page = 1
    // this.initTableData()
  }
}
</script>
<style scoped>
.tree-container >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}
.ka-departent >>> thead .el-table-column--selection .cell{
    display: none!important;
  }
</style>
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
.ke-scroll {
  overflow: auto;
}
.ke-body {
  flex-direction: column;
  display: flex;
}
.tree-container {
  height: calc(100% - 22px);
}
</style>
