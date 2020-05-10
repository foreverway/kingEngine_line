<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <el-form
            :model="search"
            class="ke-search"
            label-width="80px"
          >
            <el-row>
              <el-col :span="6">
                <el-form-item
                  label="部门名称"
                >
                  <el-input
                    v-model="params.deptName"
                    class="dep-inp"
                    clearable
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
        </el-header>
        <el-main>
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            :default-checked-keys="checkedKeys"
            :default-expanded-keys="checkedKeys"
            show-checkbox
            @check-change="handleCheck"
          />
          <el-button
            type="primary"
            class="save"
          >
            保存
          </el-button>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'Department',
  components: {
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
  private total: number = 0
  private treeData: Array<any> = [
    {
      text: 'suwsh',
      children: [
        {
          text: 'ijdieji'
        }
      ]
    },
    {
      text: 'suwsh',
      children: [
        {
          text: 'ijdieji'
        }
      ]
    },
    {
      text: 'suwsh',
      children: [
        {
          text: 'ijdieji'
        }
      ]
    }
  ]
  private defaultProps: any= {
    children: 'children',
    label: 'text'
  }
  // 默认选中的
  private checkedKeys: Array<any> = []
  public $refs: any = { quickEntry: HTMLFormElement }
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    name: ''
  }
  private isUpload: boolean = false
  created() {
    // this.initTableData()
    // this.initTreeData()
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/dept/getDepartTreeData',
      method: 'post',
      data: {}
    }).then((res: any) => {
      // console.log(res)
      this.treeData = res.data
    })
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/role/findRolesByPage',
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
  private handleCheck(data: any) {
    // console.log(data)
    let arr = this.$refs.tree.getCheckedNodes()
    // console.log(arr)
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
.save{
  margin-top: 20px;
  padding: 10px 40px !important
}
</style>
