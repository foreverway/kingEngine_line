<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="search"
          class="ke-search"
          label-width="85px"
        >
          <el-row class="search-container">
            <el-col
              class="form-item"
              :span="6"
            >
              <el-form-item label="当前时间">
                <el-date-picker
                  v-model="value1"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col
              class="buttons"
              style="width:40.66667%;"
              :span="8"
            >
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
              >
                查询
              </el-button>
              <el-button @click="handleExport">
                <svg-icon name="export" />导出
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <el-main class="ke-body">
        <!-- <table border="1">
          <tr>
            <td class="table-title">
              案件监督员考核情况表
            </td>
          </tr>
          <tr>
            <td>采集指标完成情况</td>
            <td />
          </tr>
        </table> -->
        <div class="table-container">
          <div class="table-header">
            案件监督员考核情况表
          </div>
          <div class="table-row">
            <div class="table-label">
              采集指标完成情况
            </div>
            <div class="table-content" />
          </div>
          <div class="table-row">
            <div class="table-label">
              巡查里程完成情况
            </div>
            <div class="table-content" />
          </div>
          <div class="table-row">
            <div class="table-label">
              考勤情况
            </div>
            <div class="table-content" />
          </div>
          <div class="table-row">
            <div class="table-label">
              巡查路线覆盖情况
            </div>
            <div class="table-content" />
          </div>
          <div class="table-row">
            <div class="table-label">
              巡查轨迹异常情况
            </div>
            <div class="table-content" />
          </div>
          <div class="table-row">
            <div class="table-label">
              其他
            </div>
            <div class="table-content" />
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App',
  components: {}
})
export default class extends Vue {
  private listLoading: boolean = false
  private total: number = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private selectionItem: any = {}
  private id: number = 0
  private sonId: number = 0
  private row: any = {}
  private dialog: any = {
    title: '',
    visible: true,
    isAdd: false
  }
  private recordDialog: any = {
    title: '',
    visible: false
  }
  private params: any = {
    status: '',
    date: '',
    code: '',
    iemi: '',
    fixDate: '',
    page: 1,
    rows: this.$base.grid.page
  }
  private addressOptions: any = [
    {
      label: '南山区',
      value: '南山区'
    }
  ]
  private typeOptions: any = [
    {
      label: '一级',
      value: '一级'
    }
  ]
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.type = ''
    this.params.id = ''
    this.params.code = ''
    this.params.name = ''
    this.params.address = ''
    // this.initTableData()
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.sonId = 0
  }
  private initTableData(): void {}
  private handleShowRecord(): void {
    this.recordDialog.visible = true
  }
  private handleRework(): void {}
  private handleReload(): void {
    this.params.type = ''
    this.params.id = ''
    this.params.code = ''
    this.params.name = ''
    this.params.address = ''
    this.params.page = 1
    this.initTableData()
  }
  private handlePage(): void {}
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleEdit(): void {}
  private handleExport(): void {}
  private handleDelete(): void {}
}
</script>
<style lang="scss" scoped>
.table-header {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #ccc;
  color: #606266;
}
.table-row {
  display: flex;
  flex-flow: row;
  .table-label {
    width: 20%;
    height: 80px;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    border-right:  1px solid #ccc;
    border-bottom:  1px solid #ccc;
    border-left: 1px solid #ccc;
    // border: 1px solid black;
    color: #606266;
  }
  .table-content {
    width: 80%;
    height: 80px;
    display: flex;
    flex-flow: row;
    align-items: center;
    border-right:  1px solid #ccc;
    border-bottom:  1px solid #ccc;
    // border: 1px solid black;
  }
}
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
