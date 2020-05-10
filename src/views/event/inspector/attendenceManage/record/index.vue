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
              <el-form-item
                label-width="60px"
                label="姓名"
              >
                <el-input
                  v-model="params.userName"
                  placeholder="请输入姓名"
                />
              </el-form-item>
            </el-col>
            <el-col
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
              :span="6"
            >
              <el-form-item label="当班时间">
                <el-date-picker
                  v-model="params.scheduleDate"
                  placeholder="请选择当班时间"
                  :picker-options="pickerOptions"
                  value-format="yyyy-MM-dd"
                  align="right"
                  type="date"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
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
                type="warning"
                code="reset"
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
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align="center"
            label="数字化城市管理系统打卡记录表（2019-02-27）"
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
              prop="gridCode"
              label="网格编号"
              align="center"
            />
            <el-table-column
              prop="gridName"
              label="网格名称"
              align="center"
            />
            <el-table-column
              prop="scheduleClassName"
              label="班次"
              align="center"
            />
            <el-table-column
              prop="on"
              label="上班打卡"
              align="center"
            >
              <el-table-column
                prop="onTime"
                label="打卡时间"
                width="100px"
                align="center"
              >
                <template
                  slot-scope="scope"
                >
                  <div>
                    {{ scope.row.signLogs[0].signDate }}
                    <p
                      v-if="scope.row.signLogs[0].ondutyState!==1"
                      :class="scope.row.signLogs[0].ondutyState|stateStyleFilter"
                    >
                      {{ scope.row.signLogs[0].ondutyState | stateFilter }}
                    </p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="onType"
                label="打卡方式"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.signLogs[0].ondutyState !== 4"
                    type="text"
                    class="text-button"
                    @click="handleShowDetail(scope.row.signLogs[0])"
                  >
                    {{ scope.row.signLogs[0].checkType | signTypeFilter }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table-column>
            <el-table-column
              prop="off"
              label="下班打卡"
              align="center"
            >
              <el-table-column
                prop="offTime"
                label="打卡时间"
                width="100px"
                align="center"
              >
                <template
                  slot-scope="scope"
                >
                  <div>
                    {{ scope.row.signLogs[1].signDate }}
                    <p
                      v-if="scope.row.signLogs[1].ondutyState!==1"
                      :class="scope.row.signLogs[1].ondutyState|stateStyleFilter"
                    >
                      {{ scope.row.signLogs[1].ondutyState | stateFilter }}
                    </p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="offType"
                label="打卡方式"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.signLogs[1].ondutyState !== 4"
                    type="text"
                    class="text-button"
                    @click="handleShowDetail(scope.row.signLogs[1])"
                  >
                    {{ scope.row.signLogs[1].checkType | signTypeFilter }}
                  </el-button>
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
    <info
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
    info: () => import('./info.vue')
  },
  filters: {
    signTypeFilter(type:Number){
      return type === 1 ? '定位打卡' : '拍照打卡'
    },
    stateStyleFilter(type:Number){
      switch (type){
      case 1:
        return 'limegreen'
      case 2:
        return 'orange'
      case 3:
        return 'red'
      case 4:
        return 'orangered'
      case 5:
        return 'limegreen'
      default:
        return 'limegreen'
      }
    },
    stateFilter(type:Number){
      switch (type){
      case 1:
        return '正常'
      case 2:
        return '迟到'
      case 3:
        return '早退'
      case 4:
        return '未打卡'
      case 5:
        return '请假'
      default:
        return '正常'
      }
    }
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private row: any = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private dialog: any = {
    title: '',
    visible: false
  }
  private params: any = {
    userName: '',
    areaId: '',
    scheduleDate: '',
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
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/signlog/getObserverSignLogByPage',
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
  private handleShowDetail(data){
    this.dialog = {
      visible: true,
      title: data.checkType === 1 ? '定位打卡' : '拍照打卡',
      id: data.id
    }
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
  private handleExport(): void {
    exportXls('obs/signlog/exportObserverSignLog',this)
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
