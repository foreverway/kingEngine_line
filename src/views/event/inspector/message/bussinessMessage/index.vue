<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="params"
          class="ke-search"
          label-width="80px"
        >
          <el-row>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item label="发送人">
                <el-input
                  v-model="params.sendManName"
                  placeholder="请输入发送人姓名"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item label="接收人">
                <el-input
                  v-model="params.receiveManName"
                  placeholder="请输入接收人姓名"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="12"
              class="form-item"
            >
              <date-range-selector
                start-label="创建时间"
                end-label="至"
                :start-value.sync="params.startDate"
                :end-value.sync="params.endDate"
                label-width="auto"
              />
              <!-- <el-form-item
                label-width="85px"
                label="创建时间"
              >
                <el-date-picker
                  v-model="params.startDate"
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
                  v-model="params.endDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions"
                  align="right"
                  type="datetime"
                /> -->
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item
                label-width="85px"
                label="消息类型"
              >
                <ke-dict
                  v-model="params.msgType"
                  placeholder="请选择消息类型"
                  code="obs_msg_type"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              class="buttons"
              style="width:40.66667%;"
            >
              <el-button
                v-power
                type="primary"
                icon="el-icon-search"
                code="search"
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
          />
          <el-table-column
            prop="senderName"
            label="发送人"
            align="center"
          />
          <el-table-column
            prop="receiverName"
            label="接收人"
            align="center"
          />
          <el-table-column
            prop="msgType"
            label="消息类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.msgType | messageFilter(dictList) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="content"
            label="消息内容"
            align="center"
          />
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
          />
          <el-table-column
            prop="sendTime"
            label="发送时间"
            align="center"
          />
          <el-table-column
            label="详情"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleShowDetail(scope)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
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
    <detail-form
      v-if="dialog.visible"
      :dialog.sync="dialog"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App',
  components: {
    DetailForm: () => import('./detail.vue'),
    DateRangeSelector: () => import('@/components/dateRangeSelector.vue')
  },
  filters: {
    messageFilter: function(value,list){
      if (list){
        for (let i of list){
          if (i.dictValue === value){
            return i.dictName
          }
        }
      }
      return ''
    }
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private dictList: Array<any> = []
  private row: any = {}
  private dialog: any = {
    visible: false
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

  private params: any = {
    msgType: '',
    sendManName: '',
    receiveManName: '',
    startDate: '',
    endDate: '',
    page: 1,
    rows: this.$base.grid.page
  }
  created(){
    this.handleGetMessageType()
    this.initTableData()
  }
  async handleGetMessageType(){
    let res = await this.$base.dict.getItems('obs_msg_type')
    // console.log('res',res)
    this.dictList = res
  }
  private handleShowDetail(scope){
    this.dialog.visible = true
    this.dialog.item = scope.row
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
      url: '/obs/msg/findMessageByPage',
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
  private handlePreview(){

  }
  private handleDownload(){

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
      text-align: right;
      width: 85px;
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
