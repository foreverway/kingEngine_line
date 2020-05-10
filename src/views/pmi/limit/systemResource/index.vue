<template>
  <div 
    :class="classObj" 
    class="department-wrapper ka-departent" 
  >
    <el-container>
      <ke-aside
        class="ke-body"
        width="229px"
        title="导航"
      >
        <template>
          <el-scrollbar class="tree-container">
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              :default-expanded-keys="expandedKeys"
              highlight-current
              node-key="id"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </template>
      </ke-aside>
      <el-main class="ke-body">
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
              :url="'privilege/importPrivilege'"
              :data="files"
              :is-upload.sync="isUpload"
            />
          </div>
          <div class="ke-float-right ke-search-right">
            <label>资源名称</label>
            <el-input
              v-model="params.menuName"
              placeholder="请输入资源名称"
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
        <el-table
          ref="eltableCurrentRow"
          v-loading="loading"
          :data="tabaleList"
          stripe
          style="width: 100%;"
          height="100%"
          highlight-current-row
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
          @row-dblclick="handleDbclick"
        >
          <el-table-column type="index" />
          <!-- <el-table-column type="selection" /> -->
          <el-table-column
            prop="menuName"
            label="资源名称"
            align="center"
          />
          <el-table-column
            prop="menuPath"
            label="资源地址"
            align="center"
          />
          <el-table-column
            label="打开类型"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.openType === 1">路由打开</span>
              <span v-if="scope.row.openType === 2">iframe打开</span>
            </template>
          </el-table-column>
        </el-table>
        <el-footer>
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev, pager, next,total,jumper, sizes"
            :page-size.sync="params.rows"
            :total="params.total"
            @current-change="handlePage"
            @size-change="handleSizeChange"
          />
        </el-footer>
      </el-main>
    </el-container>
    <add-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
    <add-details
      v-if="dialogdes.visible"
      :id="id"
      :dialog.sync="dialogdes"
      :selection-item="selectionItem"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { Object } from 'ol'
@Component({
  name: 'systemResource',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    AddForm: () => import('./add.vue'),
    AddDetails: () => import('./addDetails1.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue')
  }
})
export default class extends Vue {
  get classObj() {
    return {
      double: AppModule.double
    }
  }
  private pageName: string = '部门管理'
  public $refs: any = { quickEntry: HTMLFormElement }
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private input: string = ''
  private currentPage3: number = 5
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private files: object = {}
  private expandedKeys: Array<any> = []
  // 选中要修改的数据
  private selectionItem: any = {}
  // 列表数据
  private tabaleList: Array<any> = []
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'menuName'
  }
  private loading: boolean = false
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    parentId: 0,
    menuName: ''
    // menuCode: ''
  }
  private dialog: any = {
    title: '',
    visible: false,
    type: 0, // 0:新增 修改， 1：详情
    isAdd: false,
    parentId: 0 
  }
  private dialogdes: any = {
    title: '',
    visible: false
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
        url: '/pmi/menu/tree',
        method: 'get'
      })
      .then((res: any) => {
        this.treeData = res.data
      })
  }
  private initTableData(): void {
    // 判断当前页删除后无记录就跳到上一页
    this.$base.grid.resizePage({len: this.tabaleList.length,search: this.params})
    this.loading = true
    this.$http
      .request({
        url: '/pmi/menu/page',
        method: 'get',
        params: this.params
      })
      .then((res: any) => {
        this.loading = false
        this.tabaleList = res.rows
        this.params.total = res.total
      })
  }
  private handleNodeClick(data: any): void {
    this.params.parentId = Number(data.id)
    this.dialog.parentId = Number(data.id)
    this.params.menuName = null
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    // 分页
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
    this.initTableData()
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
  private handleClickRow(row: any) {
    this.row = row
    this.selections = []
    this.selections.push(row)
    console.log(this.selections)
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tabaleList, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
    if (val.length > 1) {
      this.$refs.eltableCurrentRow.clearSelection()
      this.$refs.eltableCurrentRow.toggleRowSelection(val.pop())
    }
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: `/pmi/menu/${ids}`,
            method: 'DELETE'
          })
          .then((res: any) => {
            if (res.code === 200) {
              this.initTableData()
              this.initTreeData()
              console.log(res,'1')
            }
            this.$base.win.msgJson(res)
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.params.parentId = 0
    this.params.menuName = ''
    this.params.page = 1
    this.handleReset()
    this.initTableData()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(null)
    })
  }
  private handleSearch(): void {
    // 搜索
    this.params.parentId = null
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    // 重置
    this.params.name = ''
    this.params.page = 1
    this.params.parentId = 0
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
.department-wrapper {
  &.double{
    width:50%;
  }
  height: 100%;
  flex: 1;
  .tc {
    text-align: center;
  }
  .el-main {
    .nav-bar {
      margin-bottom: 10px;
      span {
        color: #4a5460;
        font-size: 14px;
      }
      .el-input {
        width: 140px;
        margin-right: 10px;
      }
    }
    .operate-buttons {
      display: flex;
      flex-wrap: wrap;
      button {
        margin-bottom: 10px;
      }
    }
    .preview {
      color: #ff4949;
      cursor: pointer;
      margin-right: 2px;
    }
    .download {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
.name-inp {
  width: 150px;
}
.ke-body {
  padding: 15px !important;
  flex-direction: column;
  display: flex;
  width:calc(100% - 299px)
}
.department-wrapper > .el-container {
  height: 100%;
}
.el-footer {
  height: auto !important;
}
.tree-container {
  height: calc(100% - 22px);
}
</style>
