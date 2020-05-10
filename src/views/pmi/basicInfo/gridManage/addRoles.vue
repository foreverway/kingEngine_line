<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    :append-to-body="true"
    width="760px"
  >
    <el-container>
      <el-main>
        <el-row class="ke-search">
          <el-col
            :span="4"
            class="label"
          >
            用户名：
          </el-col>
          <el-col :span="6">
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
            label="姓名"
            align="center"
            width="120"
          />
          <el-table-column
            prop="loginName"
            label="登录名"
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
    // 选中要修改的数据
    private selectionItem: any = {}
    private total: number = 0
    private params: any= {
      total: 0,
      page: 1,
      rows: this.$base.grid.page,
      userName: ''
    }
    created() {
      this.initTableData()
    }
    private initTableData(): void {
      this.$http.request({
        url: '/obs/observer/findObserverByPage',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        this.listLoading = false
        this.total = res.total
        res.rows = [{
          userName: '姓名1',
          loginName: '登录名1'
        },{
          userName: '姓名2',
          loginName: '登录名2'
        }]
        this.tableData = res.rows
      })
    }
    private handleClickRow(row: any) {
      this.row = row
      this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
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
    private handleSave(): void {
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
