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
              <el-scrollbar>
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
                      <el-input
                        v-model="params.userName"
                        placeholder="请输入姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="编号">
                      <el-input
                        v-model="params.workerNo"
                        placeholder="请输入编号"
                      />
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
          <ke-aside
            class="ke-body"
            width="200px"
            title="已选择监督员"
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
                      {{ item.userName }}
                    </p>
                    <i
                      class="el-icon-delete"
                      @click="handleDelete(item)"
                    />
                  </li>
                </ul>
              </el-scrollbar>
            </template>
          </ke-aside>
        </el-container>
      </el-main>
    </el-container>
    <div
      slot="footer"
      class="ke-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取消
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
      KeAside: () => import('@/components/keAsideRight.vue')
    }
  })
export default class extends Vue {
    @Prop({ type: Array, default: {} }) selectUsers !: any
    @Prop({ type: Boolean, default: false }) visible !: boolean
    @Prop({ type: Object, default: {} }) dialog !: any
    public $refs: any = { quickEntry: HTMLFormElement }
    // 表格数据是否正在加载
    private listLoading: boolean = true
    // 点击行数据
    private row: any = {}
    private selections: Array<any> = []
    // 已选择人员数据
    private selectedUsers: Array<any> = this.$base.common.extend(this.selectUsers)
    // 获取选择项数据(修改时用)
    // private tableData: Array<any> = []
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
        this.formateCheckbox()
        this.$nextTick(() => {
          this.listLoading = false

        })
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
    private handleWorkGroupSelect(id){
      if (this.params.groupId === id){
        this.params.groupId = ''
      } else {
        this.params.groupId = id
      }
      this.initTableData()
    }
    private formateCheckbox(): void { // 表格数据默认选中
      this.$nextTick(() => {
        let data: any = this.chooseData()
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
      // console.log(c)
      return c
    }
    private handleClickRow(row: any) { // 点击行
      this.row = row
      // this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
      this.handleSelectCheckbox(row)
      this.formateCheckbox()
    }
    private handleSelect(selection: any, row: any): void { // 点击复选框
      this.handleSelectCheckbox(row)
    }
    private handleSelectAll(selection: any): void { // 点击全选按钮
      // console.log(selection)
      if (selection.length) { // 全选
        let ids: any = []
        this.selectedUsers.forEach((item: any, i: number) => {
          ids.push(item.id)
        })
        selection.forEach((el) => {
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
      // console.log(this.selectedUsers)
    }
    private handleSelectCheckbox(row): void {
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
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleDelete(item): void { // 删除已选中人员
      console.log(item)
      let index: number = -1
      this.selectedUsers.forEach((el: any, i: number) => {
        if (el.id === item.id) {
          index = i
        }
      })
      this.selectedUsers.splice(index, 1)
      this.formateCheckbox()
    }
    private handleReload(): void {
      this.initTableData()
    }
    private handlePage(currentPage: number): void { // 分页
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
    private handleSave(): void {
      this.$emit('update:selectUsers', this.selectedUsers)
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
  padding: 0px 3px 0 6px;
  height: 26px;
  line-height: 26px;
  display: flex;
  flex-flow: row;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 6px;
  user-select: none;
  cursor: pointer;
}
.selected{
  background: #409EFF !important;
  color: #fff;
  // border: 1px solid #409EFF;
}
.tree-container {
  height: calc(100% - 22px);
}
</style>
