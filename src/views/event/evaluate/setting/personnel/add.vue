<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    :append-to-body="true"
    width="800px"
  >
    <div>
      <el-container>
        <ke-aside
          class="ke-body"
          width="190px"
          title="单位导航"
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
        <el-main class="ke-body">
          <el-form
            class="ke-search"
            label-width="70px"
          >
            <el-row class="ke-search">
              <el-col :span="10">
                <el-form-item
                  label="用户名："
                  prop="userName"
                >
                  <el-input v-model="params.userName" />
                </el-form-item>
              </el-col>
              <el-col
                :span="10"
                class="buttons"
              >
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="handleSearch"
                >
                  查询
                </el-button>
                <el-button @click="handleReload">
                  <svg-icon name="reset" />刷新
                </el-button>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="tableData"
            stripe
            height="321"
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
              width="120"
            />
            <el-table-column
              prop="departments[0].deptName"
              label="默认部门"
              align="center"
            />
          </el-table>
          <el-pagination
            background
            class="ke-page"
            layout="prev, pager, next,total,jumper"
            :total="total"
            @current-change="handlePage"
          />
        </el-main>
      </el-container>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="handelCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          <svg-icon name="save" />添加
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import IDict from '@/interface/dict'
  @Component({
    components: {
      KeAside: () => import('@/components/keAside.vue')
    }
  })
export default class extends Vue {
    @Prop({ type: Array, default: [] }) selectUser !: any
    @Prop({ type: Object, default: {} }) dialog !: any
    public $refs: any = { quickEntry: HTMLFormElement }
    // 表格数据是否正在加载
    private listLoading: boolean = true
    // 点击行数据
    private row: any = {}
    private selections: any = []
    // 获取选择项数据(修改时用)
    private id: number = 0
    private tableData: Array<any> = []
    private treeData: Array<any> = []
    private defaultProps: any= {
      children: 'children',
      label: 'name'
    }
    // 选中要修改的数据
    private selectionItem: any = {}
    private total: number = 0
    private params: any= {
      page: 1,
      rows: this.$base.grid.page,
      loginName: '',
      userName: '',
      deptId: 0
    }
    created() {
      this.initTableData()
      this.initTreeData()
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
      this.$http.request({
        url: '/pmi/user/page',
        method: 'get',
        params: this.params
      }).then((res: any) => {
        // console.log(res)
        this.listLoading = false
        // this.params.total = res.total
        this.tableData = res.rows
      })
    }
    private handleNodeClick(data: any) :void {
      this.params.deptId = Number(data.id)
      this.initTableData()
    }
    private handleClickRow(row: any) {
      this.row = row
      this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
      // console.log(this.selections)
    }
    private handleReload(): void {
      this.$base.common.reset(this)
      this.$refs.tree.setCurrentKey(null)
    }
    private handlePage(currentPage: number): void {
      this.params.page = currentPage
      this.initTableData()
    }
    private handleSearch(): void {
      this.params.page = 1
      this.initTableData()
    }
    private submitForm(): void {
      if (this.selections.length) {
        let row: Array<any> = []
        this.selections.forEach((el: any) => {
          let array: any = {}
          array.defaultDeptName = el.departments[0].deptName
          array.loginName = el.loginName
          array.userId = el.id
          array.userName = el.userName
          row.push(array)
        })
        this.$emit('update:selectUser', row)
        let dialog = {
          title: '',
          visible: false
        }
        this.$emit('update:dialog', dialog)
      } else {
        this.$base.win.msg('请至少选择一项', 'error')
      }
    }
    private handelCancel(): void {
      let dialog = {
        title: '',
        visible: false
      }
      this.$emit('update:dialog', dialog)
    }
}
</script>

<style lang="scss" scoped>
  .el-main{
    height: 420px;
    padding: 0;
  }
  aside{
    margin: 0 10px 0 0;
    border: 1px solid #DCDFE6;
  }

</style>
