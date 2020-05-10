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
                  v-model="params.userName"
                  placeholder="请输入姓名"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
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
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
            >
              <el-form-item label="城管通号">
                <el-input
                  v-model="params.pdaNum"
                  placeholder="请输入城管通号"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="10"
              class="buttons"
            >
              <el-button
                v-power
                code="replayTrack"
                @click="handlePlayTrace"
              >
                轨迹回放
              </el-button>
              <el-button
                v-power
                code="refresh"
                @click="handleReload"
              >
                <svg-icon name="reset" />刷新
              </el-button>
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
            type="index"
            align="center"
            fixed
          />
          <el-table-column
            type="selection"
            align="center"
            fixed
          />
          <el-table-column
            prop="userName"
            label="姓名"
            align="center"
            width="120"
            fixed
          />
          <el-table-column
            prop="pdaNum"
            label="城管通号"
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
            prop="className"
            label="班次"
            align="center"
          />
          <el-table-column
            label="上班打卡"
            align="center"
            width="120px"
          >
            <template
              v-if="scope.row.signlogs[0]"
              slot-scope="scope"
            >
              <p class="row-cell">
                <el-button
                  v-if="scope.row.signlogs[0].ondutyState !== 4"
                  type="text"
                  class="text-button"
                >
                  {{ scope.row.signlogs[0].signType | signTypeFilter }}
                </el-button>
                <span
                  v-if="scope.row.signlogs[0].ondutyState!==1"
                  :class="scope.row.signlogs[0].ondutyState|stateStyleFilter"
                >{{ scope.row.signlogs[0].ondutyState | stateFilter }}</span>
              </p>
              <p
                v-if="scope.row.signlogs[0].ondutyState !== 4"
                class="time"
              >
                {{ scope.row.signlogs[0].signDate }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="下班打卡"
            width="120px"
            align="center"
          >
            <template
              v-if="scope.row.signlogs[1]"
              slot-scope="scope"
            >
              <p class="row-cell">
                <el-button
                  v-if="scope.row.signlogs[1].ondutyState !== 4"
                  type="text"
                  class="text-button"
                >
                  {{ scope.row.signlogs[1].signType | signTypeFilter }}
                </el-button>
                <span
                  v-if="scope.row.signlogs[1].ondutyState!==1"
                  :class="scope.row.signlogs[1].ondutyState|stateStyleFilter"
                >{{ scope.row.signlogs[1].ondutyState | stateFilter }}</span>
              </p>
              <p
                v-if="scope.row.signlogs[1].ondutyState !== 4"
                class="time"
              >
                {{ scope.row.signlogs[1].signDate }}
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="所属区域"
            prop="areaNmae"
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
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App',
  filters: {
    signTypeFilter(type:Number){
      return type === 1 ? '定位打卡' : '拍照打卡'
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
    }
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
    pdaNum: '',
    scheduleDate: '',
    userName: '',
    areaId: '',
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
      url: '/obs/onduty/findSchedulePage',
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
  private handlePlayTrace(){
    // TODO: 轨迹回放
  }
}
</script>
<style lang="scss" scoped>
.text-button{
  padding: 0 !important;
}
.row-cell,.time{
  font-size: 13px;
  span{
    font-size: 11px;
  }
}
.time {
  font-size: 12px !important;
  line-height: 13px !important;
}
</style>
