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
                label="车辆"
                prop="dictName"
              >
                <el-input
                  v-model="params.cc"
                  class="el-input-rank"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="投保类型"
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
                label="投保时间"
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
            <el-button @click="handleAdd">
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
            prop="vehicle"
            label="车辆"
            align="center"
          />
          <el-table-column
            prop="department"
            label="所属部门"
            align="center"
          />
          <el-table-column
            prop="timer"
            label="投保时间"
            align="center"
          />
          <el-table-column
            prop="type"
            label="投保类型"
            align="center"
          />
          <el-table-column
            prop="cost"
            label="保费(元)"
            align="center"
          />
          <el-table-column
            prop="startTimer"
            label="起始时间"
            align="center"
          />
          <el-table-column
            prop="endTimer"
            label="截至时间"
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
    <add-form
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
    AddForm: () => import('./add.vue')
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
        url: '/gps/business/insurance',
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
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
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

<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.name-inp {
  width: 150px;
}
</style>
