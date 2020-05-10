<template>
  <el-dialog
    :title="cellDialog.title"
    :visible.sync="cellDialog.visible"
    :append-to-body="true"
    width="700px"
  >
    <div>
      <el-container>
        <el-main>
          <el-row class="ke-search">
            <el-col
              :span="4"
              class="label"
            >
              工作网格名称：
            </el-col>
            <el-col :span="5">
              <el-input v-model="params.name" />
            </el-col>
            <el-col
              :span="9"
              class="buttons"
            >
              <el-button
                type="primary"
                icon="el-icon-search"
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
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="tableData"
            stripe
            height="260px"
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
              prop="gridName"
              label="工作网格名称"
              align="center"
            />
            <el-table-column
              prop="gridCode"
              label="工作网格编码"
              align="center"
            />
            <el-table-column
              prop="dbStatus"
              label="状态"
              align="center"
            />
            <el-table-column
              prop="note"
              label="备注"
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
        <el-button @click="handelCancel">
          <svg-icon name="hamburger" />取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          <svg-icon name="hamburger" />保存
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
    }
  })
export default class extends Vue {
    @Prop({ type: Object, default: {} }) selectGird !: any
    @Prop({ type: Object, default: {} }) cellDialog !: any
    // 表格数据是否正在加载
    private listLoading: boolean = true
    // 点击行数据
    private row: any = {}
    private selections: Array<any> = []
    // 获取选择项数据id(修改时用)
    private id: number = 0
    private tableData: Array<any> = []
    // 选中要修改的数据
    private selectionItem: any = {}
    private total: number = 0
    private params: any= {
      page: 1,
      rows: this.$base.grid.page,
      parentId: 0,
      name: ''
    }
    created() {
      this.initTableData()
    }
    private initTableData(): void {
      this.$http.request({
        url: '/cellGrid/findCellgridByPage',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        // console.log(res)
        this.listLoading = false
        this.total = res.total
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
      // console.log('11')
      // this.params.name = ''
      this.params.page = currentPage
      this.initTableData()
    }
    private handleSearch(): void {
      // this.params.parentId = 0
      this.params.page = 1
      this.initTableData()
    }
    private handleReset(): void {
      this.params.name = ''
      this.params.parentId = 0
      this.params.page = 1
      this.initTableData()
    }
    private submitForm(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        // console.log(row)
        this.$emit('update:selectGird', row)
        let cellDialog = {
          title: '',
          visible: false
        }
        this.$emit('update:cellDialog', cellDialog)
      }).catch(() => { })
    }
    private handelCancel(): void {
      let cellDialog = {
        title: '',
        visible: false
      }
      this.$emit('update:cellDialog', cellDialog)
    }
}
</script>

<style lang="scss" scoped>
  .left-border {
    margin-left: 0
  }
  .el-main{
    padding: 0;
  }
  .opeate-buttons{
    text-align: right;
    margin-top: 20px;
  }
</style>
