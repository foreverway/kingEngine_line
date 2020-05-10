<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    :append-to-body="true"
    width="760px"
    :close-on-click-modal="false"
  >
    <el-container>
      <ke-aside
        class="ke-body"
        width="190px"
        title="导航"
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
      <el-main>
        <el-row class="ke-search">
          <el-col
            :span="4"
            class="label"
          >
            用户名
          </el-col>
          <el-col :span="8">
            <el-input 
              v-model="params.userName" 
              clearable
            />
          </el-col>
          <el-col
            :span="11"
            class="buttons"
          >
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >
              查询
            </el-button>
          </el-col>
        </el-row>
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          height="281"
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
            prop="deptName"
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
    <div class="opeate-buttons">
      <el-button @click="handleCancel">
        <svg-icon name="hamburger" />取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="hamburger" />保存
      </el-button>
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
    @Prop({ type: Array, default: {} }) selectUsers !: any
    @Prop({ type: Boolean, default: false }) visible !: boolean
    @Prop({ type: Object, default: {} }) dialog !: any
    // 表格数据是否正在加载
    private listLoading: boolean = true
    // 点击行数据
    private row: any = {}
    private selections: Array<any> = []
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
      userName: '',
      deptId: 0
    }
    created() {
      this.initTableData()
      this.initTreeData()
    }
    private initTableData(): void {
      this.$http.request({
        url: '/pmi/user/page',
        method: 'get',
        params: this.params
      }).then((res: any) => {
        this.listLoading = false
        this.total = res.total
        this.tableData = res.rows
      })
    }
    private initTreeData(): void {
      this.$http
        .request({
          url: '/pmi/department/tree',
          method: 'get',
          params: {}
        })
        .then((res: any) => {
          // console.log(res)
          this.treeData = res.data
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
    }
    private handlePage(currentPage: number): void {
      // console.log('11')
      // this.params.userName = ''
      this.params.page = currentPage
      this.initTableData()
    }
    private handleSearch(): void {
      this.params.deptId = 0
      this.params.page = 1
      this.initTableData()
    }
    private handleSave(): void {
      // console.log(this.selections)
      this.$emit('update:selectUsers', this.selections)
      let dialog = {
        title: '',
        visible: false
      }
      this.$emit('update:dialog', dialog)
    }
    private handleCancel(): void {
      let dialog = {
        title: '',
        visible: false
      }
      this.$emit('update:dialog', dialog)
    }
}
</script>

<style lang="scss" scoped>
  .left-border {
    margin-left: 0
  }
  .preview{
    color: #ff4949;
    cursor: pointer;
    margin-right: 2px;
  }
  .download{
    color: #1890ff;
    cursor: pointer;
  }
  .opeate-buttons{
    text-align: right;
    margin-top: 20px;
  }
  .el-main{
    height: 380px;
    padding: 0;
    margin-left: 10px;
  }
  aside{
    margin: 0;
    border: 1px solid #DCDFE6
  }

</style>
