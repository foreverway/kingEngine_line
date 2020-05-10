<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header 
        height="auto" 
        class="ka-text-align-left"
      >
        <el-form
          :model="params"
          class="ke-search"
          label-width="77px"
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
                label="报警类型"
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
                label="时间"
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
                label-width="24px"
                class="ka-label-center"
              >
                <el-date-picker
                  v-model="tableData.value2"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <el-form-item
                label="报警名称"
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
            <el-col
              :span="4"
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
          @row-dblclick="openDetail"
          @selection-change="handleSelectionChange"
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
            prop="driver"
            label="司机"
            align="center"
          />
          <el-table-column
            prop="tel"
            label="联系电话"
            align="center"
          />
          <el-table-column
            prop="roleCode"
            label="报警名称"
            align="center"
          />
          <el-table-column
            prop="alarmType"
            label="报警类型"
            align="center"
          />
          <el-table-column
            prop="startTimer"
            label="报警时间"
            align="center"
            width="200px"
          />
          <el-table-column
            prop="adress"
            label="报警地点"
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
    <details-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: '',
  components: {
    detailsForm: () => import('./details.vue')
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
        url: '/pmi/callPolice/recordList',
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
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
    // this.openDetails()
  }
  private openDetail(row: any) {
    this.row = row
    this.openDetails()
  }
  
  private openDetails(): void {
    this.selectionItem = this.row
    this.dialog.title = '详情'
    this.dialog.visible = true
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
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
  .ka-text-align-left{
    .ka-label-center{
      .el-form-item__label{
        text-align: center;
        padding: 0px;
      }
    }
  }
</style>
<style lang="scss" scoped>
.ke-search .el-row{
  max-width: 1260px; 
}
.left-border {
  margin-left: 0;
}
.name-inp {
  width: 150px;
}
</style>
