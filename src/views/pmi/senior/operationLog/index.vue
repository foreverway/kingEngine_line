<template>
  <div class="page">
    <el-container>
      <el-main class="ke-body">
        <el-form
          class="ke-search form-container"
          label-width="80px"
        >
          <el-row class="ke-search">
            <el-col :span="5">
              <el-form-item
                label="用户名"
                prop="userName"
              >
                <el-input
                  v-model="params.userName"
                  placeholder="请输入用户名"
                  suffix-icon="el-icon-edit"
                  clearable
                  @focus="handleChoose"
                  @clear="handleClear"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="操作时间"
                prop="dictName"
              >
                <el-date-picker
                  v-model="params.startTime"
                  type="datetime"
                  placeholder="请选择日期时间"
                  :picker-options="beginTimeOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="至"
                prop="dictName"
                label-width="35px"
                class="ka-label-center"
              >
                <el-date-picker
                  v-model="params.endTime"
                  type="datetime"
                  placeholder="请选择日期时间"
                  :picker-options="endTimeOption"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
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
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          style="width: 100%"
          height="100%"
          highlight-current-row
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="index"
            align="center"
          />
          <!-- <el-table-column
            type="selection"
            align="center"
          /> -->
          <el-table-column
            prop="userName"
            label="用户名"
            align="center"
            width="120"
          />
          <!-- <el-table-column
            prop="logTime"
            label="操作时间"
            align="center"
          /> -->
          <el-table-column
            align="center"
            label="操作时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.requestTime | dateFormat('yyyy-MM-dd HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="userIp"
            label="IP地址"
            align="center"
          />
          <el-table-column
            prop="sysPrefix"
            label="系统名称"
            align="center"
          />
          <el-table-column
            prop="requestUrl"
            label="地址"
            align="center"
          />
          <el-table-column
            prop="requestParam"
            label="参数"
            align="center"
          />
        </el-table>
        <el-footer>
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev, pager, next,total,jumper, sizes"
            :total="params.total"
            :page-size.sync="params.rows"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="handleSizeChange"
          />
        </el-footer>
      </el-main>
    </el-container>
    <my-user
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :select-user.sync="selectUser"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
import dateFormatFilter from '@/utils/filters/dateFormat'
@Component({
  name: 'OperationLog',
  components: {
    MyUser: () => import('./user.vue')
  }
})
export default class extends Vue {
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private tableData: Array<any> = []
  // 选中要修改的数据
  private selectionItem: any = {}
  // 选择用户弹窗选中的用户信息
  private selectUser: object = {}
  private dialog: any = {
    title: '',
    visible: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    endTime: null,
    startTime: null,
    userName: ''
  }
  created() {
    this.initTableData()
  }
  @Watch('selectUser')
  private handleUserChanged(val: any, oldVal: any): void {
    if (val !== oldVal) {
      this.params.userName = val.userName
    }
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: '/sys/log/operate/list',
        method: 'get',
        params: this.params
      })
      .then((res: any) => {
        // console.log(res)
        this.listLoading = false
        this.params.total = res.total
        this.tableData = res.rows
      })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleReload(): void {
    this.handleReset()
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    if (this.params.startTime) {
      this.params.startTime = dateFormatFilter(new Date(this.params.startTime), 'yyyy-MM-dd HH:mm:ss')
    }
    if (this.params.endTime) {
      this.params.endTime = dateFormatFilter(new Date(this.params.endTime), 'yyyy-MM-dd HH:mm:ss')
    }
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.userName = ''
    this.params.page = 1
    this.params.startTime = null
    this.params.endTime = null
  }
  private handleChoose(): void {
    this.dialog.title = '选择用户'
    this.dialog.visible = true
  }
  private handleClear(): void {
    this.params.id = 0
  }
  private beginTimeOption = {
    disabledDate: (time) => {
      let endDateVal = this.params.endTime
      if (endDateVal) {
        return time.getTime() > (new Date(endDateVal).getTime() - 60000 * 60)
      }
    }
  }
  private endTimeOption = {
    disabledDate: (time) => {
      let beginDateVal = this.params.startTime
      if (beginDateVal) {
        return (
          time.getTime() < (new Date(beginDateVal).getTime() + 60000 * 60)
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.page,
.el-container {
  height: 100%;
}
.ke-body {
  display: flex;
  flex-flow: column;
}
.el-footer {
  height: auto !important;
}
.form-container {
  margin-bottom: 0 !important;
}
.ka-label-center{
  text-align: center;
}
</style>
