<template>
  <div class="page">
    <el-main class="ke-body">
      <div>
        <div class="ke-buttons ke-float-left">
          <el-button 
            v-power  
            code="edit"
            @click="handleEdit"
          >
            <svg-icon name="edit" />修改
          </el-button>
          <el-button 
            v-power  
            code="refresh"
            @click="handleReload"
          >
            <svg-icon name="reset" />刷新
          </el-button>
          <el-button 
            v-power  
            code="exportExcel"
            @click="handleExport"
          >
            <svg-icon name="export" />导出
          </el-button>
        </div>
        <div class="ke-float-right ke-search-right">
          <label>工作网格名称</label>
          <el-input
            v-model="params.name"
            placeholder="请输入工作网格名称"
            clearable
          />
          <label style="width: 90px;display: inline-block;text-align: right;">所属区域</label>
          <el-cascader
            ref="dIdCascader"
            v-model="params.areaId"
            placeholder="请选择所属区域"
            :options="departTree"
            :props="defaultProps"
            :show-all-levels="false"
            clearable
          />

          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >
            查询
          </el-button>
          <el-button
            v-power  
            code="reset"
            type="warning"
            @click="handleReset"
          >
            <svg-icon name="reset" />重置
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
          prop="gridName"
          label="工作网格名称"
          align="center"
        />
        <el-table-column
          prop="gridCode"
          label="网格编码"
          align="center"
        />
        <el-table-column
          prop="areaage"
          label="网格面积(平方米)"
          align="center"
        />
        <el-table-column
          prop="areaName"
          label="所属区域"
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
    </el-main>
    <add-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
    <event-details
      v-if="dialogDes.visible"
      :selection-item="selectionItem"
      :dialog.sync="dialogDes"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'GridManage',
  components: {
    AddForm: () => import('./add.vue'),
    EventDetails: () => import('./details.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue')
  }
})
export default class extends Vue {
  private departTree: Array<any> = []
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private ids: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private tableData: Array<any> = []
  // 详情
  private dialogDes: any = {
    title: '',
    visible: false
  }
  // 选中要修改的数据
  private selectionItem: any = {}
  private baseURL: any = sessionStorage.getItem('baseURL')
  private defaultProps: any= {
    children: 'children',
    label: 'areaName',
    value: 'id',
    checkStrictly: true,
    emitPath: false
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
    name: '',
    areaId: 0
  }
  private isUpload: boolean = false
  created() {
    this.initTableData()
    this.initDepartTree()
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
        url: '/obs/workGrid/findWorkGridByPage',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.listLoading = false
        this.params.total = res.total
        this.tableData = res.rows
      })
  }
  private initDepartTree(): void {
    this.$http.request({
      url: '/sys/area/tree',
      method: 'get',
      params: {}
    }).then((res: any) => {
      this.departTree = res.data
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
    this.dialogDes.title = '详情'
    this.dialogDes.visible = true
    this.selectionItem = row
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
  private handleReload(): void {
    this.handleReset()
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
    this.params.areaId = 0
    this.params.page = 1
  }
  private handleExport(): void {
    // 导出
    let str = ''
    debugger
    if (this.selections.length) {
      let ids: Array<any> = []
      this.selections.forEach((el) => {
        ids.push(el.id)
      })
      str = ids.join(',')
      let url = this.baseURL + `obs/workGrid/exportWorkGrid?ids=${str}`
      window.open(url, '_blank')
      this.$base.win.msg('导出成功', 'success')
    } else {
      console.log(this.params)
      let url =
        this.baseURL +
        `obs/workGrid/exportWorkGrid?areaId=${this.params.areaId}&name=${this.params.name}`
      window.open(url, '_blank')
      this.$base.win.msg('导出成功', 'success')
    }
  }
}
</script>

<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.el-upload {
  margin-right: 10px;
}
.el-footer {
  height: auto !important;
}
.ke-body {
  height: 100%;
  margin: 0 !important;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
}
.page {
  height: 100%;
  padding: 10px;
}
.page > .el-container {
  height: 100%;
}
</style>
