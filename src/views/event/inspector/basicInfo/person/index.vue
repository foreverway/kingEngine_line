<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="params"
          class="ke-search"
          label-width="77px"
        >
          <el-row>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item label="姓名">
                <el-input
                  v-model="params.userName"
                  placeholder="请输入姓名"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item
                label-width="65px"
                class="ke-center"
                label="状态"
              >
                <el-select
                  v-model="params.auditStatus"
                  placeholder="请选择状态"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item
                label-width="85px"
                label="身份证号"
              >
                <el-input
                  v-model="params.idno"
                  placeholder="请输入身份证号"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              class="form-item"
            >
              <el-form-item label="人员类型">
                <ke-dict
                  v-model="params.userType"
                  placeholder="请选择人员类型"
                  code="observer_type"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="10"
              class="buttons"
              style="width:40.66667%;"
            >
              <el-button
                v-power
                type="primary"
                code="search"
                icon="el-icon-search"
                @click="handleSearch"
              >
                查询
              </el-button>
              <el-button
                v-power
                type="warning"
                code="reset"
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
            code="check"
            @click="handleAudit"
          >
            审 核
          </el-button>
          <el-button
            v-power
            code="departure"
            @click="handleLeftJob"
          >
            离 职
          </el-button>
          <el-button
            v-power
            code="del"
            @click="handleDelete"
          >
            <svg-icon name="remove" />删除
          </el-button>
          <import-file
            v-power
            :url="'/obs/observer/importObserver'"
            :data="importQuery"
            :is-upload.sync="isUpload"
            code="importExcel"
          />
          <el-button
            v-power
            code="exportExcel"
            @click="handleExport"
          >
            <svg-icon name="export" />导出
          </el-button>
          <el-button
            v-power
            code="refresh"
            @click="handleReload"
          >
            <svg-icon name="reset" />刷新
          </el-button>
        </div>
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
            fixed="left"
          />
          <el-table-column
            type="selection"
            align="center"
            fixed="left"
          />
          <el-table-column
            prop="userName"
            label="姓名"
            align="center"
            width="120"
            fixed="left"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click.stop="handleShowInfo(scope.row)"
              >
                {{ scope.row.userName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="loginName"
            label="登录名"
            align="center"
          />
          <el-table-column
            prop="workerNo"
            label="编号"
            align="center"
          />
          <el-table-column
            prop="pdaNum"
            label="城管通号"
            align="center"
          />
          <el-table-column
            prop="pdaNum"
            label="城管通版本"
            align="center"
          />
          <el-table-column
            prop="auditStatus"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.auditStatus === 1?"未审核":"已审核" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="nativePlace"
            label="籍贯"
            align="center"
          />
          <el-table-column
            prop="sex"
            label="性别"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.sex === 1 ? "男":"女" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="userType"
            label="人员类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.userType | userTypeFilter(userTypeDict) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="userMobile"
            label="联系电话"
            align="center"
          />
          <el-table-column
            prop="idno"
            label="身份证号"
            align="center"
          />
          <el-table-column
            prop="address"
            label="默认工作网格"
            align="center"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.workCellList">
                <p
                  v-for="item in scope.row.workCellList"
                  :key="item.id"
                >
                  {{ item.gridName }}
                </p>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer height="auto">
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper,sizes"
          :total="total"
          :page-sizes="[10,20,30,50,100]"
          :page-size.sync="params.rows"
          :current-page.sync="params.page"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
    <add-form
      v-if="dialog.visible"
      :type="dialog.type"
      :dialog.sync="dialog"
      @handleInit="initTableData"
      @handleReload="handleReload"
    />
    <left
      v-if="leftDialog.visible"
      :dialog.sync="leftDialog"
      @handleInit="initTableData"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exportXls from '@/utils/export'
import md5 from 'js-md5'
@Component({
  name: 'App',
  components: {
    AddForm: () => import('./add.vue'),
    Left: () => import('./left.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue')
  },
  filters: {
    userTypeFilter: function(val,dict){
      for (let i of dict){
        if (i.dictValue === val){
          return i.dictName
        }
      }
    }
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: Number = 0
  private isUpload: Boolean = false
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private userTypeDict: Array<any> = []
  private countData: Array<any> = []
  private row: any = {}
  private id: any = 0
  private importQuery: any = ''
  private params: any = {
    auditStatus: '',
    idno: '',
    userType: '',
    userName: '',
    page: 1,
    rows: this.$base.grid.page
  }

  private statusOptions: any = [
    {
      label: '未审核',
      value: 1
    },
    {
      label: '已审核',
      value: 2
    }
  ]
  private dialog: any = {
    title: '',
    visible: false
  }
  private leftDialog: any = {
    visible: false,
    item: []
  }
  created(){
    this.handleGetUserType()
    this.initTableData()
    this.importQuery = {
      password: md5('123456')
    }

  }
  async handleGetUserType(){
    let res = await this.$base.dict.getItems('observer_type')
    this.userTypeDict = res
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.$base.common.reset(this)
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/observer/findObserverByPage',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.tableData = res.rows
      this.total = res.total
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }
  private handleReload(): void {
    this.$base.common.reload(this)
  }
  private handlePage(val): void {
    this.params.page = val
    this.initTableData()
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleAdd(): void {
    this.dialog = {
      visible: true,
      title: '新增',
      type: 'add'
    }
  }
  private handleShowInfo(item):void{
    this.dialog = {
      visible: true,
      title: '查看',
      type: 'check',
      item
    }
  }
  private handleEdit(): void {
    if ( this.selections.length < 1){
      this.$base.win.msg('请选择一条人员数据进行操作！')
      return
    }
    if (this.selections.length > 1){
      this.$base.win.msg('当前操作仅能勾选一条数据！')
      return
    }
    this.dialog = {
      visible: true,
      title: '修改',
      type: 'edit',
      item: this.selections[0]
    }
  }
  private handleLeftJob(): void{
    if (this.selections.length > 0){
      this.leftDialog = {
        visible: true,
        items: this.selections
      }
    } else {
      this.$base.win.msg('请至少选择一条人员数据进行操作！','error')
    }
    // this.$base.grid
    //   .remove(this.selections,'是否对选中人员执行操作？','提示')
    //   .then((ids: string) => {
    //     this.$http({
    //       url: '/obs/observer/leftJob',
    //       method: 'post',
    //       data: {
    //         ids
    //       }
    //     }).then((res) => {
    //       this.initTableData()
    //       this.$base.win.msg('成功', 'success')
    //     })
    //   }).catch()
  }
  private handleExport(){
    exportXls('obs/observer/exportObserver',this)
  }

  private handleAudit(): void{
    if (this.selections.length > 0){
      this.$confirm('确定审核通过选中的人员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids: Array<any> = []
        this.selections.forEach((item) => {
          ids.push(item.id)
        })
        this.$http({
          url: '/obs/observer/auditObserver',
          method: 'post',
          data: {
            ids: ids.join(',')
          }
        }).then((res) => {
          this.initTableData()
          this.$base.win.msg('成功', 'success')
        })
      })
    } else {
      this.$base.win.msg('请至少选择一条人员数据进行操作！')
    }
  }
  private handleDelete(): void{
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http({
          url: '/obs/observer/deleteObserver',
          method: 'post',
          data: {
            ids
          }
        }).then((res) => {
          this.initTableData()
          this.$base.win.msg('成功', 'success')
        })
      }).catch()
  }
}
</script>
<style lang="scss" scoped>
</style>
