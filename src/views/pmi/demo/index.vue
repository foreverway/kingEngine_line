<template>
  <div>
    <el-container>
      <el-container>
        <ddic-aside :id.sync="id" />
        <el-main class="ke-body">
          <el-row class="ke-search">
            <el-col
              :span="2"
              class="label"
            >
              字典名称：
            </el-col>
            <el-col :span="3">
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
          <div class="ke-buttons">
            <el-button @click="handleAdd">
              <svg-icon name="add" />新增文件夹
            </el-button>
            <el-button @click="handleEdit">
              <svg-icon name="edit" />修改文件夹
            </el-button>
            <el-button @click="handleDelete">
              <svg-icon name="remove" />删除文件夹
            </el-button>
            <el-button @click="handleReload">
              <svg-icon name="reset" />刷新
            </el-button>
            <import-file
              :url="'dept/importDept'"
              :is-upload.sync="isUpload"
            />
          </div>
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="tableData"
            stripe
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
              prop="dictName"
              label="字典名称"
              align="center"
              width="120"
            />
            <el-table-column
              prop="dictCode"
              label="字典编码"
              align="center"
            />
            <el-table-column
              prop="dictValue"
              label="字典值"
              align="center"
            />
            <el-table-column
              prop="parent.dictName"
              label="上级字典"
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
    </el-container>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="700px"
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

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
  @Component({
    name: 'demo',
    components: {
      DdicAside: () => import('./aside.vue'),
      AddForm: () => import('./add.vue'),
      ImportFile: () => import('@/components/ImportFile/index.vue')
    }
  })
export default class extends Vue {
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
    private dialog: any = {
      title: '',
      visible: false
    }
    private params: any= {
      page: 1,
      rows: this.$base.grid.page,
      parentId: 0,
      name: ''
    }
    private isUpload: boolean = false
    created() {
      this.initTableData()
    }
    @Watch('isUpload')
    private handleUploadChanged(val: boolean, oldVal: boolean): void {
      console.log(val)
    }
    @Watch('id')
    private handleIdChanged(val: number, oldVal: number): void {
      if (val !== oldVal) {
        // console.log(val)
        this.params.parentId = val
        this.initTableData()
      }
    }
    @Watch('dialog.visible')
    private handleVisibleChanged(val: number, oldVal: number): void {
      if (val !== oldVal) {
        // console.log(val)
        this.handleReload()
      }
    }
    private initTableData(): void {
      this.$http.request({
        url: '/dictionary/findDictionaryByPage',
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
    private handleAdd(): void {
      // console.log('新增')
      this.dialog.title = '新增'
      this.dialog.visible = true
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
        // this.id = row.id
        // console.log(this.selections)
        this.selectionItem = this.selections[0]
        this.dialog.title = '修改'
        this.dialog.visible = true
      }).catch(() => { })
    }
    private handleDelete(): void {
      this.$base.grid.remove(this.selections)
        .then((ids: string) => {
          this.$http.request({
            url: '/dictionary/delDictionary',
            method: 'post',
            data: this.params
          }).then((res: any) => {
          // console.log(res)
            this.$base.win.msg('成功')
            this.initTableData()
          })
        }).catch(() => { })
    }
    private handleReload(): void {
      // console.log('刷新')
      this.initTableData()
    }
    private handlePage(currentPage: number): void {
      // console.log('11')
      this.params.name = ''
      this.params.page = currentPage
      this.initTableData()
    }
    private handleSearch(): void {
      this.params.parentId = 0
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

<style lang="scss" scoped>
  .left-border {
    margin-left: 0
  }

</style>
