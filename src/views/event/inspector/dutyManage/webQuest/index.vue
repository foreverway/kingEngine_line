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
            <el-col :span="12">
              <date-range-selector
                start-label="统计时间"
                end-label="至"
                :start-value.sync="params.startDate"
                format="yyyy-MM-dd"
                type="date"
                :end-value.sync="params.endDate"
                label-width="auto"
              />
              <!-- <el-form-item label="统计时间">
                <el-date-picker
                  v-model="params.startDate"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  type="date"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              class="align-center"
            >
              <el-form-item
                label="至"
                label-width="40px"
              >
                <el-date-picker
                  v-model="params.endDate"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  type="date"
                />
              </el-form-item> -->
            </el-col>
            <el-col
              :span="14"
              class="buttons"
              style="width:40.66667%;"
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
                code="exportExcel"
                @click="handleExport"
              >
                <svg-icon name="export" />导出
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <p class="tips">
          {{ handleGetSum() }}
        </p>
      </el-header>
      <el-main>
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            align="center"
            :label="handleGetTitle"
          >
            <el-table-column
              type="index"
              align="center"
              fixed
            />
            <el-table-column
              prop="workGridCode"
              label="工作网格"
              align="center"
              fixed
            />
            <el-table-column
              prop="workGridName"
              label="网格名称"
              align="center"
              fixed
            />
            <el-table-column
              prop="reportNum"
              label="上报数"
              align="center"
            />
            <el-table-column
              prop="validCollectionNum"
              label="有效上报数"
              align="center"
            />
            <el-table-column
              prop="percent"
              label="有效上报率"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope | percentFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="verify"
              label="已核实数"
              align="center"
            />
            <el-table-column
              prop="overTimeVerified"
              label="超时核实数"
              align="center"
            />
            <el-table-column
              prop="verifyOnTime"
              label="按时核实数"
              align="center"
            />
            <el-table-column
              prop="unverifyNum"
              label="待核实数"
              align="center"
            />
            <el-table-column
              prop="overTimeUnverified"
              label="未核实数"
              align="center"
            />
            <el-table-column
              prop="checked"
              label="已核查数"
              align="center"
            />
            <el-table-column
              prop="overTimeChecked"
              label="超时核查数"
              align="center"
            />
            <el-table-column
              prop="checkOnTime"
              label="按时核查数"
              align="center"
            />
            <el-table-column
              prop="uncheckNum"
              label="待核查数"
              align="center"
            />
            <el-table-column
              prop="overTimeUncheck"
              label="未核查数"
              align="center"
            />
          </el-table-column>
        </el-table>
      </el-main>
      <!-- <el-footer height="auto">
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
      </el-footer> -->
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exportXls from '@/utils/export'
@Component({
  name: 'App',
  components: {
    DateRangeSelector: () => import('@/components/dateRangeSelector.vue')
  },
  filters: {
    percentFilter: function(scope){
      if (scope.row.reportNum === 0){
        return '-'
      }
      let result = scope.row.validCollectionNum / scope.row.reportNum
      return Number(result.toFixed(2)) * 100 + '%'
    },
    sumFilter: function(key,list:Array<any>){
      let sum = 0
      list.forEach((item) => {
        sum += item[key]
      })
    }
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private params: any = {
    startDate: '',
    endDate: ''
  }
  private sum: any = {
    reportNum: 0,
    validCollectionNum: 0,
    checked: 0,
    overTimeChecked: 0,
    uncheckNum: 0,
    overTimeUncheck: 0,
    verify: 0,
    overTimeVerified: 0,
    unverifyNum: 0,
    overTimeUnverified: 0
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
  created(){
    this.initTableData()
  }
  get handleGetTitle(){
    if (this.params.startDate !== '' && this.params.endDate !== ''){
      return `数字化城市管理系统网格任务统计表（${this.params.startDate} 至 ${this.params.endDate}）`
    }
    return '数字化城市管理系统网格任务统计表'

  }
  private handleGetSum(){
    // 合计：上报总数：0 总有效上报数：0 总有效上报率：0% 已核查数：0 超时核查数：0 待核查数：0 未核查数：0 已核实数：0 超时核实数：0 待核实数：0 未核实数：0
    let reportNum = this.getSumByKey('reportNum')
    let validCollectionNum = this.getSumByKey('validCollectionNum')
    let str = '合计：上报总数：' + reportNum +
    ' 总有效上报数：' + validCollectionNum +
    ' 总有效上报率：' + (validCollectionNum === 0 ? '0' : (Number((reportNum / validCollectionNum).toFixed(2)) * 100 + '%') ) +
    ' 已核查数：' + this.getSumByKey('checked') +
    ' 超时核查数：' + this.getSumByKey('overTimeChecked') +
    ' 待核查数：' + this.getSumByKey('uncheckNum') +
    ' 未核查数：' + this.getSumByKey('overTimeUncheck') +
    ' 已核实数：' + this.getSumByKey('verify') +
    ' 超时核实数：' + this.getSumByKey('overTimeVerified') +
    ' 待核实数：' + this.getSumByKey('unverifyNum') +
    ' 未核实数：' + this.getSumByKey('overTimeUnverified')
    return str
  }
  private getSumByKey(key){
    let sum = 0
    this.tableData.forEach((item) => {
      if (item[key]){
        sum += Number(item[key])
      } else {
        sum += 0
      }
    })
    return sum
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
      url: '/obs/onduty/getWorkGridStatisticsByPage',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.tableData = res.data
      this.total = res.total
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }
  private handleReload(): void {
    this.$base.common.reload(this)
  }
  private handlePage(val): void {
    this.params.page = val
    this.initTableData()
  }
  private handleExport(){
    exportXls('/obs/onduty/exportWorkGridStatistics',this)
  }
}
</script>
<style scoped>
.align-center >>> .el-form-item__label{
  text-align: center;
  padding: 0 6px 0 6px;
}
</style>
<style lang="scss" scoped>
.tips {
  margin-bottom: 15px;
  color: #606266;
}
</style>
