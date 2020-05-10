<template>
  <div>
    <el-dialog
      v-dialog-drag
      title="维修记录"
      :visible.sync="recordDialog.visible"
      width="700px"
    >
      <div class="ke-buttons">
        <el-button @click="handleAdd">
          <svg-icon name="add" />新增
        </el-button>
        <el-button @click="handleEdit">
          <svg-icon name="edit" />修改
        </el-button>
        <el-button @click="handleDelete">
          <svg-icon name="remove" />删除
        </el-button>
        <el-button @click="handleReload">
          <svg-icon name="reset" />刷新
        </el-button>
      </div>
      <div style="height:400px;">
        <el-scrollbar
          class="ke-scrollbar"
          style="height:100%"
        >
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="tableData"
            stripe
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
              prop="maintainTime"
              label="维修时间"
              align="center"
              width="100"
            />
            <el-table-column
              prop="amount"
              label="维修金额"
              align="center"
            />
            <el-table-column
              prop="costType"
              label="费用类型"
              align="center"
            >
              <template slot-scope="scope">
                {{ scope.row.costType === 1?"公费":"自费" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="reason"
              label="维修原因"
              :show-overflow-tooltip="true"
              align="center"
            />
          </el-table>
        </el-scrollbar>
      </div>
      <el-footer>
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper"
          :total="total"
          :current-page.sync="params.page"
          @current-change="handlePage"
        />
      </el-footer>
    </el-dialog>
    <repire
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :select-item="selections"
      @handleInit="initTableData"
      @handleReload="handleReload"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'TaskForm',
  components: {
    Repire: () => import('./repire.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) recordDialog!: any
  private dialog: any = {
    title: '新增',
    visible: false
  }
  private total: number = 0
  private row: any = {}
  private selections: Array<any> = []
  private tableData: Array<any> = []
  private listLoading: boolean = true
  private params: any = {
    page: 1
  }
  mounted(){

    this.initTableData()
  }
  private initTableData(): void{
    this.params.pdaId = this.recordDialog.item.id
    this.listLoading = true
    this.$http({
      url: '/obs/pda/findObserverPdaMaintainLogByPage',
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
  private handleAdd():void {
    this.dialog = {
      title: '新增',
      visible: true,
      pdaItem: this.recordDialog.item
    }
  }
  private handleEdit():void {
    if (this.selections.length < 1){
      this.$base.win.msg('请选择一条数据进行修改！')
      return
    } else if (this.selections.length > 1){
      this.$base.win.msg('当前操作仅能勾选一条数据！')
      return
    }
    this.dialog = {
      visible: true,
      title: '修改',
      item: this.selections[0],
      pdaItem: this.recordDialog.item
    }
  }
  private handleDelete():void{
    if (this.selections.length < 1){
      this.$base.win.msg('请至少选择一条数据据进行删除！')
      return
    }
    this.$confirm('确定删除选中的设备吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let ids:Array<any> = []
      this.selections.forEach((item) => {
        ids.push(item.id)
      })
      this.$http({
        url: '/obs/pda/deleteObserverPdaMaintainLog',
        method: 'post',
        data: {
          ids: ids.join(',')
        }
      }).then((res) => {
        this.initTableData()
        this.$base.win.msg('操作成功','success')
      })
    })
  }
  private handleReload() {
    this.$base.common.reload(this)
  }
}
</script>
<style lang="scss" scoped>

</style>
