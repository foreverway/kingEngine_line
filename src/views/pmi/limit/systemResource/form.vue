<template>
  <div class="department-wrapper">
    <el-main>
      <el-row class="ke-search">
        <el-col
          :span="2"
          class="label"
        >
          资源名称：
        </el-col>
        <el-col :span="4">
          <el-input v-model="resquestData.name" />
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
        <!-- <el-button><svg-icon name="import" />导入</el-button> -->
        <el-upload
          class="no-list-upload"
          :action="baseURL + '/privilege/importPrivilege'"
          :on-success="uploadSuccess"
          :before-upload="fileInformationAction"
          accept=".xls,.xlsx"
        >
          <el-button><svg-icon name="import" />导入</el-button>
        </el-upload>
      </div>
      <el-table
        ref="eltableCurrentRow"
        v-loading="loading"
        :data="tabaleList"
        stripe
        style="width: 100%;"
        @row-click="handleClickRow"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="index" />
        <el-table-column type="selection" />
        <el-table-column
          prop="privilegeName"
          label="资源名称"
          align="center"
          width="180"
        />
        <el-table-column
          prop="privilegePath"
          label="地址"
          align="center"
          width="120"
        />
        <el-table-column
          prop="dbStatus"
          align="center"
          label="状态"
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
    <el-dialog
      :title="addDialog.title"
      :visible.sync="addDialog.visible"
      width="700px"
    >
      <add-form
        v-if="addDialog.visible"
        :id="id"
        :visible.sync="addDialog.visible"
        :selection-item="selectionItem"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Object } from 'ol'
@Component({
  components: {
    AddForm: () => import('./add.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  private pageName: string = '部门管理'
  private input: string = ''
  private currentPage3: number = 5
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 选中要修改的数据
  private selectionItem: any = {}
  // 列表数据
  private tabaleList: Array<any> = []
  private total: number = 0
  private loading: boolean = false
  private baseURL: any = sessionStorage.getItem('baseURL')
  private resquestData: any= {
    page: 1,
    rows: this.$base.grid.page,
    parentId: 0,
    name: ''
  }
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
  created() {
    // this.initData()
    this.resquestData.parentId = this.id
    this.initTableData()
  }
  @Watch('id')
  private handleIdChanged(val: number, oldVal: number): void {
    if (val !== oldVal) {
      this.resquestData.parentId = val
      this.initTableData()
    }
  }
  private initTableData(): void {
    this.loading = true
    this.$http.request({
      url: '/privilege/findAllPrivilege',
      method: 'post',
      data: this.resquestData
    }).then((res: any) => {
      this.loading = false
      this.tabaleList = res.rows
      this.total = res.total
    })
  }
  private handlePage(currentPage: number): void { // 分页
    // console.log(currentPage)
    // this.resquestData.name = ''
    this.resquestData.page = currentPage
    this.initTableData()
  }
  private handleAdd(): void {
    // this.id = 0
    this.selectionItem = {
      dbStatus: 1, // 数据状态
      doubleScreen: false, // 是否双屏系统 1
      fontCss: '', // 字体文件
      iconCss: '', // 资源图标 1
      id: 0, // 主键id
      menuIcon: '', // 菜单图标 1
      note: '', // 备注 1
      orderNo: 0, // 排序号 1
      parentId: 0, // 父级联id
      privilegeCode: '', // 资源编码 1
      privilegeName: '', // 权限名称
      privilegePath: '', // 资源路径 1
      roles: []
    }
    this.addDialog.title = '新增'
    this.addDialog.visible = true
  }
  private handleEdit(): void {
    this.$base.grid.row(this.selections).then((row: any) => {
      // this.id = row.id
      // console.log(this.selections)
      this.selectionItem = this.selections[0]
      this.addDialog.title = '修改'
      this.addDialog.visible = true
    }).catch(() => { })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tabaleList, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleDelete(): void {
    this.$base.grid.remove(this.selections)
      .then((ids: string) => {
      // this.$base.win.msg(ids)
      // console.log(ids)
        this.$http.request({
          url: '/privilege/deletePrivilege',
          method: 'post',
          data: {
            ids: ids
          }
        }).then((res: any) => {
          console.log(res)
          this.$base.win.msg('删除成功')
        })
      }).catch(() => { })
  }
  private handleReload(): void {
    // console.log('刷新')
    this.initTableData()
  }
  private handleSearch(): void { // 搜索
    this.resquestData.page = 1
    // this.resquestData.parentId = 0
    this.initTableData()
  }
  private handleReset(): void { // 重置
    // console.log('1111')
    this.resquestData.name = ''
    this.resquestData.page = 1
    this.resquestData.parentId = 0
    this.initTableData()
  }
  private uploadSuccess(response: any, file: any, fileList: any) { // 上传文件成功
    // console.log(response, file, fileList)
    this.$base.win.msg('导入成功', 'success')
    this.resquestData.name = ''
    this.resquestData.page = 1
    this.resquestData.parentId = 0
    this.initTableData()
  }
  private fileInformationAction(file: any) { // 上传成功获取文件信息
    // console.log(file)
  }
}
</script>
<style lang="scss" scoped>
.department-wrapper{
  // display: flex;
  // width: 100%;
  height: 100%;
  flex: 1;
  // padding: 12px;
  // box-sizing: border-box;
  .tc{
    text-align: center;
  }
  .el-main{
    height: 100%;
    margin-left: 12px;
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
