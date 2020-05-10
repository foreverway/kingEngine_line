<template>
  <el-main class="ke-body">
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
        <import-file
          :url="'cellGrid/importCellGrid'"
          :is-upload.sync="isUpload"
        />
        <el-button @click="handleExport">
          <svg-icon name="export" />导出
        </el-button>
      </div>
      <div class="ke-float-right ke-search-right">
        <label>单元网格名称：</label>
        <el-input
          v-model="params.name"
          clearable
        />
        <el-button
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
      style="width: 99%;"
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
        prop="gridName"
        label="网格名称"
        align="center"
      />
      <el-table-column
        prop="gridCode"
        label="网格编码"
        align="center"
      />
      <el-table-column
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.dbStatus === 0">删除</span>
          <span v-if="scope.row.dbStatus === 1">正常</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注"
        align="center"
      />
    </el-table>
    <el-pagination
      background
      class="ke-page"
      layout="prev, pager, next,total,jumper"
      :total="total"
      @current-change="handlePage"
    />
    <add-four
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
  </el-main>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import IDict from '@/interface/dict'
  @Component({
    components: {
      AddFour: () => import('./addFour.vue'),
      ImportFile: () => import('@/components/ImportFile/index.vue')
    }
  })
export default class extends Vue {
    @Prop({ type: Object, default: {} }) areaSelection !: any
    // 表格数据是否正在加载
    private listLoading: boolean = true
    private baseURL: any = sessionStorage.getItem('baseURL')
    // 点击行数据
    private row: any = {}
    private selections: Array<any> = []
    // 获取选择项数据id(修改时用)
    private id: number = 0
    private treeSelection: any = this.$base.common.extend(this.areaSelection)
    private tableData: Array<any> = []
    // 选中要修改的数据
    private selectionItem: any = {}
    private total: number = 0
    private dialog: any = {
      title: '',
      visible: false,
      level: 1,
      isAdd: false
    }
    private params: any= {
      page: 1,
      rows: this.$base.grid.page,
      id: 0,
      name: ''
    }
    private isUpload: boolean = false
    created() {
      this.initTableData()
    }
    @Watch('isUpload')
    private handleUploadChanged(val: boolean, oldVal: boolean): void {
      if (val === true) {
        this.initTableData()
        this.$emit('initTreeData')
      }
    }
    @Watch('areaSelection', { immediate: true, deep: true })
    private handleSelectChanged(val: any, oldVal: any): void {
      if (val !== oldVal && val.id) {
        this.treeSelection = val
        this.params.id = val.id
        this.initTableData()
      }
    }
    @Watch('dialog.isAdd')
    private handleAddChanged(val: boolean, oldVal: boolean): void {
      if (val === true) {
        this.initTableData()
        this.$emit('initTreeData')
      }
    }
    private initTableData(): void {
      this.$http.request({
        url: '/cellGrid/findCellgridByPage',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        this.listLoading = false
        this.total = res.total
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
    private handleAdd(): void {
      debugger
      this.dialog.title = '新增'
      this.dialog.visible = true
      this.dialog.isAdd = false
      this.selectionItem = {
        areaage: 0,
        dbStatus: 1,
        gridCode: '',
        gridName: '',
        parentId: this.treeSelection.id,
        parentName: this.treeSelection.text,
        note: '',
        orderNo: 0,
        workGridId: 0,
        areaId: '',
        createTime: '',
        createUserId: 0
      }
    }
    private handleEdit(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.selectionItem = this.selections[0]
        this.selectionItem.parentId = this.treeSelection.id
        this.selectionItem.parentName = this.treeSelection.text
        this.dialog.isAdd = false
        this.dialog.title = '修改'
        this.dialog.visible = true
      }).catch(() => { })
    }
    private handleDelete(): void {
      this.$base.grid.remove(this.selections)
        .then((ids: string) => {
          this.$http.request({
            url: '/cellGrid/deleteCellGrid',
            method: 'post',
            data: { ids: ids }
          }).then((res: any) => {
            this.$base.win.msg('成功', 'success')
            this.initTableData()
            this.$emit('initTreeData')
          })
        }).catch(() => { })
    }
    private handleReload(): void {
      // this.$emit('update:showArea', true)
      // this.params.name = ''
      // this.params.id = 0
      // this.params.page = 1
      // this.$emit('resetKey')
      this.initTableData()
    }
    private handlePage(currentPage: number): void {
      // this.params.name = ''
      this.params.page = currentPage
      this.initTableData()
    }
    private handleSearch(): void {
      // this.params.id = 0
      this.params.page = 1
      this.initTableData()
    }
    private handlReset(): void {
      this.params.name = ''
      this.params.id = 0
      this.params.page = 1
      this.initTableData()
    }
    private handleExport(): void { // 导出
      let str = ''
      if (this.selections.length) {
        let ids: Array<any> = []
        this.selections.forEach((el) => {
          ids.push(el.id)
        })
        str = ids.join(',')
        let url = this.baseURL + `cellGrid/exportCellGrid?ids=${str}`
        window.open(url, '_blank')
        this.$base.win.msg('导出成功', 'success')
      } else {
        // console.log(this.params)
        let url = this.baseURL + `cellGrid/exportCellGrid?areaId=${this.params.id}&gridName=${this.params.name}`
        window.open(url, '_blank')
        this.$base.win.msg('导出成功', 'success')
      }
    }
}
</script>

<style lang="scss" scoped>
  .left-border {
    margin-left: 0
  }
  .cell{
    width: 100%;
    height: 100%;
    .el-container{
      height: 100%;
    }
  }

</style>
