<template>
  <el-dialog
    :title="dialog.title||'选择监督员'"
    :visible.sync="dialog.visible"
    :append-to-body="true"
    width="1050px"
  >
    <el-container class="ke-layout">
      <el-main class="ke-layout-main">
        <el-container class="ke-layout-container">
          <ke-aside
            class="ke-body"
            width="200px"
            title="工作组"
            :is-dialog="true"
          >
            <template>
              <el-scrollbar class="tree-container">
                <ul class="work-group">
                  <li
                    v-for="item in workGroup"
                    :key="item.id"
                    :class="{'work-group-item': true,'selected':params.groupId === item.id}"
                    @click="handleWorkGroupSelect(item.id)"
                  >
                    {{ item.workGroupName }}
                  </li>
                </ul>
              </el-scrollbar>
            </template>
          </ke-aside>
          <el-container class="ke-layout-body ke-dialog-el-main">
            <el-header height="auto">
              <el-form
                class="ke-search"
                label-width="55px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="姓名">
                      <el-input v-model="params.userName" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="编号">
                      <el-input v-model="params.workerNo" />
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="7"
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
                @row-click="handleClickRow"
                @selection-change="handleSelectionChange"
              >
                <el-table-column
                  type="index"
                  align="center"
                />
                <el-table-column
                  prop="userName"
                  label="姓名"
                  align="center"
                />
                <el-table-column
                  prop="workerNo"
                  label="编号"
                  align="center"
                />
                <el-table-column
                  prop="mobile"
                  label="手机号"
                  align="center"
                />
                <el-table-column
                  prop="address"
                  label="所属区域"
                  align="center"
                />
                <el-table-column
                  label=""
                  prop="id"
                  width="80"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="default"
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
import IDict from '@/interface/dict'
  @Component({
    components: {
      KeAside: () => import('@/components/keAsideRight.vue')
    }
  })
export default class extends Vue {
    @Prop({ type: Boolean, default: false }) visible !: boolean
    @Prop({ type: Object, default: {} }) dialog !: any
    // 表格数据是否正在加载
    private listLoading: boolean = true
    // 点击行数据
    private row: any = {}
    private selections: Array<any> = []
    // 获取选择项数据(修改时用)
    private tableData: Array<any> = []
    private workGroup: Array<any> = []
    private params: any= {
      total: 0,
      page: 1,
      rows: this.$base.grid.page,
      workerNo: '',
      userName: '',
      groupId: ''
    }
    created() {
      this.handleGetWorkGroup()
      this.initTableData()
    }
    private initTableData(): void {
      this.$http.request({
        url: '/obs/observer/findObserverByPage',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        this.params.total = res.total
        this.tableData = res.rows
        this.listLoading = false
      })
    }
    private handleGetWorkGroup(){
      this.$http.request({
        url: '/obs/workGroup/findWorkGroupList',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        this.workGroup = res.data
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
      this.params.page = 1
      this.initTableData()
    }
    private handleReset(): void {
      this.$base.common.reset(this)
    }
    handleSelect(row:any){
      this.$emit('setData', row)
      let dialog = {
        title: '',
        visible: false
      }
      this.$emit('update:dialog', dialog)
    }
    private handleWorkGroupSelect(id){
      if (this.params.groupId === id){
        this.params.groupId = ''
      } else {
        this.params.groupId = id
      }
      this.initTableData()
    }
}
</script>

<style scoped>
.tree-container >>> .el-scrollbar__wrap{
  overflow-x: hidden;
  margin-right: -11px!important;
}
</style>
<style lang="scss" scoped>
.ke-layout{
  height:470px;
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
      cursor: pointer;
    }
  }
}
.work-group{
  padding-right: 3px;
}
.work-group-item{
  color: #606266;
  // border: 1px solid #FF4500;
  // box-shadow: 0px 3px 5px 0px rgba(14, 15, 15, 0.18);
  // background: #FF7F50;
  border-radius: 4px;
  padding: 7px 3px 7px;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin-bottom: 6px;
  user-select: none;
  cursor: pointer;
}
.selected{
  background: #409EFF !important;
  // border: 1px solid #409EFF;
  color: #fff !important;
}
.tree-container {
  height: calc(100% - 22px);
}
</style>
