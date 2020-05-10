<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="params"
          class="ke-search"
          label-width="85px"
        >
          <el-row>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item
                label="工作网名称"
                label-width="90px"
              >
                <el-input
                  ref="params"
                  v-model="params.workGroupName"
                  placeholder="请输入工作网名称"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              class="form-item"
              :span="6"
            >
              <el-form-item label="所属区域">
                <ke-tree
                  v-model="params.areaId"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              class="buttons"
            >
              <el-button
                v-power
                code="search"
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
            </el-col>
          </el-row>
        </el-form>
        <div class="ke-buttons">
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
            prop="workGroupName"
            label="工作组名称"
            align="center"
            width="120"
          />
          <el-table-column
            prop="captainName"
            label="队长"
            align="center"
          />
          <el-table-column
            prop="cellNumber"
            label="工作网格数"
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
            show-overflow-tooltip
          />
        </el-table>
      </el-main>
      <el-footer height="auto">
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper,sizes"
          :total="total"
          :page-sizes="[10,20,30,50,100]"
          :page-size.sync="params.rows"
          :current-page.sync="params.page"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
    <add-form
      v-if="dialog.visible"
      :dialog.sync="dialog"
      @handleInit="initTableData()"
      @handleReload="handleReload()"
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
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private id: number = 0
  private row: any = {}
  private params: any = {
    page: 1,
    workGroupName: '',
    areaId: '',
    rows: this.$base.grid.page
  }
  private dialog: any = {
    title: '',
    visible: false,
    item: []
  }
  private selectionItem: any = {}
  created(){
    this.initTableData()
  }
  private handleAdd(): void {
    this.dialog = {
      title: '新增',
      visible: true,
      item: null
    }
  }
  private handleEdit() {
    if (this.selections.length > 1 || this.selections.length === 0){
      this.$base.win.msg('请选择一个工作组')
      return
    }
    this.dialog = {
      title: '修改',
      visible: true,
      item: this.selections[0]
    }
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: '/obs/workGroup/deleteWorkGroup',
            method: 'post',
            data: {
              ids: ids
            }
          })
          .then((res: any) => {
            this.$base.win.msg('操作成功', 'success')
            this.initTableData()
          })
      })
      .catch(() => {})
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/workGroup/findWorkGroupByPage',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.tableData = res.rows
      this.total = res.total
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }
  private handleSearch(): void{
    this.params.page = 1
    this.initTableData()
  }
  private handleReload(): void {
    this.$base.common.reload(this)
  }
  private handleReset():void{
    this.$base.common.reset(this)
  }
  private handlePage(val): void {
    this.params.page = val
    this.initTableData()
  }
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
  .buttons{
    text-align: left;
  }
</style>
