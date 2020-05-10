<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header height="auto">
        <el-form
          :model="params"
          class="ke-search"
          label-width="85px"
        >
          <el-row>
            <el-col
              :span="5"
              class="form-item"
            >
              <el-form-item
                label="班次名称"
                label-width="90px"
              >
                <el-input
                  ref="params"
                  v-model="params.scheduleName"
                  placeholder="请输入班次名称"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
            <!-- <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item
                label="所属区域"
                label-width="90px"
              >
                <ke-tree
                  v-model="params.areaId"
                  :clearable="true"
                />
              </el-form-item>
            </el-col> -->
            <el-col
              :span="6"
              class="form-item"
            >
              <el-form-item
                label="是否生效"
                label-width="90px"
              >
                <el-select
                  v-model="params.isEffect"
                  placeholder="请选择是否生效"
                >
                  <el-option
                    v-for="(item,index) in effectOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="6"
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
              <el-button
                v-power
                code="exportExcel"
                @click="handleExport"
              >
                <svg-icon name="export" />导出
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
            code="adjustSchedule"
            @click="handleEditOrder"
          >
            排班调整
          </el-button>
          <el-button
            v-power
            code="view"
            @click="handleEditRecord"
          >
            调整记录
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
          />
          <el-table-column
            type="selection"
            align="center"
          />
          <el-table-column
            prop="className"
            label="班次名称"
            align="center"
          />
          <el-table-column
            prop="startTime"
            label="上班时间"
            align="center"
          />
          <el-table-column
            prop="endTime"
            label="下班时间"
            align="center"
          />
          <el-table-column
            prop="note"
            label="是否生效"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.isEffect === 1?"不生效":"生效" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="note"
            label="备注"
            align="center"
          />
        </el-table>
      </el-main>
      <el-footer>
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
      :dialog.sync="dialog"
      @handleReload="handleReload"
      @handleInit="initTableData"
    />
    <modify
      v-if="modifyDialog.visible"
      :dialog.sync="modifyDialog"
      @handleInit="initTableData"
    />
    <record
      v-if="recordDialog.visible"
      :dialog.sync="recordDialog"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exportXls from '@/utils/export'
@Component({
  name: 'App',
  components: {
    AddForm: () => import('./add.vue'),
    Modify: () => import('./modify.vue'),
    Record: () => import('./record.vue')
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private total: number = 0
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private row: any = {}
  private dialog: any = {
    visible: false,
    title: '新增'
  }
  private effectOptions:any =[
    {
      label: '不生效',
      value: 1
    },
    {
      label: '生效',
      value: 2
    }
  ]
  private recordDialog: any = {
    visible: false
  }
  private modifyDialog: any = {
    visible: false
  }
  private params:any = {
    page: 1,
    rows: this.$base.grid.page,
    scheduleName: '',
    isEffect: ''
  }
  created(){
    this.initTableData()
  }
  private handleAdd(): void {
    this.dialog.visible = true
  }
  private handleEdit(): void {
    if (this.selections.length <= 0){
      this.$base.win.msg('请选择一条数据进行操作！')
      return
    } else if (this.selections.length > 1){
      this.$base.win.msg('当前操作仅能勾选一条数据！')
      return
    }
    this.dialog = {
      title: '修改',
      visible: true,
      item: this.selections[0]
    }
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http({
          url: '/obs/scheduleClass/deleteScheduleClass',
          method: 'post',
          data: {
            ids
          }
        }).then((res) => {
          this.$base.win.msg('操作成功','success')
          this.initTableData()
        })
      }).catch()
  }
  private handleEditOrder(): void{
    this.modifyDialog = {
      visible: true
    }
  }
  private handleEditRecord(): void {
    if (this.selections.length <= 0){
      this.$base.win.msg('请选择一条数据进行操作！')
      return
    } else if (this.selections.length > 1){
      this.$base.win.msg('当前操作仅能勾选一条数据！')
      return
    }
    this.recordDialog = {
      visible: true,
      item: this.selections[0]
    }
  }
  private handleSearch(){
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(){
    this.$base.common.reset(this)
  }
  private handleReload(): void{
    this.$base.common.reload(this)
  }
  private handleExport():void{
    exportXls('obs/scheduleClass/exportScheduleClass',this)
  }
  private initTableData(): void {
    this.listLoading = true
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$base.common.trimParams(this)
    this.$http({
      url: '/obs/scheduleClass/findScheduleClassPage',
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
}
</script>
<style lang="scss" scoped>

</style>
