<template>
  <el-container class="ke-layout">
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <ke-aside
          class="ke-body ke-scroll"
          width="229px"
          title="导航"
        >
          <template>
            <el-scrollbar class="tree-container">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                highlight-current
                @node-click="handleNodeClick"
              />
            </el-scrollbar>
          </template>
        </ke-aside>
        <el-container class="ke-layout-body">
          <el-header height="auto">
            <el-form
              class="ke-search"
              label-width="80px"
            >
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label="文件名称"
                  >
                    <el-input
                      v-model="params.name"
                      clearable
                    />
                  </el-form-item>
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
            </el-form>
            <div class="ke-buttons">
              <el-button @click="handleAdd">
                <svg-icon name="add" />新增文件夹
              </el-button>
              <el-button @click="handleEdit">
                <svg-icon name="edit" />修改文件夹
              </el-button>
              <el-button @click="handleDelete(2)">
                <svg-icon name="remove" />删除文件夹
              </el-button>
              <el-button @click="handleDelete">
                <svg-icon name="remove" />上传文件
              </el-button>
              <el-button @click="handleDelete(1)">
                <svg-icon name="remove" />删除文件
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
              />
              <el-table-column
                type="selection"
                align="center"
              />
              <el-table-column
                prop="roleCode"
                label="文件名称"
                align="center"
                width="120"
              />
              <el-table-column
                prop="roleCode"
                label="所属文件夹"
                align="center"
              />
              <el-table-column
                prop="roleName"
                label="上传时间"
                align="center"
              />
              <el-table-column
                prop="parent.note"
                label="操作"
                align="center"
              >
                <template>
                  <span
                    class="preview"
                    @click.stop="handlePreview"
                  >[预览]</span>
                  <span
                    class="download"
                    @click.stop="handleDownload"
                  >[下载]</span>
                </template>
              </el-table-column>
            </el-table>
          </el-main>
          <el-footer height="auto">
            <el-pagination
              background
              class="ke-page"
              :page-sizes="[10,20,30,50,100]" 
              layout="prev, pager, next,total,jumper, sizes"
              :total="params.total"
              :page-size.sync="params.rows"
              :current-page.sync="params.page"
              @current-change="handlePage"
            />
          </el-footer>
        </el-container>
      </el-container>
      <add-form
        v-if="dialog.visible"
        :id="id"
        :dialog.sync="dialog"
        :selection-item="selectionItem"
      />
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'Explain',
  components: {
    KeAside: () => import('@/components/keAside.vue'),
    AddForm: () => import('./add.vue')
  }
})
export default class extends Vue {
  // 表格数据是否正在加载
  private listLoading: boolean = true
  private id: number = 0
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据(修改时用)
  private selectTree: any = {}
  private tableData: Array<any> = [
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    },
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    },
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    },
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    },
    {
      roleCode: '部门一',
      roleName: '张三',
      note: '备注11'
    },
    {
      roleCode: '部门ee',
      roleName: '李四',
      note: '备注22'
    }
  ]
  private treeData: Array<any> = [
    {
      text: '图片',
      children: [
        {
          text: '美术'
        }
      ]
    },
    {
      text: '音乐',
      children: [
        {
          text: 'heiyou'
        }
      ]
    },
    {
      text: '唱歌',
      children: [
        {
          text: 'sing'
        }
      ]
    }
  ]
  private defaultProps: any = {
    children: 'children',
    label: 'text'
  }
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
    parentId: 0,
    name: ''
  }
  created() {
    // this.initTableData()
    // this.initTreeData()
    this.listLoading = false
  }
  @Watch('dialog.isAdd')
  private handleVisibleChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      // console.log(val)
      this.initTreeData()
      this.initTreeData()
    }
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/systemFile/findSystemFileTree',
        method: 'post',
        data: {}
      })
      .then((res: any) => {
        // console.log(res)
        this.treeData = res.data
      })
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http.request({
      url: '/systemFile/findSystemFileByPage',
      method: 'post',
      data: this.params
    }).then((res: any) => {
      // console.log(res)
      this.listLoading = false
      this.params.total = res.total
      this.tableData = res.rows
    })
  }
  private handleNodeClick(data: any): void {
    this.params.parentId = Number(data.id)
    // this.initTableData()
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleAdd(): void {
    // console.log('新增')
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.selectionItem = {
      fileName: '',
      fileCode: '',
      sysFile: this.selectTree.id,
      parent: this.selectTree.text,
      note: ''
    }
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        // this.id = row.id
        // console.log(this.selections)
        this.selectionItem = this.selections[0]
        if (this.selectionItem.parent) {
          this.dialog.title = '修改'
          this.dialog.visible = true
          this.dialog.isAdd = false
        } else {
          this.$base.win.msg('不能编辑目录文件夹', 'error')
        }
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
    // console.log('刷新')
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    // console.log('11')
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handlePreview(): void {
    console.log('预览')
  }
  private handleDownload(): void {
    console.log('下载')
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
}
</script>
<style scoped>
.tree-container >>> .el-scrollbar__wrap {
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
.tree-container {
  height: calc(100% - 22px);
}
</style>
