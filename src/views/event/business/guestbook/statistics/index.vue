<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <el-form
            class="ke-search"
            label-width="80px"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item
                  label="查询日期"
                  class="ke-center"
                >
                  <el-date-picker
                    v-model="params.startTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :picker-options="beginTimeOption"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="至"
                  class="ke-center"
                >
                  <el-date-picker
                    v-model="params.endTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    :picker-options="endTimeOption"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="人员类型">
                  <ke-dict code="cccc" />
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                class="buttons"
              >
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="handleSearch"
                >
                  查询
                </el-button>
                <el-button
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
            height="100%"
            style="width: 100%"
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
              prop="senderName"
              label="留言人员"
              align="center"
            />
            <el-table-column
              prop="department"
              label="所在部门"
              align="center"
            />
            <el-table-column
              prop="senderTypeStr"
              label="人员类型"
              align="center"
            />
            <el-table-column
              prop="sendNum"
              label="留言数量"
              align="center"
            />
            <el-table-column
              prop="replyNum"
              label="回复数量"
              align="center"
            />
          </el-table>
        </el-main>
        <el-footer height="auto">
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev, pager, next,total,jumper, sizes"
            :total="params.total"
            :page-size.sync="params.rows"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="initTableData(1)"
          />
        </el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'Statistics',
  components: {
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
  // private tableData: Array<any> = []
  private tableData: Array<any> = []
  // 弹窗新增或者删除
  private type: string = ''
  // 选中要修改的数据
  private selectionItem: any = {}
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    startTime: '',
    endTime: '',
    userType: 0
  }
  private beginTimeOption = {
    disabledDate: (time) => {
      let endDateVal = this.params.endTime
      if (endDateVal) {
        return time.getTime() > new Date(endDateVal).getTime()
      }
    }
  }
  private endTimeOption = {
    disabledDate: (time) => {
      let beginDateVal = this.params.startTime
      if (beginDateVal) {
        return (
          time.getTime() < new Date(beginDateVal).getTime()
        )
      }
    }
  }
  created() {
    this.initTableData()
  }
  private initTableData(page?:any): void {
    if (page){
      this.params.page = 1
      this.params.total = 0
    }
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http.request({
      url: '/evt/messageboard/findMessageStatistics',
      method: 'post',
      data: this.params
    }).then((res: any) => {
      this.params.total = res.total
      this.tableData = res.rows
    }).finally(() => {
      this.listLoading = false
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
    this.params.startTime = ''
    this.params.endTime = ''
    this.params.userType = 0
    this.initTableData(1)
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.initTableData(1)
  }
  private handleReset(): void {
    this.params.startTime = ''
    this.params.endTime = ''
    this.params.userType = 0
  }
}
</script>

<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.name-inp {
  width: 150px;
}
</style>
