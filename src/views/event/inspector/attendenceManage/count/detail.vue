<!-- eslint-disable no-irregular-whitespace -->
<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="1000px"
  >
    <el-header height="auto">
      <el-form
        :model="params"
        class="ke-search"
        label-width="75px"
      >
        <el-row class="align-center">
          <el-col
            :span="6"
            class="form-item"
          >
            <el-form-item
              label="开始日期"
            >
              <el-date-picker
                v-model="params.startTime"
                :picker-options="pickerOptions"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            class="form-item"
          >
            <el-form-item
              label="结束日期"
            >
              <el-date-picker
                v-model="params.endTime"
                :picker-options="pickerOptions"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="5"
            class="form-item"
          >
            <span style="margin-left:10px">巡查员：</span>
            {{ dialog.item.observerName }}
          </el-col>
          <el-col
            :span="5"
            class="form-item"
          >
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >
              查询
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-header>
    <div style="height:400px">
      <el-scrollbar
        class="ke-scrollbar"
        style="height:100%"
      >
        <el-table
          ref="sonTable"
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
            fixed="left"
          />
          <el-table-column
            prop="scheduleTime"
            label="日期"
            align="center"
            fixed="left"
          />
          <el-table-column
            prop="gridName"
            label="网格名称"
            align="center"
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
            prop="address"
            label="上班打卡"
            align="center"
          >
            <template slot-scope="scope">
              <p
                v-if="scope.row.signLogs[0].ondutyState !== 4"
                class="time"
              >
                {{ scope.row.signLogs[0].signDate }}
              </p>
              <p class="row-cell">
                <span
                  v-if="scope.row.signLogs[0].ondutyState!==1"
                  :class="scope.row.signLogs[0].ondutyState|stateStyleFilter"
                >{{ scope.row.signLogs[0].ondutyState | stateFilter }}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="下班打卡"
            align="center"
          >
            <template slot-scope="scope">
              <p
                v-if="scope.row.signLogs[1].ondutyState !== 4"
                class="time"
              >
                {{ scope.row.signLogs[1].signDate }}
              </p>
              <p class="row-cell">
                <span
                  v-if="scope.row.signLogs[1].ondutyState!==1"
                  :class="scope.row.signLogs[1].ondutyState|stateStyleFilter"
                >{{ scope.row.signLogs[1].ondutyState | stateFilter }}</span>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <el-footer
      class="footer"
      height="auto"
    >
      <el-pagination
        background
        class="ke-page"
        layout="prev, pager, next,total,jumper"
        :total="total"
        :current-page.sync="params.page"
        @current-change="handlePage"
      />
    </el-footer>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElTable } from 'element-ui/types/table'
@Component({
  name: 'TaskForm',
  components: {
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
  @Prop({ type: Object, default: {} }) dialog!: any
  private listLoading: boolean = true
  private params: any = {
    startTime: '',
    endTime: '',
    obsId: '',
    page: 1
  }
  private total: number = 0
  private tableData: Array<any> = []
  private selections:any = {}
  private row: any = {}
  mounted() {
    this.params.obsId = this.dialog.item.observerId
    this.initTableData()
  }
  private initTableData() {
    return new Promise((resolve,reject) => {
      this.listLoading = true
      this.$http({
        url: '/obs/signlog/getObsSignLogDetailByPage',
        method: 'post',
        data: this.params
      }).then((res) => {
        this.tableData = res.rows
        this.total = res.total
        resolve()
        this.$nextTick(() => {
          this.listLoading = false
        })
      })
    })
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
  private handleSearch(){
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(){
    this.$base.common.reset(this)
  }
  private handlePage(val){
    this.params.page = val
    this.initTableData()
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.sonTable, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections[this.params.page] = val
  }
  private handleClose(){
    let dialog = {
      visible: false,
      title: ''
    }
    this.$emit('update:dialog',dialog)
  }
}

</script>

<style lang="scss" scoped>
.align-center{
  justify-content: center;
}
.pane-item {
  height: 100%;
}
.form-item{
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 36px;
}
.opeate-buttons {
  text-align: right;
  margin-top: 15px;
}
.tips {
  color: #ff4949;
}
// .el-input,.el-select{
//   width: 210px;
// }
.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
.item-panel{
  margin-left: 30px;
  height: 35px;
  display: flex;
  flex-flow: row;
  align-items: center;
}
.footer{
  height: 42px !important
}
</style>
