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
                <el-form-item
                  label="用户名"
                  class="ke-center"
                >
                  <el-input
                    v-model="params.userName"
                    class="dep-inp"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="人员类型"
                >
                  <ke-dict
                    v-model="params.userType"
                    code="cccc"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="9"
                class="buttons"
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
              </el-col>
            </el-row>
          </el-form>
          
          <div class="ke-buttons">
            <el-button @click="handleAdd">
              <svg-icon name="add" />新增
            </el-button>
            <el-button @click="handleSave">
              <svg-icon name="save" />保存
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
              prop="userName"
              label="用户名"
              align="center"
            />
            <el-table-column
              prop="loginName"
              label="登录名"
              align="center"
            />
            <el-table-column
              prop="defaultDeptName"
              label="默认部门"
              align="center"
            />
            <el-table-column
              prop="roleName"
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click.stop="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column> 
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
      :dialog.sync="dialog"
      :select-user.sync="selectUser"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'Personnel',
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
  // 原始ids
  private originalIds: Array<any> = []
  // 弹窗新增或者删除
  private type: string = ''
  // 选中要修改的数据
  private selectionItem: any = {}
  // 添加用户弹窗选中的用户信息
  private selectUser: Array<any> = []
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    userName: '',
    userType: ''
  }
  created() {
    this.initTableData()
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  @Watch('selectUser')
  private handleUserChanged(val: any, oldVal: any): void {
    if (val !== oldVal) {
      this.tableData = this.tableData.concat(val)
      let hash: any = {}
      this.tableData = this.tableData.reduce((item, next) => {
        // eslint-disable-next-line no-unused-expressions
        hash[next.userId] ? '' : hash[next.userId] = true && item.push(next)
        return item
      }, [])
    }
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http.request({
      url: '/eva/evaSet/findOperatorTakePartData',
      method: 'post',
      data: this.params
    }).then((res: any) => {
      this.params.total = res.total
      this.tableData = res.rows
      this.originalIds = []
      this.tableData.forEach((el: any) => {
        this.originalIds.push(el.userId)
      })
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
    this.dialog.title = '新增人员'
    this.dialog.visible = true
    this.dialog.isAdd = false
  }
  private handleDelete(row): void {
    this.tableData.forEach((el: any, index: number) => {
      if (row.userId === el.userId) {
        this.tableData.splice(index, 1)
      }
    })
  }
  private handleSave(): void {
    let ids: Array<any> = []
    this.tableData.forEach((el: any) => {
      ids.push(el.userId)
    })
    let addIds: Array<any> = [] // 增加的ids
    let deleteIds: Array<any> = [] // 删除的ids
    this.originalIds.forEach((el:any) => {
      if (ids.indexOf(el) === -1) {
        deleteIds.push(el)
      }
    })
    ids.forEach((el:any) => {
      if (this.originalIds.indexOf(el) === -1) {
        addIds.push(el)
      }
    })
    this.$http.request({
      url: '/eva/evaSet/setOperatorOrDeptTakePart',
      method: 'post',
      data: {
        evaluateType: 1,
        evaluateIds: addIds.join(',') || '',
        cancelIds: deleteIds.join(',') || ''
      }
    }).then((res: any) => {
      this.$base.win.msg('成功', 'success')
      this.initTableData()
    }).finally(() => {
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

<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.name-inp {
  width: 150px;
}
</style>
