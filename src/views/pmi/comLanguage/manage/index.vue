<template>
  <el-container class="ke-layout">
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <ke-aside
          class="ke-body"
          width="381px"
          title="流程列表"
        >
          <template>
            <el-scrollbar class="tree-container">
              <el-collapse
                v-model="activeName"
                accordion
                :data="treeData"
              >
                <div
                  v-for="(item,index) in treeData"
                  :key="index"
                  @click="getTableData(index,item)"
                >
                  <el-collapse-item
                    :title="item.processDefinitionName"
                    :name="index"
                  >
                    <div>
                      <el-table
                        ref="eltableCurrentRow"
                        :data="tableData"
                        border
                        fit
                        highlight-current-row
                        style="width: 100%"
                        @row-click="handleSelect"
                      >
                        <el-table-column
                          align="center"
                          label="起始流程"
                          prop="source.activityName"
                          width="140"
                        />
                        <el-table-column
                          align="center"
                          label="操作"
                          width="68"
                        >
                          发送至
                        </el-table-column>
                        <el-table-column
                          align="center"
                          label="结束流程"
                          prop="target.activityName"
                        />
                      </el-table>
                    </div>
                  </el-collapse-item>
                </div>
              </el-collapse>
            </el-scrollbar>
          </template>
        </ke-aside>
        <el-container class="ke-layout-body">
          <el-header height="auto">
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
              <!-- <el-button @click="handleLanguage">
                <svg-icon name="reset" />常用语
              </el-button> -->
            </div>
          </el-header>
          <el-main>
            <el-table
              ref="itemsRow"
              v-loading="listLoading"
              :data="items"
              stripe
              height="100%"
              style="width: 100%"
              @row-click="handleClickRow"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="index"
                width="50"
                label=""
              />
              <el-table-column
                type="selection"
                align="center"
              />
              <el-table-column
                align="center"
                label="类别"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 1">系统常用语</span>
                  <span v-if="scope.row.type === 2">个人常用语</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="word"
                align="center"
                label="常用语内容"
              />
              <el-table-column
                prop="sworkFlowTache"
                align="center"
                label="起始流程"
              />
              <el-table-column
                prop="eworkFlowTache"
                align="center"
                label="结束流程"
              />
              <el-table-column
                prop="createUserName"
                align="center"
                label="创建人"
              />
            </el-table>
          </el-main>        
          <el-footer height="auto">
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
        </el-container>
      </el-container>
      <add-form
        v-if="dialog.visible"
        :id="id"
        :dialog.sync="dialog"
        :selection-item="selectionItem"
      />
      <common-language 
        v-if="languageDialog.visible"
        :dialog.sync="languageDialog"
      />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
  @Component({
    components: {
      KeAside: () => import('@/components/keAside.vue'),
      AddForm: () => import('./add.vue'),
      CommonLanguage: () => import('./commonLanguage.vue')
    }
  })
export default class extends Vue {
    public $refs: any = { quickEntry: HTMLFormElement }
    private id: number = 0
    // 表格数据是否正在加载
    private listLoading: boolean = true
    private selections: Array<any> = []
    // 表格数据源
    private items: Array<any> = []
    private treeData: Array<any> = []
    private tableData: Array<any> = []
    private tacheSelection: any = {}
    private total: number = 0
    private activeName: number = 0
    // 选中要修改的数据
    private selectionItem: any = {
      type: 1,
      sworkFlowTache: '',
      eworkFlowTache: '',
      sworkTacheName: '',
      eworkTacheName: '',
      orderNum: 0,
      word: '',
      flowId: '' // 流程id
    }
    private params: any= {
      total: 0,
      page: 1,
      rows: this.$base.grid.page,
      sworkFlowTache: '',
      eworkFlowTache: '',
      flowId: '' // 流程id
    }

