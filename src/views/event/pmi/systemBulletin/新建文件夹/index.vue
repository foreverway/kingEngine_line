<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <div class="ke-buttons">
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
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          style="width: 100%"
          height="100%"
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
            prop="name"
            label="工作组名称"
            align="center"
            width="120"
          />
          <el-table-column
            prop="leader"
            label="队长"
            align="center"
          />
          <el-table-column
            prop="webCount"
            label="网格数"
            align="center"
          />
          <el-table-column
            prop="area"
            label="所属区域"
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
          layout="prev, pager, next,total,jumper"
          :total="search.total"
          :current-page.sync="search.page"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
    <add-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
      :son-id="sonId"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    AddForm: () => import('./add.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  private listLoading: boolean = false
  private tableData: Array<any> = [{
    name: '组1',
    leader: '队长队长',
    webCount: 4,
    area: '广东',
    note: 'test'
  }]
  private selections: Array<any> = []
  private id: number = 0
  private row: any = {}
  private params: any = {
    page: 1,
    rows: this.$base.grid.page
  }
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private search = {
    page: 1,
    rows: this.$base.grid.page,
    total: 0
  }
  private sonId: number = 0
  private selectionItem: any = {}
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.sonId = 0
  }
  private handleEdit() {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.sonId = this.selections[0].id
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
            url: '/user/deleteUser',
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
  private initTableData(): void {}
  private handleReload(): void {
    this.params.type = ''
    this.params.id = ''
    this.params.code = ''
    this.params.name = ''
    this.params.address = ''
    this.params.page = 1
    this.initTableData()
  }
  private handlePage(): void {}
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
}
</script>
<style lang="scss" scoped>

</style>
