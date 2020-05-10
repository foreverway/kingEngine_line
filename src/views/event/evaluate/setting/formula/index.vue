<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
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
            <div class="ke-float-right ke-search-right">
              <label>统计表格</label>
              <ke-dict code="cccc" />
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
              >
                查询
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
              prop="roleName"
              label="计算指标"
              align="center"
            />
            <el-table-column
              prop="roleCode"
              label="创建时间"
              align="center"
            />
            <el-table-column
              prop="roleCode"
              label="创建人员"
              align="center"
            />
            <el-table-column
              prop="note"
              label="备注"
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
  name: 'Formula',
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
  // 弹窗新增或者删除
  private type: string = ''
  // 选中要修改的数据
  private selectionItem: any = {}
  private total: number = 0
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private date: string = ''
  private classes: string = ''
  private classesOptions: Array<any> = [
    {
      value: 1,
      label: '全部'
    },
    {
      value: 2,
      label: '无'
    },
    {
      value: 3,
      label: '硬件故障'
    },
    {
      value: 4,
      label: '软件故障'
    },
    {
      value: 5,
      label: '其他故障'
    }
  ]
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    name: ''
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
      this.total = res.total
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
