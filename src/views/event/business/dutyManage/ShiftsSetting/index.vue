<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
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
            <el-button @click="handleRefresh">
              <svg-icon name="reset" />刷新
            </el-button>
            <!-- <el-button @click="handleCollect">
              <svg-icon name="reset" />收藏
            </el-button>
            <el-button @click="handleSeeCollect">
              <svg-icon name="reset" />查看收藏
            </el-button> -->
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
          style="width: 100%"
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
            prop="cname"
            label="班次名称"
            align="center"
          />
          <el-table-column
            prop="beginTime"
            label="上班时间"
            align="center"
          />
          <el-table-column
            prop="endTime"
            label="下班时间"
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
          layout="prev, pager, next,total,jumper,sizes"
          :page-sizes="[10,20,30,50,100]"
          :total="total"
          :current-page.sync="params.page"
          :page-size.sync="params.rows"
          @current-change="handlePage"
          @size-change="initTableData(1)"
        />
      </el-footer>
    </el-container>
    <add-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
      @emitTableData="initTableData"
    />
    <collect
      v-if="collectDialog.visible"
      :dialog.sync="collectDialog"
      :selection-item="selectionItem"
    />
    <see-collection
      :dialog.sync="seeCollectDialog"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'ShiftsSetting',
  components: {
    AddForm: () => import('./add.vue'),
    Collect: () => import('./../../components/collect.vue'),
    SeeCollection: () => import('./../../components/seeCollection.vue')
  }
})
export default class extends Vue {
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private tableData: Array<any> = []
  // 弹窗新增或者删除
  private type: string = ''
  // 选中要修改的数据
  private selectionItem: any = {}
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private collectDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private seeCollectDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private total: number = 0
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    total: 0
  }
  private isUpload: boolean = false
  created() {
    this.initTableData()
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
  private initTableData(page?:any): void {
    if (page){
      this.params.page = 1
      this.params.total = 0
    }
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.grid.resizePage({
      len: this.tableData.length,
      search: this.params
    })
    this.$http
      .request({
        url: '/evt/opWorkNo/findOpWorkNoPage',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.total = res.total
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
        this.id = row.id
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
            url: '/evt/opWorkNo/deleteOpWorkNo',
            method: 'post',
            data: {
              ids: ids
            }
          })
          .then((res: any) => {
            this.$base.win.msg('成功', 'success')
            this.initTableData()
          })
      })
      .catch(() => {})
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleRefresh() {
    this.$base.common.reload(this)
  }
  private handleSearch(){
    this.initTableData(1)
  }
  private handleReset(): void {
    this.params = {page: 1,rows: this.$base.grid.page,total: 0}
  }
  private handleCollect(): void {
    if (this.selections.length) {
      this.collectDialog.visible = true
      this.collectDialog.title = '收藏'
      this.selectionItem = this.selections
    } else {
      this.$base.win.msg('请选择需要收藏的案件！','error')
    }
  }
  private handleSeeCollect(): void {
    this.seeCollectDialog.visible = true
    this.seeCollectDialog.title = '查看收藏'
  }
}
</script>

<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.name-inp {
  width: 150px;
}
</style>
