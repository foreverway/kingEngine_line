<template>
  <el-container class="page ke-layout">
    <ke-aside
      class="ke-body"
      width="229px"
      title="导航"
    >
      <template>
        <el-scrollbar class="tree-container">
          <el-tree
            ref="tree"
            node-key="id"
            :data="treeData"
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </template>
    </ke-aside>
    <el-container class="ke-layout-body">
      <el-main
        class="ka-body"
      >
        <el-form
          class="ke-search form-container"
          label-width="100px"
        >
          <el-row>
            <el-col :span="7">
              <el-form-item
                label="事部件名称"
                prop="className"
              >
                <el-input
                  v-model="params.className"
                  placeholder="请输入事部件名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="8"
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
            </el-col>
          </el-row>
        </el-form>
        <div class="ke-clear">
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
              code="refresh"
              @click="handleReload"
            >
              <svg-icon name="reset" />刷新
            </el-button>
            <import-file
              :data="filsb"
              :url="'evt/class/importEventClass'"
              :is-upload.sync="isUpload"
              text="导入大类"
            />
            <import-file
              :data="filss"
              :url="'evt/class/importEventClassSetting'"
              :is-upload.sync="isUpload"
              text="导入小类"
            />
            <el-button
              v-power  
              code="downExcel"
              icon="el-icon-download"
              @click="handleDownloadModel"
            >
              下载模板
            </el-button>  
          </div>
        </div>
        <el-table
          v-if="smallShow"
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          style="width: 100%"
          height="100%"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
          @row-dblclick="handleDbclick"
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
            prop="classCode"
            label="编码"
            align="center"
          />
          <el-table-column
            prop="className"
            label="名称"
            align="center"
          />
          <el-table-column
            prop="orderNo"
            label="排序号"
            align="orderNo"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template 
              v-if="smallShow"
              slot-scope="scope"
            >
              <el-button
                v-if="scope.row.classSetting"
                type="primary"
                size="mini"
                @click="ClassSetting(scope.row)"
              >
                修改设置
              </el-button>
              <el-button
                v-else
                type="primary"
                size="mini"
                @click="ClassSetting(scope.row)"
              >
                业务设置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          v-else
          ref="eltableCurrentRow1"
          v-loading="listLoading1"
          :data="tableData1"
          stripe
          style="width: 100%;"
          height="100%"
          @row-click="handleClickRow1"
          @selection-change="handleSelectionChange1"
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
            prop="classCode"
            label="事部件编码"
            align="center"
          />
          <el-table-column
            prop="className"
            label="事部件名称"
            align="center"
          />
          <el-table-column
            prop="orderNo"
            label="排序编码"
            align="center"
          />
          <el-table-column
            prop="disposeTimeA"
            label="一般性处置时限"
            align="center"
          />
          <el-table-column
            prop="disposeTimeB"
            label="工程性处置时限"
            align="center"
          />
          <el-table-column
            prop="disposeTimeC"
            label="特殊性处置时限"
            align="center"
          />
          <el-table-column
            align="center"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit1(scope.row)"
              >
                修改设置
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-footer>
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev, pager, next,total,jumper, sizes"
            :page-size.sync="params.rows"
            :total="params.total"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="handleSizeChange"
          />
        </el-footer>
      </el-main>
    </el-container>
    <small-add
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
    <big-add
      v-if="dialog1.visible"
      :id="id"
      :dialog.sync="dialog1"
      :selection-item="selectionItem1"
    />
    <small-dtails
      v-if="dialogDes.visible"
      :selection-item="selectionItem"
      :dialog.sync="dialogDes"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
