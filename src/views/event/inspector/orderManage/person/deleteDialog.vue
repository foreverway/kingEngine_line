<template>
  <el-dialog
    v-dialog-drag
    title="删除排班"
    :visible.sync="dialog.visible"
    width="1000px"
  >
    <div>
      <el-form
        class="rulesForm"
        label-width="75px"
      >
        <div class="form-container">
          <el-row>
            <el-col :span="6">
              <el-form-item label="开始日期">
                <el-date-picker
                  v-model="formData.startDate"
                  placeholder="请选择开始时间"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="终止日期">
                <el-date-picker
                  v-model="formData.endDate"
                  placeholder="请选择结束时间"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label-width="55px"
                label="班次"
              >
                <el-select
                  v-model="formData.scheduleClassId"
                  placeholder="请选择班次"
                >
                  <el-option
                    v-for="(item,index) in classesList"
                    :key="index"
                    :label="item.className"
                    :value="item.id"
                  >
                    {{ item.className }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="main-container">
      <div style="height:300px">
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
      </div>
      <el-footer class="footer">
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper"
          :total="total"
          :current-page.sync="params.page"
          @current-change="handlePage"
        />
      </el-footer>
      <div
        class="opeate-buttons"
      >
        <el-button
          type="danger"
          @click="handleDelete"
        >
          删除
        </el-button>
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class CopyDialog extends Vue {
  @Prop({ default: { visible: false } }) dialog!: any
  private row: any = ''
  private total: number = 0
  private tableData: any = []
  private classesList: any = []
  private selections: Array<any> = []
  private listLoading: boolean = true
  private params:any= {
    page: 1
  }
  private formData:any = {
    startDate: '',
    endDate: '',
    scheduleClassId: '',
    cellCodes: ''
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
  mounted(){
    this.initTable()
    this.handleGetClasses()
  }
  private initTable(){
    this.listLoading = true
    this.$http({
      url: '/obs/workGrid/findWorkGridByPage',
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
  private handleGetClasses(){
    this.$http({
      url: '/obs/scheduleClass/findScheduleClassList',
      method: 'post'
    }).then((res) => {
      this.classesList = res.data
    })
  }
  private handleCancel(){
    let dialog = {
      visible: false
    }
    this.$emit('update:dialog',dialog)
  }
  private handleDelete(){
    if (this.selections.length <= 0){
      this.$base.win.msg('请至少选择一条数据')
      return
    }
    this.alertDelete().then(() => {
      let ids :any = []
      this.selections.forEach((item) => {
        ids.push(item.id)
      })
      this.formData.cellCodes = ids.join(',')
      this.$http({
        url: '/obs/ws/deleteWorkerSchedule',
        method: 'post',
        data: this.formData
      }).then(() => {
        this.$base.win.msg('操作成功','success')
        this.$emit('reload')
        this.handleCancel()
      })
    })
  }
  private alertDelete(){
    return new Promise((resolve,reject) => {
      this.$confirm('确认删除？将删除指定时间范围、班次和网格内的排班记录！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resolve()
      })
    })
  }
  private handlePage(val){
    this.params.page = val
    this.initTable()
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
.el-dialog{
  height: 400px;
}
.rulesForm >>> .el-row{
  display: flex;
  flex-flow: row;
  justify-content: center;
}
.footer{
  height: 50px !important;
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
