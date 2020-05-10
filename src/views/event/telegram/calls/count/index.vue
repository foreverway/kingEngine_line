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
            <el-col :span="5">
              <el-form-item label="统计类型">
                <el-select
                  v-model="params.status"
                  placeholder="深圳"
                >
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="统计时间">
                <el-select
                  v-model="params.status"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in yearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="4"
              class="align-row"
            >
              <el-form-item
                label="年第"
                label-width="50px"
              >
                <el-select
                  v-model="params.status"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in monthOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <span>月</span>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="运营商">
                <el-select
                  v-model="params.status"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in operOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
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
            prop="userName"
            label="运营商"
            align="center"
          />
          <el-table-column
            prop="userName"
            label="来电次数"
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
  private addressOptions: any = [
    {
      label: '南山区',
      value: '南山区'
    }
  ]
  private operOptions: any = [
    {
      label: '全部',
      value: ''
    },
    {
      label: '中国移动',
      value: '中国移动'
    },
    {
      label: '中国联通',
      value: '中国联通'
    },
    {
      label: '中国电信',
      value: '中国电信'
    },
    {
      label: '其他',
      value: '其他'
    }
  ]
  private yearOptions: any = [{
    label: '2018',
    value: '2018'
  },{
    label: '2017',
    value: '2017'
  }]
  private monthOptions: any = [
    {
      label: '1',
      value: '1'
    },
    {
      label: '2',
      value: '2'
    },
    {
      label: '3',
      value: '3'
    },
    {
      label: '4',
      value: '4'
    },
    {
      label: '5',
      value: '5'
    },
    {
      label: '6',
      value: '6'
    },
    {
      label: '7',
      value: '7'
    },
    {
      label: '8',
      value: '8'
    },
    {
      label: '9',
      value: '9'
    },
    {
      label: '10',
      value: '10'
    },
    {
      label: '11',
      value: '11'
    },
    {
      label: '12',
      value: '12'
    }
  ]
  private typeOptions: any = [
    {
      label: '月',
      value: '月'
    },
    {
      label: '季',
      value: '季'
    },
    {
      label: '半年',
      value: '半年'
    },
    {
      label: '年',
      value: '年'
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
<style scoped>
.align-row >>> .el-form-item__content{
    display: flex;
    align-items: center;
    
}
.align-row >>> .el-form-item__label{
    padding: 0 10px 0 10px !important;
    text-align: center;
}
</style>
<style lang="scss" scoped>
.align-row span{
    color: #606266;
    margin-left: 10px;
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
