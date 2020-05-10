<template>
  <div class="department-wrapper">
    <el-container>
      <nav-bar />
      <el-main>
        <div class="nav-bar">
          <span>文件名称：</span>
          <el-input
            v-model="input"
            placeholder="请输入内容"
          />
          <el-button
            type="primary"
            icon="el-icon-search"
          >
            查询
          </el-button>
          <el-button type="warning">
            <svg-icon name="reset" />重置
          </el-button>
        </div>
        <div class="operate-buttons">
          <el-button @click="handleAdd">
            <svg-icon name="add" />新增文件夹
          </el-button>
          <el-button @click="handleEdit">
            <svg-icon name="edit" />修改文件夹
          </el-button>
          <el-button @click="handleDelete">
            <svg-icon name="remove" />删除文件夹
          </el-button>
          <el-button>删除文件</el-button>
          <el-button @click="refresh">
            <svg-icon name="reset" />刷新
          </el-button>
          <el-button><svg-icon name="import" />导入</el-button>
        </div>
        <el-table
          ref="eltableCurrentRow"
          :data="tableData"
          stripe
          style="width: 100%;"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" />
          <el-table-column type="selection" />
          <el-table-column
            prop="date"
            label="文件名称"
            align="center"
            width="180"
          />
          <el-table-column
            prop="name"
            label="所属文件夹"
            align="center"
            width="120"
          />
          <el-table-column
            prop="address"
            align="center"
            label="上传时间"
          />
          <el-table-column
            prop="address"
            align="center"
            label="操作"
          >
            <template>
              <span class="preview">[预览]</span>
              <span class="download">[下载]</span>
            </template>
          </el-table-column>
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
      width="700px"
    >
      <add-form
        v-if="addDialog.visible"
        :id="id"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App',
  components: {
    NavBar: () => import('./../../components/nav.vue'),
    AddForm: () => import('./add.vue')
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
    // console.log(`每页 ${val} 条
  }
  private handleCurrentChange(val: Array<any>) {
    // console.log(`当前页: ${val}`)
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
  display: flex;
  width: 100%;
  height: 100%;
  .tc{
    text-align: center;
  }
  .el-main{
    margin-left: 12px;
    flex: 1;
    background: #fff;
    border-radius: 4px;
    padding: 10px;
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
  }
}
</style>
