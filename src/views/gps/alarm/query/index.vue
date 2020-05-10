<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="params"
          class="ke-search"
          label-width="77px"
        >
          <el-row>
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
            <el-col :span="5">
              <el-form-item
                label="监控起始时间"
                prop="dictName"
                label-width="100px"
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
            <el-button @click="handleAddTpey">
              <svg-icon name="add" />新增
            </el-button>
            <el-button @click="handleEdit">
              <svg-icon name="edit" />修改
            </el-button>
            <el-button @click="handleDelete">
              <svg-icon name="remove" />删除
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
            prop="name"
            label="报警名称"
            align="center"
          />
          <el-table-column
            prop="typeStr"
            label="报警类型"
            align="center"
          />
          <el-table-column
            label="包含车辆"
            prop="num"
            align="center"
          />
          <el-table-column
            prop="speed"
            label="界线名称/超速时速"
            align="center"
          />
          <el-table-column
            prop="startDate"
            label="监控开始时间"
            align="center"
          />
          <el-table-column
            prop="endDate"
            label="监控结束时间"
            align="center"
          />
          <el-table-column
            prop="startTimer"
            label="上班时间"
            align="center"
          />
          <el-table-column
            prop="endTimer"
            label="下班时间"
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
    <add-type
      v-if="typeDialog.visible"
      :id="id"
      :type-dialog.sync="typeDialog"
      :selection-item="selectionItem"
    />
    <vehicle-view
      v-if="viewDialog.visible"
      :id="id"
      :view-dialog.sync="viewDialog"
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
    AddType: () => import('./addType.vue'),
    VehicleView: () => import('./vehicleView.vue')
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
  private typeDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private viewDialog: any = {
    title: '',
    visible: false
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
  @Watch('typeDialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/pmi/callPolice/setUpList',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        if (res.rows && res.rows.length > 0){
          this.total = res.total
          this.tableData = this.getUserType(res.rows)
        } else {
          this.tableData = []
        }
      })
      .finally(() => {
        this.listLoading = false
      })
  }
  private getUserType(data:any){
    data.forEach((item: any) => {
      if (item.type === '1'){
        item.typeStr = '超速报警'
      } else if (item.type === '2'){
        item.typeStr = '越界报警'
      }
    })
    return data
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private viewVehicle(index: number , row: any ): void {
    this.viewDialog.title = '包含车辆'
    this.viewDialog.visible = true
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleAddTpey(): void {
    this.typeDialog.title = '新增'
    this.typeDialog.visible = true
    this.typeDialog.isAdd = false
    this.selectionItem = {
      areaId: 1,
      roleName: 'dsfd',
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
        this.typeDialog.title = '修改'
        this.typeDialog.visible = true
        this.typeDialog.isAdd = false
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
  .ka-aJump{
    text-decoration: underline;
    color: blue;
    cursor: default;
  }
</style>
