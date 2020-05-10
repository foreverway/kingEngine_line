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
              class="form-item"
            >
              <el-form-item label="所属区域">
                <ke-tree
                  v-model="params.areaId"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="9"
              class="form-item"
            >
              <date-range-selector
                start-label="统计时间"
                end-label="至"
                :start-value.sync="params.startDate"
                format="yyyy-MM-dd"
                type="date"
                :end-value.sync="params.endDate"
                label-width="auto"
              />
            </el-col>
            <el-col
              :span="5"
              class="form-item"
            >
              <el-form-item label="登录状态">
                <el-select
                  v-model="params.isOnline"
                  placeholder="请选择登录状态"
                >
                  <el-option
                    v-for="item in onlineOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              class="form-item"
            >
              <el-form-item
                label="监督员"
                label-width="70px"
              >
                <obsTree
                  :value.sync="params.obsId"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="align-middle">
            <el-col
              :span="8"
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
                code="exportExcel"
                @click="handleExport"
              >
                <svg-icon name="export" />导出
              </el-button>
            </el-col>
            <p class="tips">
              {{ handleGetSum() }}
            </p>
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
        >
          <el-table-column
            align="center"
            :label="'数字化城市管理系统人员任务统计表'+(params.startDate&&params.endDate?'（'+params.startDate+' 至 '+params.endDate+'）':'')"
          >
            <el-table-column
              type="index"
              align="center"
              fixed
            />
            <el-table-column
              prop="observerName"
              label="监督员"
              align="center"
              fixed
            />
            <el-table-column
              prop="areaName"
              label="所属区域"
              align="center"
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
    obsTree: () => import('@/views/event/inspector/components/obsTree.vue'),
    DateRangeSelector: () => import('@/components/dateRangeSelector.vue')
  },
  filters: {
    titleFilter: function(params){
      if (params.startDate && params.endDate){
        return `数字化城市管理系统当班任务统计表（${params.startDate} - ${params.endDate}）`
      }
      return '数字化城市管理系统当班任务统计表'
    },
    percentFilter: function(scope){
      if (scope.row.reportNum === 0){
        return '-'
      }
      let result = scope.row.validCollectionNum / scope.row.reportNum
      return Number(result.toFixed(2)) * 100 + '%'
    }
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private params: any = {
    areaId: '',
    startDate: '',
    endDate: '',
    isOnline: '',
    obsId: '',
    rows: this.$base.grid.page
  }
  private onlineOptions: any = [
    {
      label: '离线',
      value: 2
    },
    {
      label: '在线',
      value: 1
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
    // TODO: 搜索表单待完善
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
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
  private handleReset(): void {
    this.$base.common.reset(this)
  }
  private handleExport(){
    exportXls('obs/onduty/exportObserverStatistics',this)
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/onduty/getObserverStatisticsByPage',
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
}
</script>
<style scoped>

</style>
<style lang="scss" scoped>
.align-middle{
  display: flex;
  flex-flow: row;
  align-items: center;
}
.tips{
  text-align: center;
  color: #606266;
}
</style>
