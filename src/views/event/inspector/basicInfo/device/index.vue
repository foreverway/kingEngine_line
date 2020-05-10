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
              class="form-item item-row"
              :span="13"
            >
              <date-range-selector
                start-label="维修时间"
                end-label="至"
                :start-value.sync="params.startMaintainTime"
                :end-value.sync="params.endMaintainTime"
                label-width="110px"
              />
            </el-col>
            <el-col
              class="form-item"
              :span="5"
            >
              <el-form-item label="使用状态">
                <el-select
                  v-model="params.pdaStatus"
                  placeholder="请选择使用状态"
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
              class="form-item"
              :span="5"
            >
              <el-form-item label="城管通号">
                <el-input
                  v-model="params.num"
                  placeholder="请输入城管通号"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              class="form-item item-row"
              :span="13"
            >
              <date-range-selector
                start-label="投入使用时间"
                end-label="至"
                :start-value.sync="params.startUseTime"
                :end-value.sync="params.endUseTime"
                label-width="110px"
              />
              <!-- <div class="item-row">
                <span class="label same-width">
                  投入使用时间
                </span>
                <div class="input-container">
                  <el-date-picker
                    v-model="params.startUseTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                  />
                </div>
              </div>
              <div class="item-row">
                <span class="label">
                  至
                </span>
                <div class="input-container">
                  <el-date-picker
                    v-model="params.endUseTime"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                  />
                </div>
              </div> -->
            </el-col>
            <el-col
              class="form-item"
              :span="5"
            >
              <el-form-item label="IEMI号">
                <el-input
                  v-model="params.imei"
                  placeholder="请输入IEMI号"
                  class="page-inp"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col
              :span="5"
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
            code="scrap"
            @click="handleSetUnuse"
          >
            报 废
          </el-button>
          <el-button
            v-power
            code="maintenanceRecord"
            @click="handleShowRecord"
          >
            维修记录
          </el-button>
          <import-file
            v-power
            code="importExcel"
            :url="'/obs/pda/importPda'"
            :is-upload.sync="isUpload"
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
            prop="imei"
            label="IEMI号"
            align="center"
          />
          <el-table-column
            prop="num"
            label="城管通号"
            align="center"
          />
          <el-table-column
            prop="version"
            label="版本号"
            align="center"
          />
          <el-table-column
            prop="pdaStatus"
            label="使用状态"
            align="center"
          >
            <template slot-scope="scope">
              <p class="status">
                {{ scope.row.pdaStatus | pdaFilter }}
              </p>
              <el-button
                v-if="scope.row.pdaStatus==3"
                class="status-button"
                type="text"
                @click.stop="handleSetStatus(scope)"
              >
                已修好
              </el-button>
              <el-button
                v-if="scope.row.pdaStatus==4"
                class="status-button"
                type="text"
                @click.stop="handleSetStatus(scope)"
              >
                取消报废
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="useTime"
            label="投入使用时间"
            width="100"
            align="center"
          />
          <el-table-column
            prop="maintianTime"
            label="维修时间"
            width="100"
            align="center"
          />
          <el-table-column
            prop="maintainCount"
            label="维修次数"
            align="center"
          />
          <el-table-column
            prop="pdaUserName"
            label="使用人"
            align="center"
          />
          <el-table-column
            prop="how"
            label="PDA用途"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.pdaUse | useFilter(dict) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="descript"
            label="备注"
            show-overflow-tooltip
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
    <add-form
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :selection-item="selections"
      @handleReload="handleReload"
      @handleInit="initTableData"
    />
    <record
      v-if="recordDialog.visible"
      :id="id"
      :record-dialog.sync="recordDialog"
      :selection-item="selections"
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
    Record: () => import('./record.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue'),
    DateRangeSelector: () => import('@/components/dateRangeSelector.vue')
  },
  filters: {
    pdaFilter: function(status){
      switch (status){
      case 1:
        return '未使用'
      case 2:
        return '使用中'
      case 3:
        return '维修中'
      case 4:
        return '报废'
      default:
        return '未使用'
      }
    },
    useFilter: function(val,dict){
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
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private isUpload: Boolean = false
  private id: number = 0
  private row: any = {}
  private total: number = 0
  private dict: Array<any> = []
  private dialog: any = {
    title: '',
    visible: false
  }
  private pickerOptions= {
    // disabledDate(time) {
    //   return time.getTime() > Date.now()
    // },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date())
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }]
  }
  private recordDialog: any = {
    visible: false
  }
  private params: any = {
    pdaStatus: '',
    startMaintainTime: '',
    endMaintainTime: '',
    num: '',
    imei: '',
    startUseTime: '',
    endUseTime: '',
    page: 1,
    rows: this.$base.grid.page
  }
  private statusOptions: any = [
    {
      label: '使用中',
      value: 2
    },
    {
      label: '维修中',
      value: 3
    },
    {
      label: '未使用',
      value: 1
    },
    {
      label: '报废',
      value: 4
    }
  ]
  created(){
    this.handleGetDict()
    this.initTableData()
  }
  async handleGetDict(){
    let res = await this.$base.dict.getItems('obs_pda_use')
    this.dict = res
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
      url: '/obs/pda/findObserverPdaByPage',
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
  private handleShowRecord(): void {
    if (this.selections.length < 1){
      this.$base.win.msg('请选择一条数据进行查看！')
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
  private handleAdd(): void {
    this.dialog = {
      title: '新增',
      visible: true
    }
  }
  private handleEdit(): void {
    if (this.selections.length < 1){
      this.$base.win.msg('请选择一条数据进行修改！')
      return
    }
    if (this.selections.length > 1){
      this.$base.win.msg('当前操作仅能勾选一条数据！')
      return
    }
    this.dialog = {
      title: '修改',
      visible: true,
      item: this.selections[0]
    }
  }
  private handleSetUnuse(): void{
    if (this.selections.length < 1){
      this.$base.win.msg('请至少选择一条数据进行操作！')
      return
    }
    this.$confirm('是否将该设备设置为报废？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let ids:Array<any> = []
      this.selections.forEach((item) => {
        ids.push(item.id)
      })
      this.$http({
        url: '/obs/pda/setUnused',
        method: 'post',
        data: {
          ids: ids.join(',')
        }
      }).then((res) => {
        this.$base.win.msg('操作成功','success')
        this.initTableData()
      })
    }).catch()
  }
  private handleSetStatus(scope): void{
    this.$confirm('是否修改状态？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$http({
        url: '/obs/pda/setObserverPdaUseStatus',
        method: 'post',
        data: {
          pdaStatus: 1,
          id: scope.row.id
        }
      }).then((res) => {
        this.initTableData()
        this.$base.win.msg('修改成功','success')
      })
    })
  }
  private handleExport(): void {
    exportXls('/obs/pda/exportPda',this)
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http({
          url: '/obs/pda/deleteObserverPda',
          method: 'post',
          data: {
            ids
          }
        }).then((res) => {
          this.$base.win.msg('操作成功','success')
          this.initTableData()
        })
      })
  }
}
</script>
<style scoped>
.item-row{
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
}
.label-center >>> .el-form-item__label{
  text-align: center !important;
  padding:  0 !important;
}
</style>
<style lang="scss" scoped>
.item-row {
  .label{
    padding-right: 10px;
    padding-left: 10px;
    color: #606266;
  }
  .same-width{
    width: 120px;
    text-align: right;
  }
}
  .status-button{
    padding: 0 !important;
    font-size: 12px;
  }
</style>
