<template>
  <div class="page">
    <el-container>
      <el-container>
        <ke-aside
          class="ke-body ke-scroll"
          width="229px"
          title="导航"
        >
          <template>
            <el-scrollbar class="tree-container">
              <el-tree
                ref="currentNode"
                :data="treeData"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                highlight-current
                :check-strictly="true"
                @check-change="handleNodeClick"
              />
            </el-scrollbar>
          </template>
        </ke-aside>
        <el-main class="ke-body ka-file">
          <el-form
            class="ke-search form-container"
            label-width="90px"
          >
            <el-row class="ke-search">
              <el-col :span="6">
                <el-form-item
                  label="文件名称"
                  prop="fileName"
                >
                  <el-input
                    v-model="params.fileName"
                    placeholder="请输入文件名称"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="9"
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
              <svg-icon name="add" />新增文件夹
            </el-button>
            <el-button 
              v-power  
              code="edit"
              @click="handleEdit"
            >
              <svg-icon name="edit" />修改文件夹
            </el-button>
            <el-button 
              v-power  
              code="del"
              @click="handleDelete(2)"
            >
              <svg-icon name="remove" />删除文件夹
            </el-button>
            <el-upload
              class="upload-demo"
              drag
              :action="actionUrl"
              :headers="headers"
              multiple
              :on-success="uploadSuccess"
              :on-preview="uploadChange"
              :file-list="fileList"
            >
              <el-button 
                v-power  
                code="importExcel"
              >
                <svg-icon name="import" />上传文件
              </el-button>
            </el-upload>
            <el-button 
              v-power  
              code="del"
              @click="handleDelete(1)"
            >
              <svg-icon name="remove" />删除文件
            </el-button>
            <el-button 
              v-power  
              code="refresh"
              @click="handleReload"
            >
              <svg-icon name="reset" />刷新
            </el-button>
          </div>
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
              prop="fileName"
              label="文件名称"
              align="center"
              width="160"
            />
            <el-table-column
              prop="folderName"
              label="所属文件夹"
              align="center"
            />
            <el-table-column
              prop="uploadTime"
              label="上传时间"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <!-- <span
                  class="preview"
                  @click.stop="handlePreview"
                >[预览]</span> -->
                <span
                  class="download"
                  @click.stop="handleDownload(scope.row.filePath)"
                >[下载]</span>
              </template>
            </el-table-column>
          </el-table>
          <el-footer>
            <el-pagination
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
    </el-container>
    <add-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
