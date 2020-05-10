<template>
  <el-container class="ke-layout">
    <el-container>
      <el-main class="add-personnel">
        <el-header height="auto">
          <el-form
            :model="params"
            class="ke-search"
            label-width="77px"
          >
            <el-row>
              <el-col :span="10">
                <el-form-item
                  label="角色名称"
                  prop="roleName"
                >
                  <el-input
                    v-model="params.roleName"
                    class="el-input-rank"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
                class="buttons"
              >
                <el-button
                  class="button"
                  type="primary"
                  icon="el-icon-search"
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
              prop="roleName"
              label="角色名称"
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
            layout="prev, pager, next,total,jumper"
            :total="params.total"
            :current-page.sync="params.page"
            :page-size.sync="params.rows"
            @current-change="handlePage"
          />
        </el-footer>
      </el-main>
      <Ke-asideright
        class="ke-body"
        width="200px"
        title="已选择角色"
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
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: '',
  components: {
    KeAsideright: () => import('@/components/keAsideRight.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: {} }) role!: any
  // 已选择角色
  private selectedUsers: any = this.$base.common.extend(this.role)
  public $refs: any = { quickEntry: HTMLFormElement }
  private selections: Array<any> = []
  private listLoading: boolean = true
  private tableData: Array<any> = []
  // 点击行数据
  private row: any = {}
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    roleName: '',
    total: 0
  }
  // 获取选择项数据id(修改时用)
  private id: number = 0
  // 选中要修改的数据
  private selectionItem: any = {}
  created() {
    this.initTableData()
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/pmi/role/page',
        method: 'get',
        params: this.params
      })
      .then((res: any) => {
        this.params.total = res.total
        this.tableData = res.rows
        this.toggleSelection()
      })
      .finally(() => {
        this.listLoading = false
      })
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleClickRow(row: any) { // 点击行
    this.row = row
    this.handleSelectCheckbox(row)
    this.toggleSelection()
  }
  private handleSelectCheckbox(row): void {
    row.name = row.roleName
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
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private form3(): any {
    let arr = this.selections.map(function(list,index) {
      return {
        name: list.roleName,
        id: list.id,
        type: 'role'
      }
    })
    this.$emit('update:role', arr)
  }
}
</script>
<style lang="scss">
  .add-personnel {
    .el-table__body-wrapper{
      height: 300px;
    }
  }
</style>
<style lang="scss" scoped>
  .el-main{
    padding: 0px;
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
