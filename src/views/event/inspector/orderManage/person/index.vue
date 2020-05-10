<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <div class="ke-buttons">
          <el-button @click="handlePrev">
            上一周
          </el-button>
          <el-button @click="handleNext">
            下一周
          </el-button>
          <el-button
            v-power
            code="edit"
            @click="handleCopy"
          >
            复制排班
          </el-button>
          <el-button
            v-power
            code="del"
            @click="handleDelete"
          >
            删除排班
          </el-button>
          <el-button
            v-power
            code="exportExcel"
            @click="handleExport"
          >
            <svg-icon name="export" />导出
          </el-button>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          class="eltable"
          :data="tableData"
          stripe
          style="width: 100%"
          height="100%"
          :span-method="handleOrderSpan"
          @cell-dblclick="handleCellDbClick"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            align="center"
            :label="`数字化城市管理系统排班记录表（${dates[0]}至${dates[6]}）`"
          >
            <el-table-column
              prop="gridName"
              label="网格名称"
              align="center"
              width="120"
            />
            <el-table-column
              prop="gridCode"
              label="网格编号"
              align="center"
            />
            <el-table-column
              prop="scheduleClassName"
              label="班次"
              align="center"
            />
            <el-table-column
              prop="firstObserver"
              :label="dates[0]"
              :class-name="dates[0] | classFilter"
              align="center"
            >
              <template
                slot="header"
              >
                <div class="header-block">
                  <p>{{ dates[0] }}</p>
                  <p>周一</p>
                </div>
              </template>
              <template
                slot-scope="scope"
              >
                <div
                  class="cell"
                >
                  <div
                    v-for="(item,index) in scope.row.firstObserver"
                    :key="index"
                    class="name-button"
                  >
                    {{ item.userName }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="secendObserver"
              :label="dates[1]"
              :class-name="dates[1] | classFilter"
              align="center"
            >
              <template
                slot="header"
              >
                <div class="header-block">
                  <p>{{ dates[1] }}</p>
                  <p>周二</p>
                </div>
              </template>
              <template slot-scope="scope">
                <div
                  class="cell"
                >
                  <div
                    v-for="(item,index) in scope.row.secendObserver"
                    :key="index"
                    class="name-button"
                  >
                    {{ item.userName }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="thirdObserver"
              :label="dates[2]"
              :class-name="dates[2] | classFilter"
              align="center"
            >
              <template
                slot="header"
              >
                <div class="header-block">
                  <p>{{ dates[2] }}</p>
                  <p>周三</p>
                </div>
              </template>
              <template slot-scope="scope">
                <div
                  class="cell"
                >
                  <div
                    v-for="(item,index) in scope.row.thirdObserver"
                    :key="index"
                    class="name-button"
                  >
                    {{ item.userName }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="fourthObserver"
              :label="dates[3]"
              :class-name="dates[3] | classFilter"
              align="center"
            >
              <template
                slot="header"
              >
                <div class="header-block">
                  <p>{{ dates[3] }}</p>
                  <p>周四</p>
                </div>
              </template>
              <template slot-scope="scope">
                <div
                  class="cell"
                >
                  <div
                    v-for="(item,index) in scope.row.fourthObserver"
                    :key="index"
                    class="name-button"
                  >
                    {{ item.userName }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="fifthObserver"
              :label="dates[4]"
              :class-name="dates[4] | classFilter"
              align="center"
            >
              <template
                slot="header"
              >
                <div class="header-block">
                  <p>{{ dates[4] }}</p>
                  <p>周五</p>
                </div>
              </template>
              <template
                slot-scope="scope"
              >
                <div
                  class="cell"
                >
                  <div
                    v-for="(item,index) in scope.row.fifthObserver"
                    :key="index"
                    class="name-button"
                  >
                    {{ item.userName }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="sixthObserver"
              :label="dates[5]"
              :class-name="dates[5] | classFilter"
              align="center"
            >
              <template
                slot="header"
              >
                <div class="header-block">
                  <p>{{ dates[5] }}</p>
                  <p>周六</p>
                </div>
              </template>
              <template slot-scope="scope">
                <div
                  class="cell"
                >
                  <div
                    v-for="(item,index) in scope.row.sixthObserver"
                    :key="index"
                    class="name-button"
                  >
                    {{ item.userName }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="seventhObserver"
              :label="dates[6]"
              :class-name="dates[6] | classFilter"
              align="center"
            >
              <template
                slot="header"
              >
                <div class="header-block">
                  <p>{{ dates[6] }}</p>
                  <p>周日</p>
                </div>
              </template>
              <template slot-scope="scope">
                <div
                  class="cell"
                >
                  <div
                    v-for="(item,index) in scope.row.seventhObserver"
                    :key="index"
                    class="name-button"
                  >
                    {{ item.userName }}
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <copy-dialog
      v-if="copyDialog.visible"
      :dialog.sync="copyDialog"
      @reload="handleReload"
    />
    <delete-dialog
      v-if="deleteDialog.visible"
      :dialog.sync="deleteDialog"
      @reload="handleReload"
    />
    <observer
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :select-users.sync="selectUsers"
      :visible="dialog.visible"
    />
  </el-container>
</template>
<style scoped>

</style>
<script lang="ts">
import { Component, Vue,Watch } from 'vue-property-decorator'
import exportXls from '@/utils/export'
import dateUtils from '@/utils/date'
@Component({
  name: 'App',
  components: {
    KeLocate: () => import('@/components/keLocate.vue'),
    KeAside: () => import('@/components/keAside.vue'),
    observer: () => import('../../components/observer.vue'),
    copyDialog: () => import('./copyDialog.vue'),
    deleteDialog: () => import('./deleteDialog.vue')
  },
  filters: {
    classFilter: function(date){
      let today = new Date().getTime()
      let current = new Date(date).getTime()
      return !dateUtils.isSameDay(today,current) && (current < today) ? 'pass-date' : ''
    }
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  // 更新锁
  private update:boolean = false
  private row: any = {}
  private today: string = ''
  private selections: Array<any> = []
  private dates: Array<any> = []
  private coordinate: Array<any> = []
  private params: any = {
    page: 1
  }
  private form: any = {
    observerIds: '',
    scheduleClassId: '',
    scheduleDate: '',
    workGridCode: ''
  }
  private tableData: Array<any> = []
  private selectUsers:any = []
  private dialog: any = {
    title: '选择监督员',
    visible: false
  }
  private deleteDialog: any = {
    visible: false
  }
  private copyDialog: any = {
    visible: false
  }
  private created() :void{
    this.today = dateUtils.formatDate(new Date())
    this.dates = dateUtils.getDates(new Date())
    this.initTableData()
  }
  @Watch('selectUsers')
  handleSelectUserChange(newVal: Array<any>,oldVal: Array<any>){
    if (this.update){
      if (newVal.length < 1){
        return
      }
      console.log(newVal)
      this.listLoading = true
      let ids:any = []
      newVal.forEach((item) => {
        ids.push(item.id)
      })
      this.form.observerIds = ids.join(',')
      this.$http({
        url: '/obs/ws/addOrUpdateWorkerSchedule',
        method: 'post',
        data: this.form
      }).then((res) => {
        this.$base.win.msg('操作成功','success')
        this.initTableData()
      })
    } else {
      this.update = true
    }
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http({
      url: '/obs/ws/findWorkArrangeTree',
      method: 'post',
      data: {
        startTime: this.dates[0],
        endTime: this.dates[6]
      }
    }).then((res) => {
      this.tableData = res.data
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }
  private handleCellDbClick(row, column, cell, event){
    let today = new Date().getTime()
    let key = column.property
    if (key === 'scheduleClassName' || key === 'gridName' || key === 'gridCode'){
      return
    }
    console.log('column.time',row)
    let current = new Date(column.label).getTime()
    if (!dateUtils.isSameDay(today,current) && (current < today)){
      this.alertPassDate()
      return
    }
    this.update = false
    this.$nextTick(() => {
      this.selectUsers = row[key] ? row[key] : []
      this.form = {
        scheduleClassId: row.scheduleClassId,
        scheduleDate: column.label,
        workGridCode: row.gridCode,
        observerIds: ''
      }
      this.dialog.scheduleClassId = row.scheduleClassId
      this.dialog.scheduleDate = column.label
      this.dialog.visible = true
    })
  }
  private handlePrev(){
    let lastWeekTime = new Date(this.dates[0]).getTime() - 7 * 24 * 3600 * 1000
    this.dates = dateUtils.getDates(new Date(lastWeekTime))
    this.initTableData()
  }
  private handleNext(){
    let lastWeekTime = new Date(this.dates[0]).getTime() + 7 * 24 * 3600 * 1000
    this.dates = dateUtils.getDates(new Date(lastWeekTime))
    this.initTableData()
  }
  private handleCopy(){
    this.copyDialog = {
      visible: true
    }
  }
  private handleDelete(){
    this.deleteDialog = {
      visible: true
    }
  }
  private alertPassDate(){
    return new Promise((resolve,reject) => {
      this.$alert('已过期，不能进行排班管理！', '提示', {
        confirmButtonText: '确定',
        callback: (action) => {
          resolve()
        }
      })
    })
  }
  private handleExport():void{
    exportXls('obs/ws/exportWorkerSchedule',this)
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleOrderSpan(obj){
    if (this.tableData.length > 1){
      // 前两列
      if (obj.columnIndex < 2){
        // console.log('obj.rowIndex',obj.rowIndex)
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
  private handleReload(){
    this.$base.common.reload(this)
  }
  private handlePage(val): void {
    this.params.page = val
    this.initTableData()
  }
}
</script>
<style scoped>
.eltable >>> .cell, .el-table th div{
  text-overflow: clip !important;
}
.eltable >>> td.pass-date {
    background: #FFFACD !important;
    cursor:not-allowed !important;
  }
  .eltable >>> td.pass-date div{
    cursor:not-allowed !important;
  }
  .eltable >>>  .cell{
    width: 100%;
    height: 100%;
    cursor: pointer;
    /* min-height: 40px; */
    text-align: center;

    /* display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center; */
  }
  .header-block{
    line-height: 16px;
    font-size: 13px;
  }
</style>
<style lang="scss" scoped>

.name-button{
  display: inline;
  font-size: 12px;
  user-select:none;
  cursor: pointer;
}
.tree-container {
  height: calc(100% - 22px);
}
.ke-body {
  padding: 15px !important;
  flex-direction: column;
  display: flex;
  flex-shrink: 0;
  width: 229px;
}

.page {
  height: 100%;
  padding: 15px;
  .result-tips {
    margin-left: 15px;
  }
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
    margin-bottom: 15px;
    display: flex;
    flex-flow: row;
    align-items: center;
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
        width: 90px;
        text-align: right;
      }
    }
  }
}
</style>
