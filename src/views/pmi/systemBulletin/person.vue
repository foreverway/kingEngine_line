<template>
  <el-container class="ke-layout add-personnel2">
    <el-container class="ke-layout-body ke-dialog-el-main">
      <el-header height="auto">
        <div class="ke-clear">
          <div 
            v-if="types !== 1"
            class="ke-buttons ke-float-left"
          >
            <el-button @click="handleAdd">
              <svg-icon name="add" />选择
            </el-button>
            <el-button @click="del">
              <svg-icon name="remove" />删除
            </el-button>
            <el-button @click="clearAll">
              <svg-icon name="reset" />清空
            </el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-table
          ref="eltableCurrentRow"
          :data="tableData"
          stripe
          height="100%"
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
            prop="name"
            label="接收对象"
            align="center"
          />
          <!-- <el-table-column
            prop="note"
            label="备注"
            align="center"
          /> -->
        </el-table>
      </el-main>
      <el-footer height="auto">
        <el-pagination
          class="ke-page"
          layout="prev, pager, next,total,jumper"
          :total="params.total"
          :page-size.sync="params.rows"
          :current-page.sync="params.page"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
    <choice-personnel
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item.sync="selectionItem"
    />
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
@Component({
  name: '',
  components: {
    ChoicePersonnel: () => import('./choicePersonnel.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Object, default: {} }) roles!: any
  @Prop({ type: Number, default: 0 }) types !: number // 详情参数
  private selectionItem: any = this.$base.common.extend(this.roles)
  private tableData: Array<any> = []
  private selections: Array<any> = []
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    name: '',
    total: 0
  }
  created() {
    this.setList()
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.setList()
    }
  }
  private setList() {
    this.tableData = []
    // 人员
    let user = this.$base.common.extend(this.selectionItem.user)
    if (user && user.length !== 0){
      let userIds:Array<any> = []
      for (let i = 0; i < user.length; i++) {
        this.tableData.push({name: user[i].name + ' [人员]',id: user[i].id,type: 'user'})
        userIds.push(user[i].id)
      }
      this.selectionItem.userIds = userIds.join(',')
    }
    // 部门
    let dept = this.selectionItem.dept
    if (dept && dept.length !== 0){
      let deptIds:Array<any> = []
      for (let j = 0; j < dept.length; j++) {
        this.tableData.push({name: dept[j].name + ' [部门]',id: dept[j].id,type: 'dept'})
        deptIds.push(dept[j].id)
      }
      this.selectionItem.deptIds = deptIds.join(',')
    }
    // 角色
    let role = this.selectionItem.role
    if (role && role.length !== 0){
      let roleIds:Array<any> = []
      for (let t = 0; t < role.length; t++) {
        this.tableData.push({name: role[t].name + ' [角色]',id: role[t].id,type: 'role'})
        roleIds.push(role[t].id)
      }
      this.selectionItem.roleIds = roleIds.join(',')
    }
    // 巡查员
    let patrol = this.selectionItem.patrol
    if (patrol && patrol.length !== 0){
      let patrolIds:Array<any> = []
      for (let d = 0; d < patrol.length; d++) {
        this.tableData.push({name: patrol[d].name + ' [巡查员]',id: patrol[d].id,type: 'patrol'})
        patrolIds.push(patrol[d].id)
      }
      this.selectionItem.patrolIds = patrolIds.join(',')
    }
  }
  private handleAdd(): void {
    this.dialog.title = '选择人员'
    this.dialog.visible = true
    this.dialog.isAdd = false
  }
  private clearAll(): void {
    this.tableData = []
    this.selectionItem = {
      user: [],
      userIds: '',
      dept: [],
      deptIds: '',
      role: [],
      roleIds: '',
      patrol: [],
      patrolIds: ''
    }
  }
  private del(): void {
    let val = this.selections
    for (let i = 0; i < val.length; i++){
      let id = val[i].id
      for (let j = 0; j < this.tableData.length; j++){
        if (id === this.tableData[j].id){
          this.tableData.splice(j,1)
          break
        }
      }
      if (val[i].type === 'user') {
        let list = this.selectionItem.user
        let data:any = this.getDate(list,id)
        this.selectionItem.user = data.user
        this.selectionItem.userIds = data.userIds
      } else if (val[i].type === 'role') {
        let list = this.selectionItem.role
        let data:any = this.getDate(list,id)
        this.selectionItem.role = data.user
        this.selectionItem.roleIds = data.userIds
      } else if (val[i].type === 'patrol') {
        let list = this.selectionItem.patrol
        let data:any = this.getDate(list,id)
        this.selectionItem.patrol = data.user
        this.selectionItem.patrolIds = data.userIds
      } else if (val[i].type === 'dept') {
        let data:any = this.getDate(this.selectionItem.dept,id)
        this.selectionItem.dept = data.user
        this.selectionItem.deptIds = data.userIds
      }
    }
  }
  private getDate(list,id): void {
    let user:Array<any> = []
    list.forEach((item: any) => {
      if (id !== item.id){
        user.push(item)
      }
    })
    let userIds = user.map((el: any) => {
      return el.id
    })
    let param:any = {
      user: user,
      userIds: userIds
    }
    return param
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    // this.initTableData()
  }
  private commitRoles(): any {
    let data = this.$base.common.extend(this.selectionItem)
    this.$emit('update:roles', data)
  }
  @Watch('roles')
  private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
    if (this.id) {
      this.selectionItem = val
      this.setList()
    }
  }

}
</script>
<style lang="scss" scoped>
.ke-layout{
  height:440px;
}
</style>

