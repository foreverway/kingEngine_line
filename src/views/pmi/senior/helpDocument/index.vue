<template>
  <div class="page">
    <el-container>
      <ke-aside
        class="ke-body ke-scroll"
        width="229px"
        title="系统帮助文档导航"
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
      <el-main class="ke-body">
        <el-form
          class="ke-search form-container"
          label-width="90px"
        >
          <el-row class="ke-search">
            <el-col :span="6">
              <el-form-item
                label="文件名称"
                prop="docDescribe"
              >
                <el-input
                  v-model="params.docDescribe"
                  placeholder="请输入文件名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="上传时间">
                <el-date-picker
                  v-model="params.startTime"
                  placeholder="请选择日期时间"
                  type="datetime"
                  :picker-options="beginTimeOption"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="至"
                class="ke-center"
                label-width="35px"
              >
                <el-date-picker
                  v-model="params.endTime"
                  placeholder="请选择日期时间"
                  type="datetime"
                  :picker-options="endTimeOption"
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
            code="uploadFile"
            @click="handleAdd"
          >
            <svg-icon name="add" />上传文件
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
          style="width: 100%;"
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
            prop="docDescribe"
            label="文件名称"
            align="center"
            width="180"
          />
          <el-table-column
            prop="docTypeStr"
            align="center"  
            label="文件类型"
          />
          <el-table-column
            align="center"
            label="上传时间"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime | dateFormat('yyyy-MM-dd HH:mm:ss') }}</span>
            </template>
          </el-table-column>
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
                v-if="scope.row.annexeList.length !== 0"
                class="download"
                @click.stop="handleDownload(scope.row.annexeList)"
              >[查看]</span>
            </template>
          </el-table-column>
        </el-table>
        <el-footer>
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev, pager, next,total,jumper, sizes"
            :total="params.total"
            :page-size.sync="params.rows"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="handleSizeChange"
          />
        </el-footer>
      </el-main>
    </el-container>
    <add-form
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    />
    <view-Enclosure
      v-if="enclosure.visible"
      :enclosure.sync="enclosure"
      :enclosure-item="enclosureItem"
    />
    <event-details
      v-if="dialogDes.visible"
      :selection-item="selectionItem"
      :dialog.sync="dialogDes"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
import dateFormatFilter from '@/utils/filters/dateFormat'
@Component({
  name: 'HelpDocument',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    AddForm: () => import('./add.vue'),
    EventDetails: () => import('./details.vue'),
    viewEnclosure: () => import('./enclosureItem.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 详情
  private dialogDes: any = {
    title: '',
    visible: false
  }
  // 获取选择项数据(修改时用)
  private selectTree: any = ''
  private tableData: Array<any> = []
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'dictName'
  }
  private enclosureItem: Array<any> = []
  // 选中要修改的数据
  private selectionItem: any = {}
  // 选择的日期
  private date: string = ''
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private enclosure: any = {
    title: '',
    visible: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    docType: 0,
    docDescribe: '',
    startTime: '',
    endTime: ''
  }
  async created() {
    await this.initTreeData()
    await this.initTableData()
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  private async initTreeData() {
    let obj = await this.$base.dict.getItems('sysHelpDoc')
    // let a = this.$base.dict.dictByCode('userType',1)
    if (obj.length > 0){
      obj[0].children = await this.$base.dict.getItems('sysHelpDocs')
      this.treeData = obj
    }
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: '/pmi/sysHelp/getSysHelp',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.listLoading = false
        if (!res.rows){
          this.tableData = []
        } else {
          this.tableData = res.rows
        }
      })
  }
  
  private handleNodeClick(data: any): void {
    this.selectTree = ''
    if (!data.children){
      this.selectTree = data.id
    }
    this.params.type = data.id
    this.initTableData()
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private beginTimeOption = {
    disabledDate: (time) => {
      let endDateVal = this.params.endTime
      if (endDateVal) {
        return time.getTime() > (new Date(endDateVal).getTime() - 60000 * 60)
      }
    }
  }
  private endTimeOption = {
    disabledDate: (time) => {
      let beginDateVal = this.params.startTime
      if (beginDateVal) {
        return (
          time.getTime() < (new Date(beginDateVal).getTime() + 60000 * 60)
        )
      }
    }
  }
  private handleAdd(): void {
    this.dialog.title = '上传'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.selectionItem = {
      annexeId: '',
      docDescribe: '',
      docType: this.selectTree,
      orderNum: 0
      // sysFile: this.selectTree.id,
      // parent: this.selectTree.text
    }
  }
  private handleDbclick(row: any): void {
    this.dialogDes.title = '详情'
    this.dialogDes.visible = true
    this.selectionItem = row
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
  private handleDelete(type: any): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        // console.log(this.isRootFile(this.selections))
        if (type === 2) {
          // 删除文件夹
          let flag = this.isRootFile(this.selections)
          if (flag) {
            this.deleteFile(type, ids)
          } else {
            this.$base.win.msg('根目录文件夹不允许删除！', 'error')
          }
        } else {
          this.deleteFile(type, ids)
        }
      })
      .catch(() => {})
  }
  private isRootFile(data: any): any {
    // 判断是不是根文件夹
    let arr = data.filter((x: any) => {
      return !x.parent
    })
    if (arr.length) {
      return false
    }
    return true
  }
  private deleteFile(type: number, ids: string): void {
    // 删除文件接口
    this.$http
      .request({
        url: '/systemFile/delSystemFile',
        method: 'post',
        data: {
          file_type: type,
          ids: ids
        }
      })
      .then((res: any) => {
        // console.log(res)
        this.$base.win.msg('成功', 'success')
        this.initTableData()
      })
  }
  private handleReload(): void {
    this.handleReset()
    this.initTableData()
    this.$nextTick(() => {
      this.$refs.tree.setCurrentKey(null)
    })
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
    this.initTableData()
  }
  // private handlePreview(): void {
  //   console.log('预览')
  // }
  private handleDownload(list): void {
    this.enclosureItem = list
    this.enclosure.title = '查看附件'
    this.enclosure.visible = true
  }
  private handleSearch(): void {
    if (this.params.startTime) {
      this.params.startTime = dateFormatFilter(new Date(this.params.startTime), 'yyyy-MM-dd HH:mm:ss')
    }
    if (this.params.endTime) {
      this.params.endTime = dateFormatFilter(new Date(this.params.endTime), 'yyyy-MM-dd HH:mm:ss')
    }
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.docDescribe = ''
    this.params.page = 1
    this.params.startTime = '' 
    this.params.endTime = ''
    this.params.docType = 0
    console.log(this.params)
  }
}
</script>
<style scoped>
.tree-container >>> .el-scrollbar__wrap{
  overflow-x: hidden;
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
.el-footer {
  height: auto !important;
}
.ke-body {
  display: flex;
  flex-flow: column;
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
