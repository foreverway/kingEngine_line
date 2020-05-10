<template>
  <el-main class="ke-body">
    <div>
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
          :url="'eventClass/importSmallClass'"
          :is-upload.sync="isUpload"
        />
      </div>
      <div class="ke-float-right ke-search-right">
        <label>事部件名称：</label>
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
        prop="className"
        label="事部件名称"
        align="center"
      />
      <el-table-column
        prop="classCode"
        label="事部件编码"
        align="center"
      />
      <el-table-column
        prop="orderNo"
        label="排序编码"
        align="center"
      />
      <el-table-column
        prop="disposeTimeA"
        label="一般性处置时限"
        align="center"
      />
      <el-table-column
        prop="disposeTimeB"
        label="工程性处置时限"
        align="center"
      />
      <el-table-column
        prop="disposeTimeC"
        label="特殊性处置时限"
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
    <big-add
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
      BigAdd: () => import('./bigAdd.vue'),
      ImportFile: () => import('@/components/ImportFile/index.vue')
    }
  })
export default class extends Vue {
    @Prop({ type: Object, default: {} }) selectionPart !: any
    // 表格数据是否正在加载
    private listLoading: boolean = true
    // 点击行数据
    private row: any = {}
    private selections: Array<any> = []
    // 获取选择项数据id(修改时用)
    private id: number = 0
    private treeSelection: any = this.$base.common.extend(this.selectionPart)
    private tableData: Array<any> = []
    // 选中要修改的数据
    private selectionItem: any = {}
    private total: number = 0
    private dialog: any = {
      title: '',
      visible: false,
      isAdd: false
    }
    private params: any= {
      page: 1,
      rows: this.$base.grid.page,
      parentId: 1,
      name: ''
    }
    private isUpload: boolean = false
    created() {
      this.initTableData()
    }
    @Watch('selectionPart', { immediate: true, deep: true })
    private handleSelectChanged(val: any, oldVal: any): void {
      if (val !== oldVal && val.id) {
        this.treeSelection = val
        this.params.parentId = val.id
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
      this.$http.request({
        url: '/eventClass/findEventClassSettingByPage',
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
      this.dialog.title = '新增'
      this.dialog.visible = true
      this.dialog.level = this.treeSelection.level
      this.dialog.isAdd = false
      this.selectionItem = {
        eventClassId: this.treeSelection.id,
        createUserId: 0,
        className: '',
        classCode: '',
        deptName: '',
        directorDeptId: '',
        directorPerson: '',
        worktimeEnd: '',
        worktimeStart: '',
        orderNo: 0,
        is_saturdaywork: false,
        is_sundaywork: false,
        ischeck: false,
        isverify: false,
        disposeTimeA: 0,
        use_disposeTimeA: false,
        use_disposeTimeB: false,
        use_disposeTimeC: false,
        is_usetime: false,
        isreckon: false,
        closedstd: '',
        legalstd: '',
        note: '',
        disposalUnits: []
      }
    }
    private handleEdit(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.selectionItem = this.selections[0]
        this.dialog.level = this.selectionItem.areaLevel
        this.dialog.title = '修改'
        this.dialog.visible = true
        this.dialog.isAdd = false
      }).catch(() => { })
    }
    private handleDelete(): void {
      this.$base.grid.remove(this.selections)
        .then((ids: string) => {
          this.$http.request({
            url: '/eventClass/delEventClassSettingByIds',
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
      // this.params.name = ''
      // this.params.parentId = 0
      // this.params.page = 1
      this.initTableData()
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
      this.initTableData()
    }
}
</script>

<style lang="scss" scoped>
  .left-border {
    margin-left: 0
  }

</style>
