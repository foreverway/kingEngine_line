<template>
  <div class="department-wrapper">
    <el-container>
      <el-main>
        <div class="operate-buttons">
          <el-button @click="handleAdd">
            <svg-icon name="add" />新增
          </el-button>
          <el-button @click="handleDelete">
            <svg-icon name="remove" />清除选中
          </el-button>
        </div>
        <el-table
          ref="eltableCurrentRow"
          :data="tableData"
          stripe
          max-height="240"
          style="width: 100%;"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="index">
          </el-table-column> -->
          <el-table-column type="selection" />
          <el-table-column
            prop="date"
            label="系统名称"
            align="center"
          />
          <el-table-column
            prop="name"
            label="发布明细"
            align="center"
          />
        </el-table>
        <el-pagination
          background
          :current-page.sync="currentPage3"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="1000"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-main>
    </el-container>
    <el-dialog
      :title="addDialog.title"
      :visible.sync="addDialog.visible"
      :append-to-body="true"
      width="400px"
    >
      <add-details
        v-if="addDialog.visible"
        :id="id"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  components: {
    AddDetails: () => import('./addDetails.vue')
  }
})
export default class extends Vue {
  private pageName: string = '部门管理'
  private input: string = ''
  private currentPage3: number = 5
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private addDialog: any = {
    title: '',
    visible: false
  }
  private tableData: Array<any> = [{
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
  }, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄'
  }, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄'
  }, {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄'
  }]

  private handleSizeChange(val: Array<any>) {
    console.log(`每页 ${val} 条`)
  }
  private handleCurrentChange(val: Array<any>) {
    console.log(`当前页: ${val}`)
  }
  private handleAdd(): void {
    this.id = 0
    this.addDialog.title = '新增'
    this.addDialog.visible = true
  }
  private handleEdit(): void {
    this.$base.grid.row(this.selections).then((row: any) => {
      this.id = row.id
      this.addDialog.title = '修改'
      this.addDialog.visible = true
    }).catch(() => { })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleDelete(): void {
    this.$base.grid.remove(this.selections)
      .then((ids: string) => {
        this.$base.win.msg(ids)
      }).catch(() => { })
  }
  private refresh(): void {
    console.log('刷新')
  }
}
</script>
<style lang="scss" scoped>
.department-wrapper{
  // padding: 0 10px;
  box-sizing: border-box;
  // height: 350px;
  // overflow-y: auto;
  padding-bottom: 20px;
  .tc{
    text-align: center;
  }
  .el-main{
    // margin-left: 12px;
    flex: 1;
    background: #fff;
    border-radius: 4px;
    padding: 0px;
    box-sizing: border-box;
    .nav-bar{
      margin-bottom: 10px;
      span{
        color: #4a5460;
        font-size: 14px;
      }
      .el-input{
        width: 140px;
        margin-right: 10px;
      }
    }
    .operate-buttons{
      display: flex;
      flex-wrap: wrap;
      button{
        margin-bottom: 10px;
      }
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
    .el-table{
      margin-bottom: 10px;
      // height: 240px;
    }
  }
}
</style>
