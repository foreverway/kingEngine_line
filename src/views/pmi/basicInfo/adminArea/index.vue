<template>
  <div class="admin-area ka-departent">
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
              node-key="id"
              :default-expanded-keys="expandedKeys"
              highlight-current
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </template>
      </ke-aside>
      <el-main
        class="ke-body main-body"
      >
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
              :url="'area/importArea'"
              :data="files"
              :is-upload.sync="isUpload"
            />
            <el-button 
              v-power  
              code="refresh"
              @click="exportExcel"
            >
              <svg-icon name="export" />导出
            </el-button>
          </div>
          <div class="ke-float-right ke-search-right">
            <!-- <label v-if="treeSelection.level === 1">区域名称：</label>
            <label v-if="treeSelection.level === 2">街道名称：</label>
            <label v-if="treeSelection.level === 3">社区名称：</label> -->
            <label>名称</label>
            <el-input
              v-model="params.areaName"
              placeholder="请输入名称"
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
          style="width: 100%;"
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
            prop="areaName"
            label="区域名称"
            align="center"
          />
          <el-table-column
            prop="areaCode"
            label="区域编码"
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
            :page-size.sync="params.rows"
            :total="params.total"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="handleSizeChange"
          />
        </el-footer>
        <add-one
          v-if="dialog.visible"
          :id="id"
          :dialog.sync="dialog"
          :selection-item="selectionItem"
        />
        <event-details
          v-if="dialogDes.visible"
          :id="id"
          :dialog.sync="dialogDes"
          :selection-item="selectionItem"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'adminArea',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    AddOne: () => import('./addOne.vue'),
    EventDetails: () => import('./details.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  private show: boolean = false
  private files: object = {}
  // 详情
  private dialogDes: any = {
    title: '',
    visible: false
  }
  // 列表数据
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'areaName'
  }
  private parentParams: any = {
    parentId: 0,
    parentCode: '',
    areaLevel: 0
  }
  // 第一级id
  private firstId: number = 0
  private expandedKeys: Array<any> = []
  private areaSelection: object = {}
  private baseURL: any = sessionStorage.getItem('baseURL')
  // area 数据 开始
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  // 导出选中的ids
  private ids: Array<any> = []
  private treeSelection: any = {} // 省1 市2 区3 街道4 社区5  网格6
  private tableData: Array<any> = []
  // 选中要修改的数据
  private selectionItem: any = {}
  private dialog: any = {
    title: '',
    visible: false,
    // level: 1,
    isAdd: false
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    parentId: 0,
    areaName: '',
    total: 0
  }
  private isUpload: boolean = false
  // area数据结束
  created() {
    this.initTreeData()
    this.initTableData()
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
        url: 'sys/area/tree',
        method: 'get',
        data: {}
      })
      .then((res: any) => {
        // console.log(res)
        this.treeData = res.data
        this.listLoading = false
        if (this.treeData){
          this.firstId = res.data[0].id
          this.expandedKeys.push(res.data[0].id)
          this.areaSelection = res.data[0]
          this.treeSelection = res.data[0]
          this.params.parentId = res.data[0].id
          this.initTableData()
          // setTimeout(() => {
          //   this.$refs.tree.setCurrentKey(res.data[0].id)
          // }, 100)
        }
      })
  }
  private resetKey(): void {
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(this.treeData[0].id)
      this.setparentParams(this.treeData[0])
    })
  }
  private setparentParams(data: any): void {
    this.parentParams = {
      parentId: Number(data.id),
      parentCode: data.areaCode,
      areaLevel: data.areaLevel + 1
    }
  }
  // area方法开始
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: 'sys/area/list',
        method: 'get',
        params: this.params
      })
      .then((res: any) => {
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
    if (val.length > 1) {
      this.$refs.eltableCurrentRow.clearSelection()
      this.$refs.eltableCurrentRow.toggleRowSelection(val.pop())
    } 
  }
  private handleDbclick(row: any): void {
    this.dialogDes.title = '详情'
    this.dialogDes.visible = true
    this.id = row.id
    this.selectionItem = row
  }
  private handleAdd(): void {
    if (this.parentParams.areaLevel > 5) {
      this.$base.win.msg('暂不支持社区级别以下的数据新增', 'error')
      return
    }
    if (!this.parentParams.parentId) {
      this.$base.win.msg('请选择新增区域', 'error')
    } else {
      this.dialog.title = '新增'
      this.dialog.visible = true
      this.dialog.isAdd = false
      this.selectionItem = {
        areaCode: '',
        areaLevel: this.parentParams.areaLevel,
        areaName: '',
        areaPeople: 0,
        areaPlace: '',
        note: '',
        orderNo: 0,
        parentCode: this.parentParams.parentCode,
        parentId: this.parentParams.parentId,
        totalArea: 0
      }
    }
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.selectionItem = this.selections[0]
        // this.selectionItem.areaCode = this.selectionItem.areaCode.replace(this.selectionItem.parentCode,'')
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
            url: `/sys/area/delete/${ids}`,
            method: 'DELETE',
            data: { ids: ids }
          })
          .then((res: any) => {
            if (res.code === 200){
              this.initTableData()
              this.initTreeData()
            }
            this.$base.win.msgJson(res)
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.handlReset()
    this.initTableData()
    this.treeSelection = this.treeData[0]
    this.resetKey()
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
    this.params.parentId = 0
    this.params.page = 1
    this.initTableData()
  }
  private handlReset(): void {
    this.params.areaName = ''
    this.params.parentId = 0
    this.params.page = 1
  }
  private exportExcel(): void {
    // 导出
    let str = ''
    if (this.selections.length) {
      let ids: Array<any> = []
      this.selections.forEach((el) => {
        ids.push(el.id)
      })
      str = ids.join(',')
      let url = this.baseURL + `area/exportArea?ids=${str}`
      window.open(url, '_blank')
      this.$base.win.msg('导出成功', 'success')
    } else {
      let level = 0
      this.treeSelection.level ?
        (level = this.treeSelection.level) :
        (level = 0)
      let url =
        this.baseURL +
        `area/exportArea?level=${level}&areaName=${this.params.name}&parentId=${this.params.parentId}`
      window.open(url, '_blank')
      this.$base.win.msg('导出成功', 'success')
    }
  }
  // area 方法结束
  private handleNodeClick(data: any): void {
    this.params.parentId = Number(data.id)
    this.setparentParams(data)
    this.params.areaName = ''
    this.initTableData()
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
.admin-area {
  height: 100%;
}
.admin-area > .el-container {
  height: 100%;
}
.main-body {
  display: flex;
  flex-flow: column;
}
.el-footer {
  height: auto !important;
}
.tree-container {
  height: calc(100% - 22px);
}
</style>
