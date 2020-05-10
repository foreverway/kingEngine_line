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
            <el-col :span="6">
              <el-form-item
                label="至"
                class="item-center"
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
              :span="5"
              class="align-left"
            >
              <el-button
                v-power
                type="primary"
                code="search"
                icon="el-icon-search"
                @click="handleSearch"
              >
                查询
              </el-button>
              <el-button
                v-power
                type="warning"
                code="reset"
                @click="handleReset"
              >
                <svg-icon name="reset" />重置
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="8"
              class="buttons"
              style="width:40.66667%;"
            >
              <el-button
                v-power
                code="save"
                @click="handleSave"
              >
                <svg-icon name="save" />保存
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
            align="center"
            label="数字化城市管理系统考勤情况表（2019-02-27 至 2019-02-27）"
          >
            <el-table-column
              prop="workGroupName"
              label="组别"
              align="center"
              width="120"
            />
            <el-table-column
              type="index"
              align="center"
            />
            <el-table-column
              prop="userName"
              label="姓名"
              align="center"
            />
            <el-table-column
              prop="gridName"
              label="工作网格"
              align="center"
            />
            <el-table-column
              label="上午考勤"
              align="center"
            >
              <el-table-column
                label="上班打卡"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.signs[0].signDate }}
                </template>
              </el-table-column>
              <el-table-column
                label="下班打卡"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.signs[1].signDate }}
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              prop="userName"
              label="下午考勤"
              align="center"
            >
              <el-table-column
                label="上班打卡"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.signs[0].signDate }}
                </template>
              </el-table-column>
              <el-table-column
                label="下班打卡"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.signs[1].signDate }}
                </template>
              </el-table-column>
            </el-table-column>
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
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private row: any = {}
  private params: any = {
    obsId: '',
    endTime: '',
    startTime: '',
    page: 1,
    rows: this.$base.grid.page
  }
  private addressOptions: any = [
    {
      label: '南山区',
      value: '南山区'
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
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/statistic/findObsSignLonInfo',
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
  private handleOrderSpan(obj){
    if (this.tableData.length > 1){
      // 前两列
      if (obj.columnIndex < 1){
        if (obj.rowIndex !== 0){
          if (this.tableData[obj.rowIndex].gridName === this.tableData[obj.rowIndex - 1].gridName){
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
        if (obj.rowIndex !== this.tableData.length - 1){
          if (this.tableData[obj.rowIndex].gridName === this.tableData[obj.rowIndex + 1].gridName){
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
    if (this.tableData[currentRow].gridName === this.tableData[currentRow + 1].gridName){
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
  private handleSave():void{

  }
  private handleExport(): void {
    exportXls('obs/statistic/exportWorkGridStatistics',this)
  }
}
</script>
<style scoped>
.align-left{
  text-align: left;
  padding-left: 10px;
}
.ke-layout >>> .el-radio{
  margin-right: 10px;
}
.ke-layout >>> .el-radio__label{
  padding-left: 5px;
}
.item-center >>> .el-form-item__label{
  text-align: center;
  padding-right: 0 !important;
}
</style>
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
