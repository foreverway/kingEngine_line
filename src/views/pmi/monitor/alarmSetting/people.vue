<template>
  <div>
    <div class="ke-buttons">
      <el-button @click="handleAdd">
        <svg-icon name="add" />新增
      </el-button>
      <el-button @click="handleDelete">
        <svg-icon name="remove" />删除选中
      </el-button>
      <el-button @click="handleReload">
        <svg-icon name="reset" />刷新
      </el-button>
    </div>
    <el-table
      ref="eltableCurrentRow"
      :data="tableData"
      stripe
      height="370px"
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
        prop="userName"
        label="姓名"
        align="center"
      />
      <el-table-column
        prop="userMobile"
        label="联系电话"
        align="center"
      />
      <el-table-column
        prop="deptName"
        label="所在部门"
        align="center"
      />
    </el-table>
    <add-professional
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :select-users.sync="tableData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  components: {
    AddProfessional: () => import('@/components/set/professional.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Array, default: [] }) roles !: any
  private tableData: any = this.$base.common.extend(this.roles)
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
  }
  private handleDelete(): void {
    this.$base.grid.remove(this.selections).then((ids: string) => {
      let sIds: Array<any> = []
      this.selections.forEach((el) => {
        sIds.push(el.id)
      })
      this.tableData = this.tableData.filter((item: any) => {
        return sIds.indexOf(item.id) < 0
      })
      this.$base.win.msg('删除成功', 'success')
    }).catch(() => { })
  }
  private handleReload(): void {
    // to do
  }
  private commitRoles() {
    let res = new Promise((resolve, reject) => {
      this.$emit('update:roles', this.tableData)
      resolve()
    })
    return res
  }
}
</script>

<style lang="scss" scoped>

</style>
