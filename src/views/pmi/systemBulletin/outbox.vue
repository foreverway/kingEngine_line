<template>
  <el-dialog
    v-dialog-drag
    :title="outboxDialog.title"
    :visible.sync="outboxDialog.visible"
    :modal-append-to-body="false"
    width="1100px"
    :close-on-click-modal="false"
  >
    <el-container class="ka-outbox">
      <el-header height="auto">
        <el-form
          :model="params"
          class="ke-search"
          label-width="77px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item
                label="标题"
                prop="xx"
              >
                <el-input
                  v-model="params.cc"
                  placeholder="请输入标题"
                  class="el-input-rank"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="发送时间">
                <el-date-picker
                  v-model="params.startTime"
                  type="datetime"
                  placeholder="请选择日期时间"
                  :picker-options="beginTimeOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="至"
                class="ke-center"
                label-width="40px"
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
              :span="5"
              class="buttons"
            >
              <el-button
                class="button"
                type="primary"
                icon="el-icon-search"
              >
                查询
              </el-button>
              <el-button
                class="button"
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
          <el-table-column
            type="selection"
            align="center"
          />
          <el-table-column
            prop="title"
            label="标题"
            align="center"
          />
          <el-table-column
            prop="enclosure"
            label="附件"
            align="center"
          />
          <el-table-column
            prop="creatTimer"
            label="发布时间"
            align="center"
          />
          <el-table-column
            prop="company"
            label="发布单位"
            align="center"
          />
          <el-table-column
            prop="publisher"
            label="发布人"
            align="center"
          />
          <el-table-column
            prop="state"
            label="状态"
            align="center"
          />
        </el-table>
      </el-main>
      <el-footer height="auto">
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper"
          :total="params.total"
          :current-page.sync="params.page"
          :page-size.sync="params.rows"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: ''
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) outboxDialog !: any
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private tableData: Array<any> = []
  private input: string = ''
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    name: '',
    endTime: null,
    startTime: null,
    total: 0
  }
  // 选中要修改的数据
  private selectionItem: any = {}
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  created() {
    this.initTableData()
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/pmi/inbox/list',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.params.total = res.total
        this.tableData = res.rows
      })
      .finally(() => {
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
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleReset(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.selectionItem = {
      areaId: '',
      roleName: '',
      roleCode: '',
      orderNo: 0,
      dbStatus: '',
      note: '',
      createTime: '',
      createUserId: '',
      privileges: [],
      users: []
    }
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.selectionItem = this.selections[0]
        this.dialog.title = '修改'
        this.dialog.visible = true
        this.dialog.isAdd = false
      })
      .catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: '/role/deleteRole',
            method: 'post',
            data: {
              ids: ids
            }
          })
          .then((res: any) => {
            this.$base.win.msg('成功', 'success')
            this.initTableData()
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
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
  .ka-outbox{
    .el-main{
      height: 400px;
    }
  }
</style>
<style lang="scss" scoped>
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  .el-input,.el-select,.el-cascader{
    width: 100%;
  }
  // .el-input-rank{
  //   width: 170px;
  // }
  .no-margin{
    margin-bottom: 0px;
  }
</style>
