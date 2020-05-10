<template>
  <div
    v-loading="loading"
    class="roles-wrapper"
  >
    <el-container>
      <el-container>
        <el-main>
          <div 
            v-if="types !== 1"
            class="ke-buttons" 
          >
            <el-button @click="handleAdd">
              <svg-icon name="add" />新增
            </el-button>
            <el-button @click="handleDelete">
              <svg-icon name="remove" />删除
            </el-button>
            <el-button @click="handleRefresh">
              <svg-icon name="reset" />刷新
            </el-button>
          </div>
          <el-table
            ref="eltableCurrentRow"
            :data="tableData"
            stripe
            style="width: 100%"
            height="300px"
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
              label="用户名"
              align="center"
            />
            <el-table-column
              prop="loginName"
              label="登录名"
              align="center"
            />
            <!-- departments[0].deptName -->
            <el-table-column
              prop=""
              label="默认部门"
              align="center"
            />
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <add-roles
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :select-users.sync="selectUsers"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  components: {
    AddRoles: () => import('./addRoles.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Number, default: 0 }) types !: number // 详情参数
  @Prop({ type: Array, default: {} }) userIds !: any
  private tableData: Array<any> = this.$base.common.extend(this.userIds)
  private loading: boolean = false
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 角色弹窗选中的值
  private selectUsers: Array<any> = []
  // 选中要修改的数据
  private selectionItem: any = {}
  private total: number = 0
  private dialog: any = {
    title: '',
    visible: false
  }
  created() {
    this.initValue()
  }
  @Watch('selectUsers')
  private handleUsersChanged(val: any, oldVal: any): any {
    if (val !== oldVal) {
      this.tableData = this.tableData.concat(val)
      let hash: any = {}
      this.tableData = this.tableData.reduce((item, next) => {
        if (hash[next.id]) {
          hash[next.id] = ''
        } else {
          hash[next.id] = true && item.push(next)
        }
        // hash[next.id] ? '' : hash[next.id] = true && item.push(next)
        return item
      }, [])
    }
  }
  @Watch('userIds')
  private onDialogVisibleChanged(val: any, oldVal: any): void {
    if (this.id) {
      this.tableData = val
    }
  }
  private initValue(): void {
  }
  private commitRoles() {
    let res = new Promise((resolve, reject) => {
      let array: any = []
      this.tableData.forEach((val,key) => {
        array.push( val.id )
      })
      this.$emit('update:userIds', array)
      resolve()
    })
    return res
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
    this.dialog.title = '新增人员'
    this.dialog.visible = true
    this.selectionItem = {
    }
  }
  private handleDelete(): void {
    this.$base.grid.remove(this.selections)
      .then((ids: string) => {
        this.loading = true
        let data:Array<any> = []
        this.tableData.forEach((el) => {
          if (ids.indexOf(el.id) === -1) {
            data.push(el)
          }
        })
        this.tableData = data
        this.loading = false
      }).catch(() => { })
  }
  private handleRefresh(): void {
    this.tableData = this.$base.common.extend(this.userIds)
  }
}
</script>
<style lang="scss" scoped>
.roles-wrapper{
  // padding: 0 10px;
  box-sizing: border-box;
  height: 380px;
  // overflow-y: auto;
  .el-checkbox-group{
    .el-checkbox{
      display: block;
    }
  }
  .el-main{
    padding: 0;
  }
}
</style>
