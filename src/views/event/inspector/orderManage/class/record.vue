<template>
  <el-dialog
    v-dialog-drag
    title="调整记录"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <el-table
      v-loading="listLoading"
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column
        type="index"
        align="center"
      />
      <el-table-column
        prop="scheduleTime"
        label="排班日期"
        align="center"
      />
      <el-table-column
        prop="scheduleName"
        label="班次名称"
        align="center"
      />
      <el-table-column
        prop="startTime"
        label="调后上班时间"
        align="center"
      />
      <el-table-column
        prop="endTime"
        label="调后下班时间"
        align="center"
      />
    </el-table>
    <el-footer>
      <el-pagination
        background
        class="ke-page"
        layout="prev, pager, next,total,jumper"
        :total="total"
        :current-page.sync="params.page"
        @current-change="handlePage"
      />
    </el-footer>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'TaskForm',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Object,default: { visible: false } }) dialog!: any
  private listLoading: boolean = true
  private tableData: any= []
  private params: any = {
    page: 1
  }
  private total: number = 1
  created() {
    if (this.dialog.item){
      this.params.id = this.dialog.item.id
      this.initData()
    }
  }
  private initData() {
    this.listLoading = true
    this.$http({
      url: '/obs/scheduleClass/findWsAdjustLogPage',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.tableData = res.rows
      this.total = res.total
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }
  private handlePage(val){
    this.params.page = val
    this.initData()
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
.pane-item {
  height: 100%;
}
.add-department {
  height: 470px;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
// .el-input,.el-select{
//   width: 210px;
// }
.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
