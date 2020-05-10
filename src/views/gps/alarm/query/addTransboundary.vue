<template>
  <el-container class="ke-layout add-personnel2">
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <ke-aside
          width="300px"
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
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="报警类型"
                  prop="type"
                >
                  <el-select
                    v-model="tableData.type"
                    placeholder="请选择类型"
                    :disabled="tableData.id"
                    @change="setPrivilegeType"
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
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="界线类型"
                  prop="menuType"
                >
                  <el-select
                    v-model="tableData.menuType"
                    placeholder="请选择类型"
                    @change="getPrivilegeType"
                  >
                    <el-option
                      v-for="item in privilegeTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="行政区"
                >
                  <el-input
                    v-if="areaFlg"
                    v-model="tableData.roleName"
                    class="el-input-rank"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="报警名称"
                  prop="roleName"
                >
                  <el-input
                    v-model="tableData.roleName"
                    class="el-input-rank"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="界线名称"
                  prop="roleName1"
                >
                  <ke-set
                    v-model="tableData.roleName1"
                    placeholder=""
                    path="administrativeArea"
                    title="界线列表"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
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
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
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
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="设置边界"
                  prop="x8"
                >
                  <el-input
                    v-model="tableData.sysIcon"
                    placeholder="手绘边界"
                  >
                    <svg-icon
                      slot="suffix"
                      class="selectIcon"
                      name="ok"
                      title="请按道路边界，行政区域的边界，区域边界进行手绘"
                      @click="handleSelectIcon()"
                    />
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
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
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
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
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="备注"
                  prop="x4"
                >
                  <el-input
                    v-model="tableData.x11"
                    type="textarea"
                    maxlength="200"
                    show-word-limit=""
                    class="ka-textareaHeigth"  
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <div class="ka-map">
                <map-view v-if="true" />
              </div>
            </el-row>
          </el-form>
        </el-container>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import KeSet from '@/components/set/keSet.vue'
@Component({
  name: 'person',
  components: {
    KeSet,
    KeAside: () => import('@/components/keAside.vue'),
    MapView: () => import('./map.vue')
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
  private areaFlg: boolean = false
  private defaultProps: any = {
    children: 'children',
    label: 'name'
  }
  private privilegeTypeOptions: Array<any> = [
    {
      value: 1,
      label: '行政区域'
    },
    {
      value: 2,
      label: '自定义'
    }
  ]
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    deptId: 0,
    userName: '',
    loginName: ''
  }
  created() {
    this.initTreeData()
    this.tableData.type = '越界报警'
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
    roleName1: [
      { required: true, message: '请输入界线名称', trigger: 'change' }
    ],
    menuType: [
      { required: true, message: '请选择类型', trigger: 'change' }
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
    areaId: [
      { required: true, message: '年龄不能为空' },
      { type: 'number', message: '年龄必须为数字值' }
    ]
  }
  private commitRoles(): any {
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
  private handleSelectIcon() {
    debugger
  }
  private setPrivilegeType(index: string){
    this.$emit('setType', index)
  }
  private getPrivilegeType(index: Number){
    this.areaFlg = false
    if (index === 1){
      this.areaFlg = true
    }
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
  .ka-textareaHeigth{
    .el-textarea__inner{
      height: 80px;
    }
  }
</style>
<style lang="scss" scoped>
  .el-main{
    .ka-map{
      width: 100%;
      height: 190px;
    }
  }
</style>
