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
              class="form-item"
            >
              <el-form-item
                label="姓名"
              >
                <el-input
                  ref="params"
                  v-model="params.userName"
                  placeholder="请输入姓名"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item label="身份证号">
                <el-input
                  v-model="params.idno"
                  placeholder="请输入身份证号"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item
                class="ke-center"
                label="编号"
              >
                <el-input
                  v-model="params.workNo"
                  placeholder="请输入编号"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item label="人员类型">
                <ke-dict
                  v-model="params.userType"
                  placeholder="请选择人员类型"
                  code="observer_type"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
              class="form-item"
            >
              <date-range-selector
                start-label="离职时间"
                end-label="至"
                :start-value.sync="params.dimissionStartDate"
                :end-value.sync="params.dimissionEndDate"
                label-width="85px"
              />
            </el-col>
            <el-col
              class="form-item"
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
              style="text-align: left;padding-left: 10px"
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
          <el-row>
            <el-col
              :span="24"
              class="buttons"
            >
              <el-button
                v-power
                code="edit"
                @click="handleReworkClick"
              >
                复 职
              </el-button>
              <el-button
                v-power
                code="refresh"
                @click="handleReload"
              >
                <svg-icon name="reset" />刷新
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
            prop="sex"
            label="性别"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.sex == 1?"男":"女" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="workerNo"
            label="编号"
            align="center"
          />
          <el-table-column
            prop="nativePlace"
            label="籍贯"
            align="center"
          />
          <el-table-column
            prop="userType"
            label="人员类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.userType | userTypeFilter(dict) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="联系电话"
            align="center"
          />
          <!-- <el-table-column
            prop="area"
            label="所属区域"
            align="center"
          /> -->
          <el-table-column
            prop="entryDate"
            width="100"
            label="上岗时间"
            align="center"
          />
          <el-table-column
            prop="leftTime"
            width="100"
            label="离岗时间"
            align="center"
          />
          <el-table-column
            prop="leftCount"
            label="离职记录"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleShowRecord(scope.row.id)"
              >
                {{ scope.row.leftCount }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="reason"
            label="离职原因"
            show-overflow-tooltip
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
    <record
      v-if="dialog.visible"
      :dialog.sync="dialog"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    Record: () => import('./record.vue'),
    DateRangeSelector: () => import('@/components/dateRangeSelector.vue')
  },
  filters: {
    userTypeFilter: function(val,list:Array<any>){
      for (let i of list){
        if (val === i.dictValue){
          return i.dictName
        }
      }
      return ''
    }
  }
})
export default class extends Vue {
  private total :number = 0
  private row: any = 0
  private selections: Array<any> = []
  private dict: Array<any> = []
  private listLoading: boolean = true
  private dialog: any = {
    visible: false,
    id: 0
  }
  private tableData: Array<any> = []
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
    page: 1,
    userType: '',
    idno: '',
    workNo: '',
    areaId: '',
    userName: '',
    dimissionStartDate: '',
    dimissionEndDate: '',
    rows: this.$base.grid.page
  }
  private personOptions: any = [
    {
      label: '一般人员',
      value: 1
    },
    {
      label: '中队长',
      value: 2
    },
    {
      label: '分队长',
      value: 3
    },
    {
      label: '大队长',
      value: 4
    }
  ]
  created() {
    this.handleGetUserType()
    this.initTableData()
  }
  async handleGetUserType(){
    let res = await this.$base.dict.getItems('observer_type')
    console.log('res',res)
    this.dict = res
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
      url: '/obs/dimission/findObserverDimissionByPage',
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
  private handleShowRecord(id): void{
    this.dialog = {
      visible: true,
      id
    }
  }
  private handleReworkClick(): void {
    if (this.selections.length === 0){
      this.$base.win.msg('请至少选择一条人员数据进行操作！','error')
      return
    }
    this.handleRework()
  }
  private handleRework():void{
    this.$base.grid
      .remove(this.selections,'确定复职选中的人员吗？','提示')
      .then((ids: string) => {
        this.$http
          .request({
            url: '/obs/dimission/reJob',
            method: 'post',
            data: {
              ids: ids
            }
          })
          .then((res: any) => {
            this.$base.win.msg('操作成功', 'success')
            this.initTableData()
          })
      })
      .catch(() => {})
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
}
</script>
<style lang="scss" scoped>
</style>
