<template>
  <div>
    <el-container>
      <el-container>
        <ke-aside
          class="ke-body"
          width="381px"
          title="流程列表"
        >
          <template>
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
          </template>
        </ke-aside>
        <el-main class="ke-body">
          <div class="ke-buttons">
            <el-button
              icon="el-icon-circle-plus-outline"
              @click="handleAdd"
            >
              新增
            </el-button>
            <el-button
              icon="el-icon-edit"
              @click="handleEdit"
            >
              修改
            </el-button>
            <el-button
              icon="el-icon-delete"
              @click="handleDelete"
            >
              删除
            </el-button>
            <el-button
              icon="el-icon-refresh"
              @click="handleReload"
            >
              刷新
            </el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="items"
            stripe
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
              label="类型"
              width="120"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.type === 1">系统常用语</span>
                <span v-if="scope.row.type === 2">个人常用语</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="sworkFlowTacheStr"
              align="center"
              label="起始流程"
              width="160"
            />
            <el-table-column
              prop="eworkFlowTacheStr"
              align="center"
              label="结束流程"
              width="160"
            />
            <el-table-column
              prop="word"
              align="center"
              label="常用语"
            />
          </el-table>
          <el-pagination
            background
            class="ke-page"
            layout="prev, pager, next,total,jumper"
            :total="total"
            :current-page.sync="params.page"
            @current-change="handlePage"
          />
        </el-main>
      </el-container>
    </el-container>
    <el-dialog
      v-dialogDrag
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="560px"
    >
      <add-form
        v-if="dialog.visible"
        :id="id"
        :visible.sync="dialog.visible"
        :selection-item="selectionItem"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
  @Component({
    components: {
      KeAside: () => import('@/components/keAside.vue'),
      DdicAside: () => import('./aside.vue'),
      AddForm: () => import('./add.vue')
    }
  })
export default class extends Vue {
    private id: number = 0
    // 表格数据是否正在加载
    private listLoading: boolean = true
    private selections: Array<any> = []
    // 选中要修改的数据
    private selectionItem: any = {}
    // 表格数据源
    private items: Array<any> = []
    private treeData: Array<any> = []
    private tableData: Array<any> = []
    private tacheSelection: any = {}
    private total: number = 0
    private activeName: number = 0
    private params: any= {
      page: 1,
      rows: this.$base.grid.page,
      type: 3,
      sworkFlowTache: '',
      eworkFlowTache: '',
      word: ''
    }

    // 弹框控制
    private dialog: any = {
      title: '',
      visible: false,
      isAdd: false
    }
    // 点击行数据
    private row: any = {}
    async created() {
      this.load()
      this.initTreeData()
      // this.getTableData()
    }
    private initTreeData(): void {
      this.$http.request({
        url: '/event/queryAllFlowData',
        method: 'post',
        data: {
          allVersion: true
        }
      }).then((res: any) => {
        this.treeData = res.rows
        console.log(this.treeData)
      })
    }
    private load(): void{
      this.$http.request({
        url: '/comLanguage/findCommonLanguageByPage',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        this.listLoading = false
        this.total = res.total
        this.items = res.rows
      })
    }
    // 获取流程环节
    private getTableData(index:any, items:any):void{
      this.$http.request({
        // url: `/workTache/getWorkTacheList?processDefinitionKey=${items.processDefinitionKey}`,
        url: '/eventQuery/getWorkTacheList',
        method: 'post',
        data: {processDefinitionId: 'event_flow'}
      }).then((res: any) => {
        this.tableData = res.rows
      })
    }
    // 选中行时
    private handleSelect(row: any) {
      console.log(row)
      this.params.sworkFlowTache = row.source.activityId
      this.params.eworkFlowTache = row.target.activityId
      this.load()
      // this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
    }
    private handlePage(currentPage: number): void {
      this.params.name = ''
      this.params.page = currentPage
    }
    private handleAdd(): void {
      this.dialog.title = '新增'
      this.dialog.visible = true
      this.dialog.isAdd = false

      this.selectionItem = {
        dictName: '',
        dictCode: '',
        orderNo: '',
        dictValue: '',
        parentId: '',
        note: ''
      }
    }
    private handleEdit(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.selectionItem = this.selections[0]
        this.dialog.title = '修改'
        this.dialog.visible = true
      }).catch(() => { })
    }
    private handleClickRow(row: any) {
      this.row = row
      this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.items, row)
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleDelete(index: number, row: any): void {
      let length: any = this.selections.length
      this.$base.grid.remove(this.selections)
        .then((ids: string) => {
          this.$http.request({
            url: '/comLanguage/delCommonLanguage',
            method: 'post',
            data: this.params
          }).then((res: any) => {
            this.$base.win.msg('成功')
            if (this.selections.length === this.tableData.length && this.params.page > 1){
              this.params.page -= 1
            }
            this.load()
          })
        }).catch(() => { })
    }
    // 关闭弹出框时清空表单和验证
    @Watch('dialog.visible')
    private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
      if (val === false) {
        (this.$refs.ruleForm as ElForm).resetFields()
        this.$base.win.msg('关闭')
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
      console.log('111')
    }
}
</script>

<style lang="scss" scoped>

</style>
