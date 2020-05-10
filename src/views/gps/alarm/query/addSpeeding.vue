<template>
  <el-container class="ke-layout add-personnel2">
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <ke-aside
          width="210px"
          title="导航"
          class="ke-body"
          :is-dialog="true"
        >
          <template>
            <el-tree
              ref="tree"
              node-key="id"
              :data="treeData"
              :props="defaultProps"
              highlight-current
              show-checkbox
              @node-click="handleNodeClick"
            />
          </template>
        </ke-aside>
        <el-container class="ke-layout-body ke-dialog-el-main">
          <el-form
            ref="ruleForm"
            :model="tableData"
            :rules="rules"
            label-width="110px"
          >
            <el-form-item
              label="报警类型"
              prop="type"
            >
              <el-select
                v-model="tableData.type"
                placeholder="请选择类型"
                :disabled="tableData.id"
                @change="getPrivilegeType"
              >
                <el-option
                  label="超速报警"
                  value="1"
                />
                <el-option
                  label="越界报警"
                  value="2"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="报警名称"
              prop="roleName"
            >
              <el-input
                v-model="tableData.roleName"
                class="el-input-rank"
              />
            </el-form-item>
            <el-form-item
              label="最大行驶速度(km/小时)"
              prop="areaId"
              class="ka-line20"
            >
              <el-input
                v-model.number="tableData.areaId"
                class="el-input-rank"
              />
            </el-form-item>
            <el-form-item
              label="监控开始日期"
              prop="x1"
            >
              <el-date-picker
                v-model="tableData.x1"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item
              label="监控结束日期"
              prop="x2"
            >
              <el-date-picker
                v-model="tableData.x2"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item
              label="上班时间"
              prop="x3"
            >
              <el-time-picker
                v-model="tableData.x3"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                placeholder="任意时间点" 
              />
            </el-form-item>
            <el-form-item
              label="下班时间"
              prop="x4"
            >
              <el-time-picker
                v-model="tableData.x4"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00'
                }"
                placeholder="任意时间点" 
              />
            </el-form-item>
          </el-form>
        </el-container>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'person',
  components: {
    KeAside: () => import('@/components/keAside.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'name'
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    deptId: 0,
    userName: '',
    loginName: ''
  }
  created() {
    this.tableData.type = '超速报警'
    this.initTreeData()
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/pmi/documentation/tree',
        method: 'post',
        data: {}
      })
      .then((res: any) => {
        this.treeData = res.data
      })
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/user/queryUserByCondition',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.listLoading = false
        this.params.total = res.total
        this.tableData = res.rows
      })
  }
  private handleNodeClick(data: any): void {
    this.params.deptId = Number(data.id)
    this.initTableData()
  }
  private rules:object = {
    roleName: [
      { required: true, message: '请输入报警名称', trigger: 'change' }
    ],
    x1: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ],
    x2: [
      { required: true, message: '请选择日期', trigger: 'change' }
    ],
    x3: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    x4: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    type: [
      { required: true, message: '请选择类型', trigger: 'change' }
    ],
    areaId: [
      { required: true, message: '年龄不能为空' },
      { type: 'number', message: '年龄必须为数字值' }
    ]
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          this.$emit('update:selectionItem', this.tableData)
          resolve()
        } else {
          // this.$emit('update:activeName', 'first')
          // this.$base.win.msg('必填项不能为空')
          return false
        }
      })
    })
    return res
  }
  private getPrivilegeType(index: string){
    this.$emit('setType', index)
  } 
}
</script>

<style scoped>
  .tree-container >>> .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .add-personnel1 .el-tabs__content{
    overflow-y: hidden;
  }
</style>
<style lang="scss">
  .ka-line20{
    label{
      line-height: 20px!important;
    }
  }
</style>
<style lang="scss" scoped>
  .el-main{
    max-height: 400px;
  }
  .ke-layout{
    height:400px;
  }
</style>