import axios from 'axios'
@Component({
  name: 'PartManage',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    SmallAdd: () => import('./smallAdd.vue'),
    smallDtails: () => import('./smalldtails.vue'),
    BigAdd: () => import('./bigAdd.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  private show: boolean = false
  private filsb: object = {}
  private filss: object = {}
  // 详情
  private dialogDes: any = {
    title: '',
    visible: false
  }
  // 列表数据
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'text'
  }
  private expandedKeys: Array<any> = []
  private currentKey: string = ''
  private smallShow: boolean = true
  private selectionPart: object = {}
  // samll 数据开始
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private treeSelection: any = []
  private tableData: Array<any> = []
  // 选中要修改的数据
  private selectionItem: any = {}
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    parentId: '',
    className: ''
  }
  private isUpload: boolean = false
  // samll 数据结束
  // big 数据开始
  // 表格数据是否正在加载
  private listLoading1: boolean = true
  // 点击行数据
  private row1: any = {}
  private selections1: Array<any> = []
  private treeSelection1: any = []
  private tableData1: Array<any> = []
  // 选中要修改的数据
  private selectionItem1: any = {}
  private dialog1: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params1: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    parentId: '',
    className: ''
  }
  private isUpload1: boolean = false
  // big 数据结束
  created() {
    this.initTableData()
    this.initTreeData()
  }
  @Watch('isUpload')
  private handleUploadChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
      // this.initTableData1()
      this.initTreeData()
    }
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
      // this.initTableData1()
      this.initTreeData()
    }
  }
  @Watch('isUpload1')
  private handleUpload1Changed(val: boolean, oldVal: boolean): void {
    if (val === true) {
      // this.initTableData1()
      this.initTableData()
      this.initTreeData()
    }
  }
  @Watch('dialog1.isAdd')
  private handleAdd1Changed(val: boolean, oldVal: boolean): void {
    if (val === true) {
      // this.initTableData1()
      this.initTableData()
      this.initTreeData()
    }
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/evt/class/findEventClassTree',
        method: 'post',
        data: {}
      })
      .then((res: any) => {
        // console.log(res)
        this.treeData = res.data
      })
  }
  private handleNodeClick(data: any): void {
    this.selectionPart = data
    if (data.name === 'false') {
      this.smallShow = true
      this.treeSelection = data
      this.params.parentId = data.id
      this.initTableData()
    }
    // else {
    //   this.smallShow = false
    //   this.treeSelection1 = data
    //   this.params1.parentId = data.id
    //   this.initTableData1()
    // }
  }
  // samll 方法开始
  private initTableData(): void {
    this.$http
      .request({
        url: '/evt/class/findClassPage',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.listLoading = false
        this.params.total = res.total
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
  private handleDbclick(row: any): void {
    this.dialogDes.title = '详情'
    this.dialogDes.visible = true
    this.selectionItem = row
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.selectionItem = {
      classCode: '',
      className: '',
      orderNo: 0,
      parentId: '',
      id: ''
    }
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        this.selectionItem = this.selections[0]
        this.dialog.title = '修改'
        this.dialog.visible = true
        this.dialog.isAdd = false
      })
      .catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: '/evt/class/deleteClass',
            method: 'post',
            data: { ids: ids }
          })
          .then((res: any) => {
            if (res.code === 200) {
              this.$base.win.msg('成功', 'success')
              this.initTableData()
              this.initTreeData()
              this.$emit('initTreeData')
            } else {
              this.$base.win.msg(res.msg, 'error')
            }
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.params.className = ''
    this.params.parentId = ''
    this.params.page = 1
    this.initTableData()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(null)
    })
  }
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handlReset(): void {
    this.params.name = ''
    this.params.parentId = ''
    this.params.page = 1
    this.initTableData()
  }
  // samll 方法结束
  // big 方法开始
  private initTableData1(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.listLoading1 = false
    this.$http
      .request({
        url: '/evt/class/findClassPage',
        method: 'post',
        data: this.params1
      })
      .then((res: any) => {
        // debugger
        this.listLoading1 = false
        this.params1.total = res.total
        this.tableData1 = res.rows
      })
  }
  private handleClickRow1(row: any) {
    this.row1 = row
    this.$base.grid.rowClcik(
      this.$refs.eltableCurrentRow1,
      this.tableData1,
      row
    )
  }
  private handleSelectionChange1(val: Array<any>) {
    this.selections1 = val
  }
  private ClassSetting(data: any): void {
    this.$http
      .request({
        url: '/evt/class/validateEventClassSetting',
        method: 'post',
        data: {id: data.id}
      })
      .then((res: any) => {
        if (res.code === 200) {
          if (data.classSetting !== null) {
            this.handleEdit1(data)
          } else {
            this.handleAdd1(data)
          }
        } else {
          this.$base.win.msg(res.msg, 'error')
        }
      })
  }
  private handleEdit1(data: any): void {
    this.dialog1.title = '修改'
    this.dialog1.visible = true
    this.dialog1.isAdd = false
    this.id = data.classSetting.id
  }
  private handleAdd1(data: any): void {
    this.id = 0
    this.dialog1.title = '新增'
    this.dialog1.visible = true
    this.dialog1.isAdd = false
    this.selectionItem1 = {
      classCode: data.classCode,
      className: data.className,
      evtClassId: data.id, // 案件类别id
      directorDeptId: '',
      directorPerson: '',
      worktimeEnd: '',
      worktimeStart: '',
      defaultDisposeTime: '',
      isSaturdaywork: false,
      isSundaywork: false,
      isverify: false,
      verifyTime: '',
      ischeck: false,
      checkTime: '',
      use_disposeTimeB: false,
      useDisposeTimea: false,
      disposeTimea: '',
      useDisposeTimeb: false,
      disposeTimeb: '',
      useDisposeTimec: false,
      disposeTimec: '',
      isUsetime: false,
      isSendMsg: false,
      isreckon: false,
      legalstd: '',
      closedstd: '',
      note: '',
      disposalUnits: []
    }
  }
  // big 方法结束
  private handleDownloadModel() {
    axios.get('templates.zip', {
      responseType: 'blob'
    })
      .then((res) => {
        let filename = '大小类导入模板.zip'
        let file = new Blob([res.data], {type: 'application/octet-binary'})
        // IE10+
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file, filename)
        } else { // Others
          let a = document.createElement('a')
          let url = URL.createObjectURL(file)
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          setTimeout(function() {
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
          }, 0)
        }
      })
      .catch((e) => {
        this.$base.win.msg('下载模板失败', 'error')
      })
  }
}
</script>
<style scoped>
.tree-container >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style lang="scss" scoped>
.ke-body ,.ka-body {
  flex-direction: column;
  display: flex;
}
.page {
  height: 100%;
}
.main-body {
  display: flex;
  flex-flow: column;
}
.el-footer {
  height: auto !important;
}
ke-aside {
  overflow: auto;
}
.tree-container {
  height: calc(100% - 22px);
}
.form-container{
  margin-bottom: 0 !important;
}
</style>
