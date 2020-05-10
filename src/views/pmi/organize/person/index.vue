<template>
  <el-container class="ke-layout ka-departent">
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <ke-aside
          class="ke-body"
          width="229px"
          title="导航">
          <template>
            <el-scrollbar class="tree-container">
              <el-tree
                ref="tree"
                node-key="id"
                :data="treeData"
                :props="defaultProps"
                highlight-current
                @node-click="handleNodeClick"
              />
            </el-scrollbar>
          </template>
        </ke-aside>
        <el-container class="ke-layout-body">
          <el-header height="auto">
            <el-form
              class="ke-search form-container"
              label-width="80px"
            >
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label="用户名"
                    prop="dictName"
                  >
                    <el-input
                      v-model="params.userName"
                      placeholder=""
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label="登录名"
                    prop="dictName"
                  >
                    <el-input
                      v-model="params.loginName"
                      placeholder=""
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="8"
                  class="buttons"
                >
                  <el-button
                    v-power  
                    code="search"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearch"
                  >
                    查询
                  </el-button>
                  <el-button
                    v-power  
                    code="reset"
                    type="warning"
                    @click="handleReset"
                  >
                    <svg-icon name="reset" />重置
                  </el-button>
                </el-col>
              </el-row>
            </el-form>
            <div class="ke-buttons">
              <el-button 
                v-power  
                code="add"
                @click="handleAdd"
              >
                <svg-icon name="add" />新增
              </el-button>
              <el-button 
                v-power  
                code="edit"
                @click="handleEdit"
              >
                <svg-icon name="edit" />修改
              </el-button>
              <el-button 
                v-power  
                code="del"
                @click="handleDelete"
              >
                <svg-icon name="remove" />删除
              </el-button>
              <el-button 
                v-power  
                code="refresh"
                @click="handleReload"
              >
                <svg-icon name="reset" />刷新
              </el-button>
              <!-- <import-file
                :url="'user/importUser'"
                :is-upload.sync="isUpload"
              />
              <el-button 
                v-power  
                code="exportExcel"
                @click="handleExport"
              >
                <svg-icon name="export" />导出
              </el-button> -->
            </div>
          </el-header>
          <el-main>
            <el-table
              ref="eltableCurrentRow"
              v-loading="listLoading"
              :data="tableData"
              stripe
              height="100%"
              style="width:100%;"
              highlight-current-row
              @row-click="handleClickRow"
              @selection-change="handleSelectionChange"
              @row-dblclick="handleDbclick"
            >
              <el-table-column
                type="index"
                align="center"
              />
              <!-- <el-table-column
                type="selection"
                align="center"
              /> -->
              <el-table-column
                prop="userName"
                label="用户名"
                align="center"
                width="120"
              />
              <el-table-column
                prop="loginName"
                label="登录名"
                align="center"
              />
              <el-table-column
                prop="deptName"
                label="默认部门"
                align="center"
              />
              <el-table-column
                prop="note"
                label="备注"
                width="150"
                show-overflow-tooltip
                align="left"
                header-align="left"
              />
              <!-- class="ka-note"
                prop="note"
                label="备注"
                align="center" -->
              <el-table-column
                align="center"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    v-if="scope.row.lockedStatus === 1"
                    type="primary"
                    size="mini"
                    @click="handleUnlock(2, scope.row)"
                  >
                    解锁
                  </el-button>
                  <el-button
                    v-else
                    type="primary"
                    size="mini"
                    @click="handleUnlock(1, scope.row)"
                  >
                    加锁
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer>
            <el-pagination
              background
              class="ke-page"
              :page-sizes="[10,20,30,50,100]" 
              layout="prev, pager, next,total,jumper, sizes"
              :total="params.total"
              :page-size.sync="params.rows"
              :current-page.sync="params.page"
              @current-change="handlePage"
              @size-change="handleSizeChange"
            />
          </el-footer>
        </el-container>
      </el-container>
      <add-form
        v-if="dialog.visible"
        :id="id"
        :dialog.sync="dialog"
        :selection-item="selectionItem"
        :son-id="sonId"
        :dept-id="deptId"
      />
      <add-details
        v-if="dialogdes.visible"
        :id="id"
        :dialog.sync="dialogdes"
        :selection-item="selectionItem"
        :son-id="sonId"
        :dept-id="deptId"
      />
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
import { UserModule } from '@/store/modules/user'
@Component({
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    AddForm: () => import('./add.vue'),
    AddDetails: () => import('./addDetails.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private ids: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private sonId: number = 0
  private deptId: number = 0
  private tableData: Array<any> = []
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'name'
  }
  // 选中要修改的数据
  private selectionItem: any = {}
  private baseURL: any = sessionStorage.getItem('baseURL')
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private dialogdes: any = {
    title: '',
    visible: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    deptId: 0,
    userName: '',
    loginName: ''
  }
  private isUpload: boolean = false
  created() {
    this.initTableData()
    this.initTreeData()
  }
  @Watch('isUpload')
  private handleUploadChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
      this.initTreeData()
    }
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      // console.log(val)
      this.initTableData()
      this.initTreeData()
    }
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/pmi/department/tree',
      method: 'get',
      params: {}
    }).then((res: any) => {
      // console.log(res)
      this.treeData = res.data
    })
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http.request({
      url: '/pmi/user/page',
      method: 'get',
      params: this.params
    }).then((res: any) => {
      // console.log(res)
      this.listLoading = false
      this.params.total = res.total
      this.tableData = res.rows
    })
  }
  private handleNodeClick(data: any): void {
    // console.log(Number(data.id))
    this.params.deptId = Number(data.id)
    this.deptId = Number(data.id)
    this.initTableData()
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
    if (val.length > 1) {
      this.$refs.eltableCurrentRow.clearSelection()
      this.$refs.eltableCurrentRow.toggleRowSelection(val.pop())
    } 
  }
  private handleDbclick(row: any): void {
    this.dialogdes.title = '详情'
    this.dialogdes.visible = true
    this.sonId = row.id
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.sonId = 0
  }
  private handleEdit() {
    this.$base.grid.row(this.selections).then((row: any) => {
      this.sonId = this.selections[0].id
      this.dialog.title = '修改'
      this.dialog.visible = true
      this.dialog.isAdd = false
    }).catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid.remove(this.selections).then((ids: string) => {
      this.$http
        .request({
          url: `/pmi/user/${ids}`,
          method: 'delete'
        })
        .then((res: any) => {
          this.$base.win.msg('成功', 'success')
          this.initTableData()
        })
    }).catch(() => {})
  }
  private handleReload(): void {
    this.handleReset()
    this.initTableData()
    this.$refs.tree.setCurrentKey(null)
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.userName = ''
    this.params.loginName = ''
    this.params.page = 1
    this.params.deptId = 0
  }
  private handleExport(): void {
    // 导出
    let str = ''
    if (this.selections.length) {
      let ids: Array<any> = []
      this.selections.forEach((el) => {
        ids.push(el.id)
      })
      str = ids.join(',')
      let url = this.baseURL + `user/exportUser?ids=${str}`
      window.open(url, '_blank')
      this.$base.win.msg('导出成功', 'success')
    } else {
      let url =
        this.baseURL +
        `user/exportUser?deptId=${this.params.deptId}&loginName=${this.params.loginName}&userName=${this.params.userName}`
      window.open(url, '_blank')
      this.$base.win.msg('导出成功', 'success')
    }
  }
  private handleUnlock(type: number, item: any): void {
    // 解锁与锁定 锁定状态:1.锁定；2.解锁
    let url = ''
    if ( type === 1 ) {
      url = `/pmi/user/lock/${item.id}`
    } else if (type === 2){
      url = `/pmi/user/unlock/${item.id}`
    }
    this.$http.request({
      url: url,
      method: 'put',
      data: {id: item.id}
    }).then((res: any) => {
      // console.log(res)
      this.initTableData()
      this.$base.win.msg('成功', 'success')
    })
  }
}
</script>

<style scoped>
.tree-container >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}
.ka-departent >>> thead .el-table-column--selection .cell{
    display: none!important;
  }
.ka-departent >>> .el-table .cell{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
</style>
<style lang="scss" scoped>
.ke-layout-body {
  width:calc(100% - 229px)
}
.left-border {
  margin-left: 0;
}
.el-upload {
  margin-right: 10px;
}
.ke-body ,.ka-body {
  flex-direction: column;
  display: flex;
}
.table-container {
  flex: 1;
  overflow: auto;
}
.el-footer {
  height: auto !important;
}
.tree-container {
  height: calc(100% - 22px);
}
.form-container{
  margin-bottom: 0 !important;
}
</style>
