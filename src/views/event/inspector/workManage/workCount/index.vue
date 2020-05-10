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
              class="form-item"
              :span="6"
            >
              <el-form-item label="监督员">
                <obs-tree v-model="params.obsId" />
              </el-form-item>
            </el-col>
            <el-col
              class="form-item"
              :span="11"
            >
              <date-range-selector
                start-label="统计时间"
                end-label="至"
                :start-value.sync="params.startTime"
                :end-value.sync="params.endTime"
                label-width="auto"
              />
              <!-- <el-form-item label="统计时间">
                <el-date-picker
                  v-model="params.startTime"
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
                  v-model="params.endTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  align="right"
                  type="datetime"
                />
              </el-form-item> -->
            </el-col>
            <el-col
              :span="6"
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
          :span-method="handleOrderSpan"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            label="数字化城市管理系统工作情况汇总表（2019-02-27 至 2019-02-27）"
            align="center"
          >
            <el-table-column
              prop="workGroupName"
              label="组别"
              align="center"
              fixed
            />
            <el-table-column
              type="index"
              align="center"
              fixed
            />
            <el-table-column
              prop="observerName"
              label="姓名"
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
              prop="km"
              label="有效上报率"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope | percentFilter }}
              </template>
            </el-table-column>
            <el-table-column
              prop="verified"
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
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exportXls from '@/utils/export'
@Component({
  name: 'App',
  components: {
    obsTree: () => import('../../components/obsTree.vue'),
    DateRangeSelector: () => import('@/components/dateRangeSelector.vue')
  },
  filters: {
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
  private selections: Array<any> = []
  private row: any = {}
  private params: any = {
    endTime: '',
    obsId: '',
    page: 1,
    startTime: '',
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
      url: '/obs/statistic/queryObsWorkStatisticsInfo',
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
  private handleOrderSpan(obj){
    if (this.tableData.length > 1){
      // 前两列
      if (obj.columnIndex < 1){
        // console.log('obj.rowIndex',obj.rowIndex)
        if (obj.rowIndex !== 0){
          if (this.tableData[obj.rowIndex].workGroupName === this.tableData[obj.rowIndex - 1].workGroupName){
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
        if (obj.rowIndex !== this.tableData.length - 1){
          if (this.tableData[obj.rowIndex].workGroupName === this.tableData[obj.rowIndex + 1].workGroupName){
            return {
              rowspan: this.countSameColumn(obj.rowIndex,1),
              colspan: 1
            }
          }
        }
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    }
  }
  private countSameColumn(currentRow,sum):Number{
    if (!sum){
      sum = 1
    }
    if (currentRow === (this.tableData.length - 1)){
      return sum
    }
    if (this.tableData[currentRow].workGroupName === this.tableData[currentRow + 1].workGroupName){
      return this.countSameColumn(++currentRow,++sum)
    }
    return sum

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
    exportXls('obs/statistic/exportObsWorkStaInfo',this)
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

</style>
