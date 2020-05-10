<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="params"
          class="ke-search"
          label-width="90px"
        >
          <el-row>
            <el-col :span="5">
              <el-form-item
                label="车辆"
                prop="dictName"
              >
                <el-select v-model="tableData.maintenanceMode">
                  <el-option 
                    label="全部" 
                    value="0"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="统计时间"
                prop="dictName"
              >
                <el-date-picker
                  v-model="tableData.value1"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="至"
                prop="dictName"
                label-width="26px"
                class="ka-label-center"
              >
                <el-date-picker
                  v-model="tableData.value2"
                  type="date"
                  placeholder="选择日期"
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
        <div class="ke-clear">
          <div class="ke-buttons ke-float-left">
            <el-button>
              <svg-icon name="export" />导出
            </el-button>
            <el-button @click="handleReload">
              <svg-icon name="reset" />刷新
            </el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          height="100%"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            align="center"
          />
          <el-table-column
            prop="vehicle"
            label="车牌"
            align="center"
          />
          <el-table-column
            prop="department"
            label="所属部门"
            align="center"
          />
          <el-table-column
            prop="type"
            label="车辆类型"
            align="center"
          />
          <el-table-column
            prop="online"
            label="是否在线"
            align="center"
          />
          <el-table-column
            prop="code"
            label="车辆编号"
            align="center"
          />
          <el-table-column
            prop="mileage"
            label="行驶里程(km)"
            align="center"
          />
          <el-table-column
            prop="endTimer"
            label="行驶时间"
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
          :page-size.sync="params.rows"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: '',
  components: {}
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
  // 弹窗新增或者删除
  private type: string = ''
  // 选中要修改的数据
  private selectionItem: any = {}
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private collectDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private total: number = 0
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    name: ''
  }
  private isUpload: boolean = false
  created() {
    this.initTableData()
    let reg = /^[0-9a-zA-Z]+$/
    let str = 'hhhhh556缉私局6'
    console.log(reg.test(str))
    console.log('test')
  }
  @Watch('isUpload')
  private handleUploadChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/gps/business/statistics',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.total = res.total
        this.tableData = res.rows
      })
      .finally(() => {
        this.listLoading = false
      })
  }
  private handleReload(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
  }
}
</script>
<style lang="scss">
  .ka-label-center{
    .el-form-item__label{
      padding:0px;
      text-align: center;
    }
  }
</style>
<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.name-inp {
  width: 150px;
}
</style>
