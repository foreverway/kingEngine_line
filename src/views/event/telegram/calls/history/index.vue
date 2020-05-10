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
            <el-col :span="6">
              <el-form-item label="主叫电话">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
            >
              <el-form-item label="被叫电话">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
            >
              <el-form-item label="通话时间">
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
              :span="5"
            >
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
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="通话状态">
                <el-select
                  v-model="params.status"
                  placeholder="深圳"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
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
            type="selection"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="主叫电话"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="接听人"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="通话时间"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="通话时长"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="录音"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="通话状态"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="挂断状态"
            align="center"
          />
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
  components: {

  }
})
export default class extends Vue {
  private listLoading: boolean = false
  private total: number = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private selectionItem: any = {}
  private id: number = 0
  private value1: any = ''
  private sonId: number = 0
  private row: any = {}
  private params: any = {
    status: '',
    date: '',
    code: '',
    iemi: '',
    fixDate: '',
    page: 1,
    rows: this.$base.grid.page
  }
  private statusOptions: any = [
    {
      label: '全部',
      value: ''
    },
    {
      label: '已接听',
      value: '已接听'
    },
    {
      label: '未接听',
      value: '未接听'
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
    this.sonId = 0
  }
  private initTableData(): void {}
  private handleShowRecord(): void {

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
      text-align: center;
      width: 80px;
      color: #606266
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
