<template>
  <el-dialog
    :append-to-body="true"
    :title="dialog.title"
    width="1050px"
    :visible.sync="dialog.visible"
  >
    <el-container class="ke-layout">
      <el-main class="ke-layout-main">
        <el-container class="ke-layout-container">
          <ke-aside
            width="210px"
            title="部门导航"
            class="ke-body"
            :is-dialog="true"
          >
            <template>
              <el-tree
                ref="tree"
                node-key="id"
                :data="treeData"
                :props="defaultProps"
                highlight-current
                @node-click="handleNodeClick"
              />
            </template>
          </ke-aside>
          <el-container class="ke-layout-body ke-dialog-el-main">
            <el-header height="auto">
              <el-form
                class="ke-search"
                label-width="80px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      label="登录名"
                      class="label"
                    >
                      <el-input v-model="params.xxx" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="真实姓名">
                      <el-input v-model="params.ccc" />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="6"
                    class="buttons"
                  >
                    <el-button
                      type="primary"
                      @click="handleSearch"
                    >
                      查询
                    </el-button>
                    <el-button
                      type="warning"
                      @click="handleReset"
                    >
                      重置
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
                  width="110"
                />
                <el-table-column
                  prop="loginName"
                  label="登录名"
                  align="center"
                  width="140"
                />
                <el-table-column
                  prop="deptName"
                  label="默认部门"
                  align="center"
                />
                <el-table-column
                  v-if="dialog.isRows!==true"
                  prop="id"
                  label="选择"
                  width="80"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      plain
                      size="small"
                      @click="handleSelect(scope.row)"
                    >
                      选择
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-main>
            <el-footer height="auto">
              <el-pagination
                class="ke-page"
                layout="prev, pager, next,total,jumper"
                :total="params.total"
                :page-size.sync="params.rows"
                :current-page.sync="params.page"
                @current-change="handlePage"
              />
            </el-footer>
          </el-container>
        </el-container>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  name: 'person',
  components: {
    KeAside: () => import('@/components/keAside.vue')
  }
})
export default class extends Vue {
  @Prop() private dialog:any
  public $refs: any = { quickEntry: HTMLFormElement }
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private tableData: Array<any> = []
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'text'
  }
  // 选中要修改的数据
  private selectionItem: any = {}
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    deptId: 0,
    userName: '',
    loginName: ''
  }
  created() {
    this.initTableData()
    this.initTreeData()
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/dept/getDepartTreeData',
        method: 'post',
        data: {}
      })
      .then((res: any) => {
        this.treeData = res.data
      })
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/user/queryUserByCondition',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.listLoading = false
        this.params.total = res.total
        this.tableData = res.rows
      })
  }
  private handleNodeClick(data: any): void {
    this.params.deptId = Number(data.id)
    this.initTableData()
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
    this.$refs.tree.setCurrentKey(null)
  }
  
  private handleReset(): void {
    this.params.userName = ''
    this.params.loginName = ''
    this.params.page = 1
    this.params.total = 0
    this.params.deptId = 0
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleSelect(item:any){
    this.$emit('setData',item) 
    this.$emit('update:dialog', {
      visible: false
    })
  }
}
</script>
<style scoped>
.tree-container >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
<style lang="scss" scoped>
.ke-layout{
  height:500px;
}
</style>