    // 弹框控制
    private dialog: any = {
      title: '',
      visible: false
    }
    // 常用语弹框控制
    private languageDialog: any = {
      title: '',
      visible: false
    }
    // 点击行数据
    private row: any = {}
    async created() {
      this.load()
      this.initTreeData()
    }
    private load(): void{
      this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
      this.$http.request({
        url: '/evt/commonLanguage/findCommonLanguagePage',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        this.listLoading = false
        this.total = res.total
        this.items = res.rows
      })
    }
    private initTreeData(): void {
      this.$http.request({
        url: '/evt/event/getWorkTacheList',
        method: 'post',
        data: {
          allVersion: true
        }
      }).then((res: any) => {
        this.treeData = res.data
        this.getTableData(0,this.treeData)
        console.log(res.data)
      })
    }
    // 获取流程环节
    private getTableData(index:any, items:any):void{
      this.tableData = this.treeData[index].activityList
      this.selectionItem.flowId = this.treeData[index].processDefinitionId
      this.params.flowId = this.treeData[index].processDefinitionId
    }
    // 选中行时
    private handleSelect(row: any) {
      this.selectionItem.sworkFlowTache = row.source.activityId
      this.selectionItem.eworkFlowTache = row.target.activityId
      this.selectionItem.sworkTacheName = row.source.activityName
      this.selectionItem.eworkTacheName = row.target.activityName
      this.params.sworkFlowTache = row.source.activityId
      this.params.eworkFlowTache = row.target.activityId
      this.load()
      // this.$refs.eltableCurrentRow.toggleRowSelection(this.tableData[0],true)
      // this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
    }
    private handlePage(currentPage: number): void {
      this.params.name = ''
      this.params.page = currentPage
    }
    private handleSizeChange(currentPage: number): void {
      this.params.sworkFlowTache = ''
      this.params.eworkFlowTache = ''
      this.params.flowId = ''
      this.params.page = 1
      this.params.rows = currentPage
      this.load()
    }
    // private handleLanguage(): void {
    //   this.languageDialog.title = '常用语'
    //   this.languageDialog.visible = true
    // }
    private handleAdd(): void {
      if (this.selectionItem.eworkTacheName) {
        this.id = 0
        this.dialog.title = '新增'
        this.dialog.visible = true
      } else {
        this.$base.win.msg('请选择一条流程')
      }
      
    }
    private handleEdit(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.id = this.selections[0].id
        this.dialog.title = '修改'
        this.dialog.visible = true
      }).catch(() => { })
    }
    private handleClickRow(row: any) {
      this.row = row
      this.$base.grid.rowClcik(this.$refs.itemsRow, this.items, row)
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleDelete(index: number, row: any): void {
      this.$base.grid.remove(this.selections)
        .then((ids: string) => {
          this.$http.request({
            url: '/evt/commonLanguage/deleteCommonLanguage',
            method: 'post',
            data: {ids: ids}
          }).then((res: any) => {
            if (res.code === 200) {
              this.$base.win.msg('成功')
              this.load()
            } else {
              this.$base.win.msg(res.msg,'error')
            } 
          })
        }).catch(() => { })
    }
    // 关闭弹出框时清空表单和验证
    @Watch('dialog.visible')
    private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
      // if (val === false) {
      //   (this.$refs.ruleForm as ElForm).resetFields()
      //   this.$base.win.msg('关闭')
      // }
    }
    @Watch('dialog.isAdd')
    private handleAddChanged(val: boolean, oldVal: boolean): void {
      if (val === true) {
        this.load()
      }
    }
    private shallowCopy(src: Array<any>): any {
      let res: any = {}
      for (let prop in src) {
        if (src.hasOwnProperty(prop)) {
          res[prop] = src[prop]
        }
      }
      return res
    }
    private handleReload(): void {
      this.load()
    }
}
</script>

<style scoped>
.tree-container >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style lang="scss" scoped>
.tree-container {
  height: calc(100% - 22px);
}
</style>
