<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="800px"
  >
    <div class="add-department">
      <el-form
        :model="params"
        class="ke-search"
        label-width="80px"
      >
        <el-row>
          <el-col
            :span="10"
          >
            <el-form-item
              label="收藏类别"
            >
              <ke-dict
                v-model="params.favouriteType"
                code="favouriteType"
                type="select"
              />
            </el-form-item>
          </el-col> 
          <el-col
            :span="4"
            class="buttons"
          >
            <el-button
              class="button"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >
              查 询
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <div class="ke-buttons">
              <el-button @click="handleEdit">
                <svg-icon name="edit" />修改
              </el-button>
              <el-button @click="handleDelete">
                <svg-icon name="remove" />删除
              </el-button>
              <el-button @click="handleReload">
                <svg-icon name="reset" />刷新
              </el-button>
            </div>
          </el-col>
        </el-row>
     
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          height="300px"
          style="width: 100%"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            align="center"
          />
          <el-table-column
            align="center"
            label="案卷编号"
            prop="evtCodeStr"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="来件时间"
            prop="receiveTime"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="案件类型"
            prop="evtClassName"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            label="收藏类别"
            show-overflow-tooltip
          />
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
            @size-change="initCollectData(1)"
          />
        </el-footer>
      </el-form>
      <EventEdit
        v-if="dialogEdit.visible"
        :id="id"
        :dialog.sync="dialogEdit"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'collectList',
  components: {
    EventEdit: () => import('./collectEdit.vue')
  }
})
export default class extends Vue {
 @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private tableData:Array<any> = []
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    favouriteType: '',
    total: 0
  }
  private dialogEdit: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  created() {
    this.initCollectData()
  }
@Watch('dialogEdit.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initCollectData()
    }
  }
private initCollectData(page?:any):void{
  if (page){
    this.params.page = 1
    this.params.total = 0
  }
  this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
  this.$http.request({
    url: '/evt/favourite/findFavouritePage',
    method: 'post',
    data: this.params
  }).then((res:any) => {
    if (res.code === 200){
      this.listLoading = false
      this.tableData = res.rows
      this.params.total = res.total
    }

  })
}
private cancel(): void {
  let dialog = {
    title: '',
    visible: false,
    isAdd: false
  }
  this.$emit('update:dialog', dialog)
}
private handleClickRow(row: any) {
  this.row = row
  this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
}
private handleSelectionChange(val: Array<any>) {
  this.selections = val
}
private handlePage(currentPage: number): void {
  this.params.page = currentPage
  this.initCollectData()
}
private handleSearch(){
  this.initCollectData(1)
}
private handleEdit(): void {
  this.$base.grid.row(this.selections).then((row: any) => {
    this.id = this.selections[0].id
    this.dialogEdit.title = '收藏编辑'
    this.dialogEdit.visible = true
    this.dialog.isAdd = false
  }).catch(() => {})

}
private handleDelete(): void {
  this.$base.grid.remove(this.selections).then((ids: string) => {
    this.$http.request({
      url: '/evt/favourite/deleteFavourite',
      method: 'post',
      data: {
        ids: ids
      }
    }).then((res: any) => {
      this.$base.win.msg('成功', 'success')
      this.initCollectData()
    })
  })
    .catch(() => {})
}
private handleReload(): void {
  this.params.total = 0
  this.params.favouriteType = ''
  this.initCollectData(1)
}
}
</script>

<style lang="scss" scoped>
  .opeate-buttons{
    text-align: right;
  }
  .el-footer{
    padding: 0!important;
  }
</style>
