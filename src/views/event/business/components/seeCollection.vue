<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="820px"
  >
    <el-header height="auto">
      <div class="ke-clear">
        <div class="ke-buttons ke-float-left">
          <el-button @click="handleEdit">
            <svg-icon name="edit" />编辑
          </el-button>
          <el-button @click="handleDelete">
            <svg-icon name="remove" />删除
          </el-button>
          <el-button @click="handleReload">
            <svg-icon name="reset" />刷新
          </el-button>
        </div>
        <div class="ke-float-right ke-search-right">
          <label>收藏类别</label>
          <ke-dict code="cccc" />
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >
            查询
          </el-button>
        </div>
      </div>
    </el-header>
    <el-table
      ref="eltableCurrentRow"
      v-loading="listLoading"
      :data="tableData"
      stripe
      height="360px"
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
        prop="roleName"
        label="来源"
        align="center"
      />
      <el-table-column
        prop="roleCode"
        label="案件号"
        align="center"
      />
      <el-table-column
        prop="roleCode"
        label="来件时间"
        align="center"
      />
      <el-table-column
        prop="roleCode"
        label="问题描述"
        align="center"
      />
      <el-table-column
        prop="roleCode"
        label="收藏类别"
        align="center"
      />
      <el-table-column
        prop="note"
        label="点评"
        align="center"
      />
    </el-table>
    <el-footer>
      <el-pagination
        background
        class="ke-page"
        layout="prev, pager, next,total,jumper"
        :total="params.total"
        :current-page.sync="params.page"
        :page-size.sync="params.rows"
        @current-change="handlePage"
      />
    </el-footer>
    <comment
      v-if="editDialog.visible"
      :dialog.sync="editDialog"
      :selection-item="selectionItemComment"
    />
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'seeCollection',
  components: {
    Comment: () => import('./comment.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = []
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 修改传值
  private selectionItemComment: Object = {}
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    name: ''
  }
  private editDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  created() {
    this.initTableData()
  }
  @Watch('editDialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/role/findRolesByPage',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.params.total = res.total
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
  private cancel(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.name = ''
    this.params.page = 1
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.selectionItemComment = this.selections[0]
        this.editDialog.title = '修改'
        this.editDialog.visible = true
        this.editDialog.isAdd = false
      })
      .catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        // to do
        // this.$http.request({
        //   url: '/role/deleteRole',
        //   method: 'post',
        //   data: {
        //     ids: ids
        //   }
        // }).then((res: any) => {
        //   this.$base.win.msg('成功', 'success')
        //   this.initTableData()
        // })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
  }
}
</script>

<style lang="scss" scoped>
.el-header{
  padding: 0;
  margin-top: 10px;
}
</style>