import { UserModule } from '@/store/modules/user'
@Component({
  name: 'FileInfo',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    AddForm: () => import('./add.vue'),
    ImportFile: () => import('@/components/ImportFile/index.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  private fils: object = {}
  // 表格数据是否正在加载
  private listLoading: boolean = true
  private isUpload: boolean = false
  private id: number = 0
  private headers: object = {}
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private fileList: Array<any> = []
  private selectionstab: Array<any> = []
  private actionUrl: string = sessionStorage.getItem('baseURL') + 'system/file/fileUpLoad'
  
  // 获取选择项数据(修改时用)
  private selectTree: any = {}
  private tableData: Array<any> = []
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'text'
  }
  // 选中要修改的数据
  private selectionItem: any = {}
  private total: number = 0
  private parent: any = {
    parentId: 0,
    parentIds: 0
  }
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    parentId: 0,
    fileName: ''
  }
  created() {
    this.initTableData()
    this.initTreeData()
    this.headers = {
      'X-Access-Token': UserModule.token
    }
  }
  @Watch('dialog.isAdd')
  private handleVisibleChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTreeData()
      this.initTableData()
    }
  }
  @Watch('isUpload')
  private handleUploadChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
      this.initTreeData()
    }
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/system/file/fileTree',
        method: 'get',
        data: {}
      })
      .then((res: any) => {
        // console.log(res)
        this.treeData = res.data
        if (res.data.length !== 0) {
          this.parent.parentId = Number(res.data[0].id)
          this.parent.parentIds = Number(res.data[0].parentId)
        }
      })
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: '/system/file/findSysFilePage',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        // console.log(res)
        this.listLoading = false
        this.total = res.total
        this.tableData = res.rows
      })
  }
  private handleNodeClick(data: any,flg: boolean): void {
    this.selections = this.$refs.currentNode.getCheckedNodes()
    if (this.selections.length > 0) {
      this.params.parentId = Number(this.selections[0].id)
      this.parent.parentId = Number(this.selections[0].id)
      this.parent.parentIds = Number(this.selections[0].parentId)
      this.id = this.selections[0].id
      this.selectionItem = this.selections[0]
      this.selectionItem.fileName = this.selections[0].text
      this.selectionItem.parentIds = this.selections[0].parentId
    } else {
      this.params.parentId = 0
      this.parent.parentId = 0
      this.parent.parentIds = 0
      this.selectionItem = {}
      this.id = 0
    }
    this.initTableData()
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selectionstab = val
  }
  private handleAdd(): void {
    // console.log('新增')
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.id = 0
    this.selectionItem = {
      parentId: this.parent.parentId,
      parentIds: this.parent.parentIds,
      fileName: '',
      fileCode: '',
      note: ''
    }
  }
  private handleEdit(): void {
    if (this.selections.length === 1 ){
      this.dialog.title = '修改'
      this.dialog.visible = true
      this.dialog.isAdd = false
      this.id = this.selectionItem.id
    } else {
      this.$base.win.msg('请选择要修改的文件夹', 'error')
    }
    // if (this.selectionItem.parentId) {
    //   this.dialog.title = '修改'
    //   this.dialog.visible = true
    //   this.dialog.isAdd = false
    //   this.id = this.selectionItem.id
    //   console.log(this.selectionItem)
    //   debugger
    // } else {
    //   this.$base.win.msg('根目录不能修改', 'error')
    // }
  }
  private handleDelete(type: any): void {
    if (type === 2) {
      // 删除文件夹
      this.$base.win.confirm('删除提示','确认删除','warning').then(() => {
        // 对接后台
        if (this.selections.length === 0) {
          this.$base.win.msg('请至少选择一项', 'error')
          return
        }
        let flag = this.isRootFile(this.selections)
        if (flag) {
          let ids = this.selections.map(function(params,index) {
            return params.id
          }).join(',')
          this.deleteFile(type, ids)
        } else {
          this.$base.win.msg('根目录文件夹不允许删除！', 'error')
        }
      })
    } else {
      if (this.selectionstab.length === 0){
        this.$base.win.msg('请至少选择一项删除', 'error')
        return
      }
      let ids2: any = []
      for (let i = 0; i < this.selectionstab.length; i++){
        ids2.push(this.selectionstab[i].fileId)
      }
      this.deleteFile(type, ids2.join(','))
    }
    
  }
  private isRootFile(data: any): any {
    // 判断是不是根文件夹
    let arr = data.filter((x: any) => {
      return !x.parentId
    })
    if (arr.length) {
      return false
    }
    return true
  }
  private deleteFile(type, ids: string): void {
    // 删除文件接口
    this.$http
      .request({
        url: type === 2 ? '/system/file/deleteSysFile' : 'system/file/deleteAnnexe',
        method: 'post',
        data: {
          ids: ids
        }
      })
      .then((res: any) => {
        if (res.code === 200) {
          this.initTableData()
          this.initTreeData()
        }
        this.$base.win.msgJson(res)
      })
  }
  private handleReload(): void {
    // console.log('刷新')
    this.handleReset()
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    // console.log('11')
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
    this.initTableData()
  }
  private handlePreview(): void {
    console.log('预览')
  }
  private handleDownload(list): void {
    window.open(list)
  }
  private handleSearch(): void {
    // this.params.parentId = 0
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.fileName = ''
    this.params.parentId = 0
    this.params.page = 1
  }
  private uploadChange(file: any): void {
    
  }
  private uploadSuccess(response: any, file: any, fileList: any) { // 上传文件成功
    if (this.selections.length === 1 && response.code === 200){
      this.$http
        .request({
          url: 'system/file/addAnnexe',
          method: 'post',
          data: {
            annexeIds: response.data.id,
            fileId: this.id
          }
        })
        .then((res: any) => {
          if (res.code === 200) {
            this.initTableData()
            this.initTreeData()
          }
          this.$base.win.msgJson(res)
        })
    } else {
      this.$base.win.msg('请选择目标文件夹', 'error')
      this.fileList = []
    }
  }
}
</script>
<style lang="scss">
.ka-file{
  .el-upload-dragger{
    height: auto;
    width: auto;
    border: none;
  }
  .upload-demo{
    .el-upload-list{
      display: none;
    }
    display: inline-block;
    margin: 0 10px;
  }
  .ke-buttons{
    display: flex;
  }
}
</style>
<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.preview {
  color: #ff4949;
  cursor: pointer;
  margin-right: 2px;
}
.download {
  color: #1890ff;
  cursor: pointer;
}
.page,
.el-container {
  height: 100%;
}
.ke-body {
  flex-direction: column;
  display: flex;
}
.el-footer {
  height: auto !important;
}
.ke-scroll {
  overflow: auto;
}
.tree-container {
  height: calc(100% - 22px);
}
.form-container{
  margin-bottom: 0!important;
}
</style>
