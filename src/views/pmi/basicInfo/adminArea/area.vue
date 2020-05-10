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
          :url="'area/importArea'"
          :is-upload.sync="isUpload"
        />
        <el-button @click="handleExport">
          <svg-icon name="export" />导出
        </el-button>
      </div>
      <div class="ke-float-right ke-search-right">
        <label v-if="treeSelection.level === 1">区域名称：</label>
        <label v-if="treeSelection.level === 2">街道名称：</label>
        <label v-if="treeSelection.level === 3">社区名称：</label>
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
      :current-page.sync="params.page"
      @current-change="handlePage"
    />
    <add-one
      v-if="dialog.visible && dialog.level === 1"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
    <add-two
      v-if="dialog.visible && dialog.level === 2"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
    <add-three
      v-if="dialog.visible && dialog.level === 3"
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
      AddOne: () => import('./addOne.vue'),
      AddTwo: () => import('./addTwo.vue'),
      AddThree: () => import('./addThree.vue'),
      ImportFile: () => import('@/components/ImportFile/index.vue')
    }
  })
export default class extends Vue {
    @Prop({ type: Object, default: {} }) areaSelection !: any
    @Prop({ type: Number, default: 0 }) firstId !: number
    // 表格数据是否正在加载
    private listLoading: boolean = true
    // 点击行数据
    private row: any = {}
    private selections: Array<any> = []
    // 获取选择项数据id(修改时用)
    private id: number = 0
    // 导出选中的ids
    private ids: Array<any> = []
    private treeSelection: any = this.$base.common.extend(this.areaSelection)
    private baseURL: any = sessionStorage.getItem('baseURL')
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
      parentId: this.firstId,
      name: ''
    }
    private isUpload: boolean = false
    created() {
      this.initTableData()
    }
    @Watch('areaSelection', { immediate: true, deep: true })
    private handleSelectChanged(val: any, oldVal: any): void {
      if (val.id) {
        this.treeSelection = val
        this.params.parentId = val.id
        this.params.name = ''
        this.initTableData()
      }
    }
    @Watch('isUpload')
    private handleUploadChanged(val: boolean, oldVal: boolean): void {
      if (val === true) {
        this.initTableData()
        this.$emit('initTreeData')
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
      // console.log(this.params)
      this.$http.request({
        url: '/area/findAreaByPage',
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
      if (!this.treeSelection.id) {
        this.$base.win.msg('请选择新增区域', 'error')
      } else {
        this.dialog.title = '新增'
        this.dialog.visible = true
        this.dialog.level = this.treeSelection.level
        this.dialog.isAdd = false
        this.selectionItem = {
          areaName: '',
          areaCode: '',
          parentId: this.treeSelection.id,
          parentName: this.treeSelection.text,
          dbStatus: 1,
          orderNo: 0,
          note: '',
          totalArea: '',
          id: 0,
          level: ''
        }
      }
    }
    private handleEdit(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        if (this.treeSelection.level) {
          this.selectionItem = this.selections[0]
          this.dialog.level = this.treeSelection.level
          // this.dialog.level = this.selectionItem.areaLevel + 1
          this.dialog.title = '修改'
          this.dialog.visible = true
          this.dialog.isAdd = false
        } else {
          this.$base.win.msg('当前选择的数据不允许修改', 'error')
        }
      }).catch(() => { })
    }
    private handleDelete(): void {
      this.$base.grid.remove(this.selections)
        .then((ids: string) => {
        // console.log(this.selections)
        // 当前选择的数据有下级数据，不能直接删除
          this.$http.request({
            url: '/area/deleteArea',
            method: 'post',
            data: { ids: ids }
          }).then((res: any) => {
            this.$base.win.msg('成功')
            this.initTableData()
            this.$emit('initTreeData')
          })
        }).catch(() => { })
    }
    private handleReload(): void {
      this.params.name = ''
      this.params.parentId = this.firstId
      this.params.page = 1
      this.initTableData()
      this.treeSelection = this.$base.common.extend(this.areaSelection)
      this.$emit('resetKey')
    }
    private handlePage(currentPage: number): void {
      // this.params.name = ''
      this.params.page = currentPage
      this.initTableData()
    }
    private handleSearch(): void {
      // this.params.parentId = 0
      this.params.page = 1
      this.initTableData()
    }
    private handlReset(): void {
      this.params.name = ''
      this.params.parentId = 0
      this.params.page = 1
    }
    private handleExport(): void { // 导出
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
        this.treeSelection.level ? level = this.treeSelection.level : level = 0
        let url = this.baseURL + `area/exportArea?level=${level}&areaName=${this.params.name}&parentId=${this.params.parentId}`
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
  .area{
    height: 100%;
    .el-container{
      height: 100%;
    }
  }

</style>
