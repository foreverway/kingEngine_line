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
          :url="'eventClass/importEventClass'"
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
      style="width: 99%"
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
        prop="classCode"
        label="编码"
        align="center"
      />
      <el-table-column
        prop="className"
        label="名称"
        align="center"
      />
      <el-table-column
        prop="areaCode"
        label="排序号"
        align="orderNo"
      />
    </el-table>
    <el-pagination
      background
      class="ke-page"
      layout="prev, pager, next,total,jumper"
      :total="total"
      @current-change="handlePage"
    />
    <small-add
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
      SmallAdd: () => import('./smallAdd.vue'),
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
      parentId: 0,
      name: ''
    }
    private isUpload: boolean = false
    created() {
      this.initTableData()
    }
    @Watch('selectionPart', { immediate: true, deep: true })
    private handleSelectChanged(val: any, oldVal: any): void {
      // console.log(val)
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
        url: '/eventClass/findEventClassByPage',
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
      this.dialog.isAdd = false
      this.selectionItem = {
        className: '',
        classCode: '',
        orderNo: '',
        parentId: '',
        createUserId: 0
      }
    }
    private handleEdit(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.selectionItem = this.selections[0]
        this.dialog.title = '修改'
        this.dialog.visible = true
        this.dialog.isAdd = false
      }).catch(() => { })
    }
    private handleDelete(): void {
      this.$base.grid.remove(this.selections)
        .then((ids: string) => {
          this.$http.request({
            url: '/eventClass/delEventClass',
            method: 'post',
            data: { ids: ids }
          }).then((res: any) => {
          // console.log(res)
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
