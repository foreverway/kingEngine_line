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
              class="form-item"
              :span="6"
            >
              <el-form-item
                label-width="110px"
                label="工作组网格名称"
              >
                <el-input
                  v-model="params.name"
                  placeholder="请输入工作网格名称"
                />
              </el-form-item>
            </el-col>
            <el-col
              class="form-item"
              :span="5"
            >
              <el-form-item label="所属区域">
                <ke-tree
                  v-model="params.areaId"
                  :clearable="true"
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              class="buttons"
              style="width:40.66667%;"
            >
              <el-button
                type="primary"
                icon="el-icon-search"
                class="margin-left"
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
        <div class="ke-buttons">
          <!-- <el-button @click="handleAdd">
            <svg-icon name="add" />新增
          </el-button> -->
          <el-button @click="handleEdit">
            <svg-icon name="edit" />修改
          </el-button>
          <!-- <el-button @click="handleDelete">
            <svg-icon name="remove" />删除
          </el-button> -->
          <import-file
            :url="'obs/workGrid/importWorkGrid'"
            :is-upload.sync="isUpload"
          />
          <el-button @click="handleExport">
            <svg-icon name="export" />导出
          </el-button>
          <el-button @click="handleReload">
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
            prop="gridName"
            label="工作组网格名称"
            align="center"
          />
          <el-table-column
            prop="gridCode"
            label="网格编码"
            align="center"
          />
          <el-table-column
            prop="space"
            label="网格面积"
            align="center"
          />
          <el-table-column
            prop="areaName"
            label="所属区域"
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
          layout="prev, pager, next,total,jumper,sizes"
          :total="total"
          :page-sizes="[10,20,30,50,100]"
          :page-size.sync="params.rows"
          :current-page.sync="params.page"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
    <add
      v-if="dialog.visible"
      :dialog.sync="dialog"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import exportXls from '@/utils/export'
@Component({
  name: 'App',
  components: {
    ImportFile: () => import('@/components/ImportFile/index.vue'),
    Add: () => import('./add.vue')
  }
})
export default class extends Vue {
  private listLoading: boolean = true
  private isUpload: boolean = false
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private row: any = {}
  private total: number = 0
  private dialog: any = {
    title: '',
    visible: false,
    item: null
  }
  private params: any = {
    name: '',
    areaId: '',
    page: 1,
    rows: this.$base.grid.page
  }

  created(){
    this.initTableData()
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
      url: '/obs/workGrid/findWorkGridByPage',
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
  private handleReload(): void{
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
  private handleEdit(){
    if (this.selections.length < 1 || this.selections.length > 1) {
      this.$base.win.msg('请选择一条数据进行操作！')
      return
    }
    this.dialog = {
      title: '修改',
      visible: true,
      item: this.selections[0]
    }
  }
  private handleExport(){
    exportXls('/obs/workGrid/exportWorkGrid',this)
  }
}
</script>
<style scoped>
.label-center >>> .el-form-item__label{
  text-align: center !important;
  padding:  0 !important;
}
</style>
<style lang="scss" scoped>

</style>
