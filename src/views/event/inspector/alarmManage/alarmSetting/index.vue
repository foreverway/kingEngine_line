<template>
  <div class="page">
    <el-main class="ke-body">
      <el-row class="search-container">
        <el-col :span="24">
          <el-button
            v-power
            code="edit"
            @click="handleEdit"
          >
            <svg-icon name="edit" />修改
          </el-button>
          <el-button
            v-power
            type="warning"
            code="refresh"
            @click="handleReload"
          >
            <svg-icon name="reset" />刷新
          </el-button>
        </el-col>
      </el-row>
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
          prop="alarmId"
          label="报警类型"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.alarmType | alarmFilter(alarmList) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="note"
          label="报警描述"
          align="center"
        />
      </el-table>
      <el-footer>
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
    </el-main>
    <edit-form
      v-if="dialog.visible"
      :dialog.sync="dialog"
      @handleInit="initTableData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App',
  components: {
    editForm: () => import('./edit.vue')
  },
  filters: {
    alarmFilter: function(value,list:Array<any>){
      for (let i of list){
        if (i.id === value){
          return i.alarmName
        }
      }
      return ''
    }
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private alarmList: Array<any> = []
  private selections: Array<any> = []
  private row: any = {}
  private dialog: any = {
    visible: false
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page
  }
  created(){
    this.handleGetTypeList()
    this.initTableData()
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/alarm/findObserverAlarmByPage',
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
  private handleGetTypeList(){
    this.$http({
      url: '/obs/alarm/findObsAlarmList',
      method: 'post'
    }).then((res) => {
      this.alarmList = res.data
    })
  }
  private handleReload(): void {
    this.$base.common.reload(this)
  }
  private handleEdit(){
    if (this.selections.length < 1){
      this.$base.win.msg('请选择一条数据进行操作！')
      return
    } else if (this.selections.length > 1){
      this.$base.win.msg('当前操作仅能勾选一条数据！')
      return
    }
    this.dialog = {
      visible: true,
      item: this.selections[0]
    }
  }
  private handlePage(val): void {
    this.params.page = val
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
.tips-container {
  margin-bottom: 15px;
}
.page {
  height: 100%;
  padding: 15px;
  .table-container {
    flex: 1;
    overflow: auto;
  }
  .el-footer {
    height: auto !important;
  }
  .ke-body {
    margin: 0;
    height: 100%;
    flex-direction: column;
    display: flex;
  }
  .search-container {
    display: flex;
    flex-flow: row;
    align-items: center;
    margin-bottom: 15px;
    label {
      text-align: right;
      width: 85px;
    }
    .grow {
      flex-grow: 1;
    }
    .form-item {
      display: flex;
      flex-flow: row;
      align-items: center;
      margin-right: 10px;

      label {
        flex-shrink: 0;
        padding: 0 12px 0 0;
      }
    }
  }
}
</style>
