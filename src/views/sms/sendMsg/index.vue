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
                <el-form-item label="接收人员">
                  <el-input
                    v-model="date"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="发送时间"
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
                <el-form-item label="发送状态">
                  <ke-dict code="cccc" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="发送人员">
                  <el-input
                    v-model="date"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="9"
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
                  type="warning"
                >
                  <svg-icon name="reset" />重置
                </el-button>
              </el-col>
            </el-row>
          </el-form>
          <div class="ke-buttons">
            <el-button @click="handleAdd">
              <svg-icon name="add" />新增
            </el-button>
            <el-button @click="handleEdit">
              <svg-icon name="edit" />修改
            </el-button>
            <el-button @click="handleDelete">
              <svg-icon name="remove" />删除
            </el-button>
            <el-button @click="handleDelete">
              <svg-icon name="export" />发送
            </el-button>
            <el-button @click="handleReload">
              <svg-icon name="reset" />刷新
            </el-button>
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
              prop="roleName"
              label="短信类型"
              align="center"
            />
            <el-table-column
              prop="roleCode"
              label="发送人员"
              align="center"
            />
            <el-table-column
              prop="roleCode"
              label="接收人员"
              align="center"
            />
            <el-table-column
              prop="note"
              label="接收号码"
              align="center"
            />
            <el-table-column
              prop="note"
              label="发送状态"
              align="center"
            />
            <el-table-column
              prop="note"
              label="发送时间"
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
          />
        </el-footer>
      </el-container>
    </el-main>
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
  name: 'SendMsg',
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
  // private tableData: Array<any> = []
  private tableData: Array<any> = [
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    },
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    },
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    },
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    },
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    }
  ]
  private date: string = ''
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
    name: '',
    startTime: '',
    endTime: ''
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
    // this.initTableData()
    this.listLoading = false
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http.request({
      url: '/role/findRolesByPage',
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
    this.handleReset()
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
  }
  private handleDetails(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.selectionItem = this.selections[0]
        this.dialog.title = '详情'
        this.dialog.visible = true
        this.dialog.isAdd = false
      })
      .catch(() => {})
  }
  private handleAdd(): void {
    // console.log('新增')
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.selectionItem = {
      professional: [],
      supervisor: [],
      department: [],
      note: '',
      professionals: '',
      supervisors: '',
      departments: ''
    }
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        // this.id = row.id
        // console.log(this.selections)
        this.selectionItem = this.selections[0]
        this.dialog.title = '修改'
        this.dialog.isAdd = false
        this.dialog.visible = true
      })
      .catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: '/dept/deleteDepartment',
            method: 'post',
            data: {
              ids: ids
            }
          })
          .then((res: any) => {
            // console.log(res)
            this.$base.win.msg('成功', 'success')
            this.initTableData()
          })
      })
      .catch(() => {})
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
