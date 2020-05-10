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
              <el-form-item label="报警类型">
                <el-select
                  v-model="params.alarmId"
                  placeholder="请选择报警类型"
                >
                  <el-option
                    v-for="item in alarmList"
                    :key="item.id"
                    :label="item.alarmName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              class="form-item"
              :span="11"
            >
              <date-range-selector
                start-label="统计时间"
                end-label="至"
                :start-value.sync="params.startDate"
                :end-value.sync="params.endDate"
                label-width="auto"
              />
              <!-- <el-form-item label="统计时间">
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
            <el-col
              :span="4"
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
            prop="alarmName"
            label="报警类型"
            align="center"
          />
          <el-table-column
            prop="alarmId"
            label="报警编号"
            align="center"
          />
          <el-table-column
            prop="alarmType"
            label="报警代码"
            align="center"
          />
          <el-table-column
            prop="note"
            label="报警描述"
            show-overflow-tooltip
            align="center"
          />
          <el-table-column
            prop="alarmCount"
            label="报警次数"
            align="center"
          />
        </el-table>
      </el-main>
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
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App',
  components: {
    DateRangeSelector: () => import('@/components/dateRangeSelector.vue')
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private alarmList: Array<any> = []
  private row: any = {}
  private params: any = {
    alarmId: '',
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
  private addressOptions: any = [
    {
      label: '南山区',
      value: '南山区'
    }
  ]
  created(){
    this.handleGetTypeList()
    this.initTableData()
  }
  private handleGetTypeList(){
    this.$http({
      url: '/obs/alarm/findObsAlarmList',
      method: 'post'
    }).then((res) => {
      this.alarmList = res.data
    })
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
      url: '/obs/alarm/getObserverAlarmLogStatisticsByPage',
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
}
</script>
<style scoped>
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
