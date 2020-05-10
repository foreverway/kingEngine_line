<template>
  <el-container class="ke-layout add-personnel2">
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <ke-aside
          width="210px"
          title="导航"
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
                <el-col :span="18">
                  <el-form-item label="用户名">
                    <el-input
                      v-model="params.userName"
                      clearable
                    />
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
              @select="handleSelect"
              @select-all="handleSelectAll"
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
                label="默认部门"
                align="center"
              />
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
        <Ke-asideright
          class="ke-body"
          width="200px"
          title="已选择人员"
          :is-dialog="true"
        >
          <template>
            <el-scrollbar class="tree-container">
              <ul class="list">
                <li
                  v-for="(item, i) in selectedUsers"
                  :key="i"
                >
                  <p>
                    {{ item.name }}
                  </p>
                  <i
                    class="el-icon-delete"
                    @click="handleDelete(item)"
                  />
                </li>
              </ul>
            </el-scrollbar>
          </template>
        </Ke-asideright>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import IDict from '@/interface/dict'

@Component({
  name: 'person',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    KeAsideright: () => import('@/components/keAsideRight.vue')
  }
})
export default class extends Vue {
  @Prop() private dialog:any
  @Prop({ type: Array, default: {} }) user!: any
  // 已选择人员数据
  private selectedUsers: any = this.$base.common.extend(this.user)
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
    label: 'name'
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    deptId: 0,
    userName: ''
  }
  created() {
    this.initTableData()
    this.initTreeData()
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/pmi/department/tree',
        method: 'get',
        params: {}
      })
      .then((res: any) => {
        this.treeData = res.data
      })
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/pmi/user/page',
        method: 'get',
        params: this.params
      })
      .then((res: any) => {
        this.listLoading = false
        this.params.total = res.total
        this.tableData = res.rows
        this.toggleSelection()
      })
  }
  private toggleSelection() {
    this.$nextTick(() => {
      let data = this.chooseData()
      data.forEach((item: any) => {
        this.$refs.eltableCurrentRow.toggleRowSelection(item, true)
      })
      let data1 = this.unChooseData()
      data1.forEach((item: any) => {
        this.$refs.eltableCurrentRow.toggleRowSelection(item, false)
      })
    })
  }
  private chooseData() { // 当前表格已选中数据
    let data: any = []
    this.tableData.forEach((el: any) => {
      this.selectedUsers.forEach((els: any) => {
        if (el.id === els.id) {
          data.push(el)
        }
      })
    })
    return data
  }
  private unChooseData() { // 当前表格未选中数据
    let c: any = []
    this.tableData.forEach((el: any, i: number) => {
      let isEquals:boolean = false
      this.selectedUsers.forEach((els: any) => {
        if (el.id === els.id) {
          isEquals = true
          return false
        }
      })
      if (!isEquals) {
        c.push(el)
      }
    })
    return c
  }
  private handleNodeClick(data: any): void {
    this.params.userName = ''
    this.params.deptId = Number(data.id)
    this.initTableData()
  }
  private handleClickRow(row: any) { // 点击行
    this.row = row
    this.handleSelectCheckbox(row)
    this.toggleSelection()
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleSelect(selection: any, row: any): void { // 点击复选框
    this.handleSelectCheckbox(row)
  }
  private handleSelectAll(selection: any): void { // 点击全选按钮
    if (selection.length) { // 全选
      let ids: any = []
      this.selectedUsers.forEach((item: any, i: number) => {
        ids.push(item.id)
      })
      selection.forEach((el,i) => {
        el.name = el.userName
        if (ids.indexOf(el.id) === -1) {
          this.selectedUsers.push(el)
        }
      })
    } else { // 反选 清空列表中已选择数据
      let c: any = []
      this.selectedUsers.forEach((el: any, i: number) => {
        let isEquals:boolean = false
        this.tableData.forEach((els: any) => {
          if (el.id === els.id) {
            isEquals = true
            return false
          }
        })
        if (!isEquals) {
          c.push(el)
        }
      })
      this.selectedUsers = c
    }
  }
  private handleSelectCheckbox(row): void {
    row.name = row.userName
    let index = -1
    this.selectedUsers.forEach((item: any, i: number) => {
      if (item.id === row.id) {
        index = i
      }
    })
    if (index === -1) {
      this.selectedUsers.push(row)
    } else {
      this.selectedUsers.splice(index, 1)
    }
  }
  private handleDelete(item): void { // 删除已选中人员
    let index: number = -1
    this.selectedUsers.forEach((el: any, i: number) => {
      if (el.id === item.id) {
        index = i
      }
    })
    this.selectedUsers.splice(index, 1)
    this.toggleSelection()
  }
  private handleReload(): void {
    this.initTableData()
    this.$refs.tree.setCurrentKey(null)
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.deptId = 0
    this.params.page = 1
    this.initTableData()
  }
  private form1(): any {
    let str = this.selections.map(function(list,index) {
      return {
        name: list.userName,
        id: list.id,
        type: 'user'
      }
    })
    this.$emit('update:user', str)
  }
  // @Watch('user')
  // private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
  //   console.log(this.selectedUsers)
  //   debugger
  //   this.selectedUsers = val
  // }
}
</script>
<style scoped>
  .tree-container >>> .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .add-personnel1 .el-tabs__content{
    overflow-y: hidden;
  }
</style>
<style lang="scss" scoped>
.el-main{
  max-height: 450px;
}
.ke-layout{
  height:440px;
}
.list{
  li{
    border-radius: 4px;
    background: #f60;
    padding: 7px;
    color: #fff;
    margin-bottom: 6px;
    display: flex;
    align-items : center;
    p{
      flex: 1;
    }
    i{
      width: 20px;
      color: #fff !important;
      font-size: 14px;
      text-align: right;
      // display: none;
      cursor: pointer;
    }
  }
}
</style>
