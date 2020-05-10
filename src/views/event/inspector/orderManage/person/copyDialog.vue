<template>
  <el-dialog
    v-dialog-drag
    title="复制"
    :visible.sync="dialog.visible"
    width="1000px"
  >
    <div>
      <el-tabs v-model="tabIdx">
        <el-tab-pane
          name="first"
          label="批量复制"
        >
          <el-form
            class="rulesForm"
            label-width="75px"
          >
            <div class="form-container">
              <el-row>
                <el-col :span="7">
                  <el-form-item label="开始日期">
                    <el-date-picker
                      v-model="multiFormData.startCopyDate"
                      placeholder="请选择开始时间"
                      :picker-options="pickerOptions"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="handleTimeChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="终止日期">
                    <el-date-picker
                      v-model="multiFormData.endCopyDate"
                      :picker-options="pickerOptions"
                      placeholder="请选择结束时间"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="handleTimeChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button
                    class="buttons"
                    type="primary"
                    @click="handleSubmit"
                  >
                    应用
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <el-form-item label="应用日期">
                    <el-date-picker
                      v-model="multiFormData.startScheduleDate"
                      placeholder="请选择开始时间"
                      :picker-options="pickerOptions"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="handleTimeChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="至">
                    <el-date-picker
                      v-model="multiFormData.endScheduleDate"
                      :picker-options="pickerOptions"
                      placeholder="请选择结束时间"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @change="handleTimeChange"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button
                    v-power
                    code="reset"
                    class="buttons"
                    type="warning"
                    @click="handleReset"
                  >
                    重置
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          name="second"
          label="单个复制"
        >
          <el-form
            class="rulesForm"
            label-width="75px"
          >
            <div class="form-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="复制日期">
                    <el-date-picker
                      v-model="singleFormData.copyDate"
                      placeholder="请选择复制日期"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="应用日期">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :disabled="singleFormData.scheduleDates?false:true"
                      :content="singleFormData.scheduleDates|scheduleDatesFilter"
                      placement="top-start"
                    >
                      <div class="button-container">
                        <el-button
                          type="text"

                          @click="showCalender"
                        >
                          {{ singleFormData.scheduleDates|scheduleDatesFilter }}
                        </el-button>
                      </div>
                    </el-tooltip>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-button
                    class="buttons"
                    type="primary"
                    @click="handleSubmit"
                  >
                    应用
                  </el-button>
                  <el-button
                    v-power
                    code="reset"
                    class="buttons"
                    type="warning"
                    @click="handleReset"
                  >
                    重置
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div
      class="main-container"
    >
      <el-scrollbar
        class="ke-scrollbar"
        style="height:100%"
      >
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          class="eltable"
          :data="tableData"
          style="width: 100%"
          highlight-current-row
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
            prop="gridCode"
            label="编码"
            align="center"
            fixed="left"
          />
          <el-table-column
            prop="gridName"
            label="网格名称"
            align="center"
            fixed="left"
          />
          <el-table-column
            prop="note"
            label="备注"
            align="center"
            fixed="left"
          />
        </el-table>
      </el-scrollbar>
      <div
        class="opeate-buttons"
      >
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
      </div>
    </div>
    <date-selector
      v-if="dateDialog.visible"
      :value.sync="singleFormData.scheduleDates"
      :dialog.sync="dateDialog"
    />
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import dateUtils from '@/utils/date'
@Component({
  components: {
    DateSelector: () => import('../../components/dateSelector.vue')
  },
  filters: {
    scheduleDatesFilter: function(value){
      return value ? value.join(',') : '选择日期'
    }
  }
})
export default class CopyDialog extends Vue {
  @Prop({ default: { visible: false } }) dialog!: any
  private singleFormData: any = {
    copyDate: '',
    netCellCode: '',
    scheduleDates: ''
  }
  private multiFormData:any = {
    cellCode: '',
    endCopyDate: '',
    endScheduleDate: '',
    startCopyDate: '',
    startScheduleDate: ''
  }
  private dateDialog:any = {
    visible: false
  }
  private selectMonth = ''
  private tableData: any = []
  private listLoading: boolean = true
  private selections: Array<any> = []
  private row: any = {}
  private tabIdx: string = 'first'
  mounted(){
    this.initTable()
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
  private initTable(){
    this.listLoading = true
    this.$http({
      url: '/obs/workGrid/findAllWorkGridList',
      method: 'post'
    }).then((res) => {
      this.tableData = res.data
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }
  private handleCancel(){
    let dialog = {
      visible: false
    }
    this.$emit('update:dialog',dialog)
  }
  private handleSubmit(){
    if (this.selections.length < 1){
      this.$base.win.msg('请选择一个工作组！','error')
      return
    } else if (this.selections.length > 1){
      this.$base.win.msg('当前操作只支持一条数据！','error')
      return
    }
    if (this.tabIdx === 'first'){
      this.handleMultiCopy()
    } else {
      this.handleSingleCopy()
    }
  }
  private showCalender(){
    this.dateDialog.visible = true
  }
  private handleMultiCopy(){
    this.multiFormData.cellCode = this.selections[0].gridCode
    for (let i in this.multiFormData){
      if (this.multiFormData[i] === ''){
        this.$base.win.msg('请选择日期')
        return
      }
    }
    this.$http({
      url: '/obs/ws/batchCopyWorkerSchedule',
      method: 'post',
      data: this.multiFormData
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('reload')
      this.handleCancel()
    })
  }
  private handleSingleCopy(){
    this.singleFormData.netCellCode = this.selections[0].gridCode
    for (let i in this.singleFormData){
      if (this.singleFormData[i] === ''){
        this.$base.win.msg('请选择日期')
        return
      }
    }
    this.$http({
      url: '/obs/ws/singleCopyWorkerSchedule',
      method: 'post',
      data: this.singleFormData
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('reload')
      this.handleCancel()
    })
  }
  private handleReset(){
    this.row = ''
    for (let i in this.singleFormData){
      if (this.singleFormData[i]){
        this.singleFormData[i] = ''
      }
    }
    for (let i in this.multiFormData){
      if (this.multiFormData[i]){
        this.multiFormData[i] = ''
      }
    }
  }
  private handleTimeChange(){
    this.handleExchange()
    for (let i in this.multiFormData){
      if (i === 'cellCode'){
        continue
      }
      if (this.multiFormData[i] === ''){
        return
      }
    }
    let temp = dateUtils.countDay(this.multiFormData.startCopyDate,this.multiFormData.endCopyDate)
    let temp2 = dateUtils.countDay(this.multiFormData.startScheduleDate,this.multiFormData.endScheduleDate)
    if (temp !== temp2){
      this.handleDateConfirm().then(() => {
        this.multiFormData.endScheduleDate = new Date(new Date(this.multiFormData.startScheduleDate).getTime() + temp)
      }).catch(() => {
        this.multiFormData.startScheduleDate = ''
        this.multiFormData.endScheduleDate = ''
      })
    }
  }
  private handleExchange(){
    let copyStart = this.multiFormData.startCopyDate
    let copyEnd = this.multiFormData.endCopyDate
    let scheduleStart = this.multiFormData.startScheduleDate
    let scheduleEnd = this.multiFormData.endScheduleDate
    if (copyStart && copyEnd){
      copyStart = new Date(copyStart).getTime()
      copyEnd = new Date(copyEnd).getTime()
      if (copyStart > copyEnd){
        let temp = this.multiFormData.startCopyDate
        this.multiFormData.startCopyDate = this.multiFormData.endCopyDate
        this.multiFormData.endCopyDate = temp
      }
    }
    if (scheduleStart && scheduleEnd){
      scheduleStart = new Date(scheduleStart).getTime()
      scheduleEnd = new Date(scheduleEnd).getTime()
      if (scheduleStart > scheduleEnd){
        let temp = this.multiFormData.startScheduleDate
        this.multiFormData.startScheduleDate = this.multiFormData.endScheduleDate
        this.multiFormData.endScheduleDate = temp
      }
    }
  }
  private handleDateConfirm(){
    return new Promise((resolve,reject) => {
      this.$confirm('当前复制时间的长度与应用时间的长度不一致，将以复制时间为主，是否继续操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resolve()
      }).catch((err) => {
        reject(err)
      })
    })
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
.button-container >>> span{
  display: block !important;
  width: 150px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  text-align: left;
}
.button-container >>> button{
  padding-left: 0!important;
}
.main-container{
  height: 300px;
  overflow: hidden;
}
.el-dialog{
  height: 400px;
}
.rulesForm >>> .el-row{
  display: flex;
  flex-flow: row;
  justify-content: center;
}
/* .el-header{
  height: 200px !important;
} */
.rulesForm >>> .el-form-item__label{
  padding: 0;
  text-align: center;
}
</style>
<style lang="scss" scoped>
  .buttons{
    margin-left: 10px;
  }
  .opeate-buttons{
    display: flex;
    flex-flow: row;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
