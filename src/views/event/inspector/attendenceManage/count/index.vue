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
              :span="5"
            >
              <el-form-item label="姓名">
                <el-input
                  v-model="params.userName"
                  placeholder="请输入姓名"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
            >
              <el-form-item label="所属区域">
                <ke-tree
                  v-model="params.areaId"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              class="row-item"
            >
              <date-range-selector
                start-label="统计时间"
                end-label="至"
                :start-value.sync="params.startDate"
                :end-value.sync="params.endDate"
                label-width="auto"
              />
              <!-- <span class="label">
                统计时间
              </span>

              <el-date-picker
                v-model="params.startDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                align="right"
                type="datetime"
              />
              <span class="label">
                至
              </span>
              <el-date-picker
                v-model="params.endDate"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                align="right"
                type="datetime"
              /> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="buttons"
              :span="7"
            >
              <el-button
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
                code="exportExcel"
                class="margin-right"
                @click="handleExport"
              >
                <svg-icon name="export" />导出
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
            align="center"
            :label="'数字化城市管理系统考勤统计表'+(params.startDate&&params.endDate?'（'+params.startDate+' 至 '+params.endDate+'）':'')"
          >
            <el-table-column
              prop="observerName"
              label="姓名"
              align="center"
              width="120"
            />
            <el-table-column
              prop="areaName"
              label="所属区域"
              align="center"
            />
            <el-table-column
              prop="lateCount"
              label="迟到次数"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleShowDetail(scope)"
                >
                  {{ scope.row.lateCount }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="earlyCount"
              label="早退次数"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleShowDetail(scope)"
                >
                  {{ scope.row.earlyCount }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="uncheckCount"
              label="未打卡次数"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleShowDetail(scope)"
                >
                  {{ scope.row.uncheckCount }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="leaveCount"
              label="请假次数"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleShowDetail(scope)"
                >
                  {{ scope.row.leaveCount }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="mileage"
              label="巡查里程（km）"
              align="center"
            />
          </el-table-column>
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
    <detail
      v-if="dialog.visible"
      :dialog.sync="dialog"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exportXls from '@/utils/export'
@Component({
  name: 'App',
  components: {
    detail: () => import('./detail.vue'),
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
    title: '',
    visible: false
  }
  private params: any = {
    userName: '',
    areaId: '',
    startDate: '',
    endDate: '',
    page: 1,
    rows: this.$base.grid.page
  }
  private addressOptions: any = [
    {
      label: '南山区',
      value: '南山区'
    }
  ]
  private typeOptions: any = [
    {
      label: '一级',
      value: '一级'
    }
  ]
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
  private handleShowDetail(scope): void {
    this.dialog.title = '详情'
    this.dialog.visible = true
    this.dialog.item = scope.row
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/signlog/getObserverSignLogStatisticsByPage',
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
  private handleExport(): void {
    exportXls('obs/signlog/exportObsSignLogStatistics',this)
  }
}
</script>
<style scoped>
.align-center >>> .el-form-item__label{
  text-align: center;
  padding-right: 0!important;
}
</style>
<style lang="scss" scoped>
.row-item{
  display: flex;
  flex-flow: row;
  align-items: center;
  .label{
    flex-shrink: 0;
    padding: 0 10px;
    color: #606266;
  }
}
.margin-right {
  margin-right: 10px;
}
.tips-container {
  display: flex;
  flex-flow: row;
  align-items: center;
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
      color: #606266;
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
