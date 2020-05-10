<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="search"
          class="ke-search"
          label-width="85px"
        >
          <el-row>
            <el-col
              class="form-item"
              :span="5"
            >
              <el-form-item label="监督员">
                <el-select
                  v-model="params.address"
                  placeholder="深圳"
                >
                  <el-option
                    v-for="item in addressOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              class="form-item"
              :span="5"
            >
              <el-form-item label="统计时间">
                <el-time-select
                  v-model="value"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                  placeholder="选择时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="至"
                label-width="40px"
              >
                <el-time-select
                  v-model="value"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30'
                  }"
                  placeholder="选择时间"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
              class="buttons"
              style="width:40.66667%;"
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
              <el-button @click="handleExport">
                <svg-icon name="export" />导出
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
            label="数字化城市管理系统工作情况汇总表（2019-02-27 至 2019-02-27）"
            align="center"
          >
            <el-table-column
              prop="group"
              label="组别"
              align="center"
              fixed
            />
            <el-table-column
              prop="no"
              label="序号"
              align="center"
              fixed
            />
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              fixed
            />
            <el-table-column
              prop="count"
              label="实际工作天数"
              align="center"
            />
            <el-table-column
              prop="km"
              label="累计巡查里程数"
              align="center"
            />
            <el-table-column
              prop="km"
              label="日均里程数"
              align="center"
            />
            <el-table-column
              prop="count2"
              label="累计采集总数"
              align="center"
            />
            <el-table-column
              prop="count2"
              label="累计上报数"
              align="center"
            />
            <el-table-column
              prop="count2"
              label="累计核实数"
              align="center"
            />
            <el-table-column
              prop="count2"
              label="累计核查数"
              align="center"
            />
            <el-table-column
              prop="count2"
              label="累计废件数"
              align="center"
            />
            <el-table-column
              prop="count2"
              label="累计有效采集数"
              align="center"
            />
            <el-table-column
              prop="count2"
              label="日均采集量"
              align="center"
            />
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="auto">
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper"
          :total="total"
          :current-page.sync="params.page"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App',
  components: {
  }
})
export default class extends Vue {
  private listLoading: boolean = false
  private total: number = 0
   private tableData: Array<any> = [{
     group: '组1',
     no: 1,
     name: 'tesat',
     count: '365',
     km: 12,
     count2: 12
   }]
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

</style>
