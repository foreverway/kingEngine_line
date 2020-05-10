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
            >
              <el-form-item label="姓名">
                <el-input
                  v-model="params.observerName"
                  placeholder="请输入姓名"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
            >
              <el-form-item label="审批结果">
                <el-select
                  v-model="params.auditStatus"
                  placeholder="请选择审批结果"
                >
                  <el-option
                    v-for="item in auditOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="11"
            >
              <date-range-selector
                start-label="申请时间"
                end-label="至"
                :start-value.sync="params.startDate"
                :end-value.sync="params.endDate"
                label-width="auto"
              />
              <!-- <el-form-item label="申请时间">
                <el-date-picker
                  v-model="params.startDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  align="right"
                  type="datetime"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              class="item-center"
            >
              <el-form-item
                label="至"
              >
                <el-date-picker
                  v-model="params.endDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  align="right"
                  type="datetime"
                />
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="10"
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
              <el-button
                v-power
                code="approve"
                @click="handleCheck"
              >
                审批
              </el-button>
              <el-button
                v-power
                code="refresh"
                @click="handleReload"
              >
                <svg-icon name="reset" />刷新
              </el-button>
            </el-col>
          </el-row>
        </el-form>
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
            prop="observerName"
            label="姓名"
            align="center"
          />
          <el-table-column
            prop="createTime"
            label="申请时间"
            align="center"
          />
          <el-table-column
            prop="reason"
            label="请假原因"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="auditDate"
            label="审批时间"
            align="center"
          />
          <el-table-column
            prop="auditDesc"
            label="审批意见"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="auditName"
            label="审批人"
            align="center"
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
    <check-dialog
      v-if="dialog.visible"
      :dialog.sync="dialog"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App',
  components: {
    CheckDialog: () => import('./check.vue'),
    DateRangeSelector: () => import('@/components/dateRangeSelector.vue')
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private row: any = {}
  private dialog: any = {
    visible: false
  }
  private params: any = {
    observerName: '',
    auditStatus: '',
    startDate: '',
    endDate: '',
    page: 1,
    rows: this.$base.grid.page
  }
  private pickerOptions= {
    // disabledDate(time) {
    //   return time.getTime() > Date.now()
    // },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date())
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }]
  }
  private auditOptions: any = [
    {
      label: '待审批',
      value: 1
    },
    {
      label: '通过',
      value: 2
    },
    {
      label: '不通过',
      value: 3
    }
  ]
  created(){
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.$base.common.reset(this)
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/leave/findObserverLeaveByPage',
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
  private handleCheck() : void{
    if (this.selections.length > 1){
      this.$base.win.msg('当前操作只支持选择一条数据！','error')
      return
    } else if (this.selections.length < 1){
      this.$base.win.msg('请先选择一条数据！','error')
      return
    }
    this.dialog.item = this.selections[0]
    this.dialog.visible = true
  }
  private handleReload(): void {
    this.$base.common.reload(this)
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
<style scoped>
.item-center >>> .el-form-item__label{
  text-align: center;
  padding-right: 0 !important;
}
</style>
<style lang="scss" scoped>
.button-container {
  margin-bottom: 15px;
}
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
      text-align: center;
      width: 80px;
      color: #606266
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
