<template>
  <div class="department-wrapper">
    <el-container>
      <el-main>
        <div 
          v-if="types !== 1"
          class="operate-buttons" 
        >
          <el-button @click="handleAdd">
            <svg-icon name="add" />新增
          </el-button>
          <el-button @click="handleDelete">
            <svg-icon name="remove" />清除选中
          </el-button>
        </div>
        <el-table
          ref="eltableCurrentRow"
          :data="tableData"
          stripe
          height="240"
          style="width: 100%;"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column type="index">
          </el-table-column> -->
          <el-table-column type="selection" />
          <el-table-column
            prop="system"
            label="系统名称"
            align="center"
          />
          <el-table-column
            prop="content"
            label="发布明细"
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
    <add-details
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :add-detail.sync="addDetail"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  components: {
    AddDetails: () => import('./addDetails.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: [] }) items !: any
  @Prop({ type: Number, default: 0 }) types !: number // 详情参数
  private pageName: string = '部门管理'
  private tableData = this.$base.common.extend(this.items)
  private input: string = ''
  // 新增弹窗的数据
  private addDetail: any = {}
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private total: number = 0
  private dialog: any = {
    title: '',
    visible: false
  }
  created() {
    console.log(this.tableData)
    if (this.tableData.length) {
      this.tableData.forEach((el: any, i: any) => {
        el.rank = i
      })
    }
  }
  @Watch('addDetail')
  private handleAddChanged(val: object, oldVal: object): void {
    if (val !== oldVal) {
      this.tableData.push(val)
    }
  }
  private handlePage(val: Array<any>) {
    // console.log(`每页 ${val} 条`);
  }
  private handleAdd(): void {
    this.id = 0
    this.dialog.title = '新增'
    this.dialog.visible = true
  }
  private handleEdit(): void {
    this.$base.grid.row(this.selections).then((row: any) => {
      this.id = row.id
      this.dialog.title = '修改'
      this.dialog.visible = true
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
        let ranks: Array<any> = []
        this.selections.forEach((el) => {
          ranks.push(el.rank)
        })
        // console.log(ranks)
        this.tableData = this.tableData.filter((item: any) => {
          return ranks.indexOf(item.rank) < 0
        })
        this.$base.win.msg('删除成功', 'success')
      }).catch(() => { })
  }
  private commitDetail(): any {
    let res = new Promise((resolve, reject) => {
      this.$emit('update:items', this.tableData)
      resolve()
    })
    return res
  }
}
</script>
<style lang="scss" scoped>
.department-wrapper{
  // padding: 0 10px;
  box-sizing: border-box;
  height: 350px;
  // overflow-y: auto;
  padding-bottom: 20px;
  .tc{
    text-align: center;
  }
  .el-main{
    // margin-left: 12px;
    flex: 1;
    background: #fff;
    border-radius: 4px;
    padding: 0px;
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
    .el-table{
      margin-bottom: 10px;
      // height: 240px;
    }
  }
}
</style>
