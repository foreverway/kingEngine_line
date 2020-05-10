<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="params"
          class="ke-search"
          label-width="77px"
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
            <el-col
              :span="6"
            >
              <el-form-item
                label-width="85px"
                label="所属区域"
              >
                <ke-tree
                  v-model="params.areaId"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
            >
              <el-form-item
                label-width="85px"
                label="城管通号"
              >
                <el-input
                  v-model="params.pdaNum"
                  placeholder="请输入城管通号"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
            >
              <el-form-item
                label="GPS状态"
                label-width="90px"
              >
                <el-select
                  v-model="params.gpsSignal"
                  placeholder="请选择GPS状态"
                >
                  <el-option
                    v-for="item in gpsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="6"
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
        <div class="ke-buttons">
          <el-button
            v-power
            code="location"
            @click="handleLocate"
          >
            定 位
          </el-button>
          <el-button
            v-power
            code="replayTrack"
            @click="handlePlayTrace"
          >
            轨迹回放
          </el-button>
          <el-button
            v-power
            code="groupMessage"
            @click="handleGroupMessage"
          >
            群发消息
          </el-button>
          <el-button
            v-power
            code="exportExcel"
            @click="handleExport"
          >
            <svg-icon name="export" />导出
          </el-button>
          <el-button
            v-power
            code="refresh"
            @click="handleReload"
          >
            <svg-icon name="reset" />刷新
          </el-button>
          <div class="margin-left">
            此次查询结果：共{{ count.obsCount||0 }}人；登录在线{{ count.onLineCount||0 }}人，其中GPS可定位：{{ count.gpsOnLineCount||0 }}人。
          </div>
        </div>
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
            type="index"
            align="center"
            fixed="left"
          />
          <el-table-column
            type="selection"
            align="center"
            fixed="left"
          />
          <el-table-column
            prop="userName"
            label="姓名"
            align="center"
            width="120"
            fixed="left"
          />
          <el-table-column
            prop="isOnline"
            label="登录状态"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.isOnline === 1?'在线':'离线' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="gpsStatus"
            label="GPS状态"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.gpsSignal === 1? '在线':'离线' }}
            </template>
          </el-table-column>
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
            prop="num"
            label="城管通号"
            align="center"
          />
          <el-table-column
            prop="version"
            label="城管通版本"
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
    <message
      v-if="dialog.visible"
      :dialog.sync="dialog"
    />
    <check
      v-if="dialog.visible"
      :dialog.sync="checkDialog"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exportXls from '@/utils/export'
@Component({
  name: 'App',
  components: {
    Message: () => import('./message.vue'),
    Check: () => import('./check.vue')
  },
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
  private count: any = {}
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private row: any = {}
  private dialog: any = {
    visible: false
  }
  private checkDialog: any = {
    visible: false
  }
  private params: any = {
    pdaNum: '',
    userName: '',
    areaId: '',
    gpsSignal: '',
    isOnline: '',
    page: 1,
    rows: this.$base.grid.page
  }
 private addressOptions: any = [
   {
     label: '宝安区',
     value: '宝安区'
   },
   {
     label: '南山区',
     value: '南山区'
   },
   {
     label: '罗湖区',
     value: '罗湖区'
   },{
     label: '福田区',
     value: '福田区'
   },{
     label: '龙岗区',
     value: '龙岗区'
   },{
     label: '盐田区',
     value: '盐田区'
   },{
     label: '龙华区',
     value: '龙华区'
   }
 ]
  private gpsOptions: any = [
    {
      label: '在线',
      value: 1
    },
    {
      label: '离线',
      value: 2
    }
  ]
  private onlineOptions: any = [{
    value: 1,
    label: '在线'
  },{
    value: 2,
    label: '离线'
  }]
  created(){
    this.initTableData()
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.handleGetCount()
    this.$http({
      url: '/obs/onduty/findSchedulePage',
      method: 'post',
      data: this.params
    }).then((res) => {
      console.log('rows',res.rows)
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
  private handleLocate():void{
    // TODO: 巡查员定位
  }
  private handlePlayTrace():void{
    // TODO: 轨迹回放
  }
  private handleGetCount(){
    this.$http({
      url: 'obs/onduty/getObsOnlineStaVO',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.count = res.data
    })
  }
  private handleGroupMessage(): void {
    this.dialog.visible = true
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.$base.common.reset(this)
  }
  private handleOrderSpan(obj){
    // if (this.tableData.length > 1){
    //   // 前两列
    //   if (obj.columnIndex < 5){
    //     if (obj.rowIndex !== this.tableData.length - 1){
    //       if (this.tableData[obj.rowIndex].userName === this.tableData[obj.rowIndex + 1].userName){
    //         return {
    //           rowspan: 2,
    //           colspan: 1
    //         }
    //       }
    //     }
    //     if (this.tableData[obj.rowIndex].userName === this.tableData[obj.rowIndex - 1].userName){
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       }
    //     }
    //     return {
    //       rowspan: 1,
    //       colspan: 1
    //     }
    //   }
    // }
    if (this.tableData.length > 1){
      // 前两列
      if (obj.columnIndex < 5){
        // console.log('obj.rowIndex',obj.rowIndex)
        if (obj.rowIndex !== 0){
          if (this.tableData[obj.rowIndex].userName === this.tableData[obj.rowIndex - 1].userName){
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
        if (obj.rowIndex !== this.tableData.length - 1){
          if (this.tableData[obj.rowIndex].userName === this.tableData[obj.rowIndex + 1].userName){
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
    if (this.tableData[currentRow].userName === this.tableData[currentRow + 1].userName){
      return this.countSameColumn(++currentRow,++sum)
    }
    return sum

  }

  private handleExport(): void{
    exportXls('/obs/onduty/exportTodayPage',this)
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
<style lang="scss" scoped>
.ke-buttons{
  display: flex;
  flex-flow: row;
  align-items: center;
  .margin-left{
    margin-left: 10px;
  }
}
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
