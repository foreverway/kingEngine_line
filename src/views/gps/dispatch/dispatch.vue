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
            <el-row>
              <el-col :span="24">
                <el-form-item
                  label="报警类型"
                  prop="dictName"
                >
                  <el-radio-group v-model="tableData.radio">
                    <el-radio :label="3">
                      文本指令
                    </el-radio>
                    <el-radio :label="6">
                      报文指令
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
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
              <el-col
                :span="24"
                class="ka-dispatch-bt-center"
              >
                <el-button
                  type="primary"
                  @click="submitForm"
                >
                  <svg-icon name="save" />发送
                </el-button>
              </el-col>
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
@Component({
  name: 'person',
  components: {
    KeAside: () => import('@/components/keAside.vue')
  }
})
export default class extends Vue {
  private tableData: any = {
    radio: 3
  }
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'text'
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    deptId: 0,
    userName: '',
    loginName: ''
  }
  created() {
    this.initTreeData()
  }
  private rules:object = {}
  private initTreeData(): void {
    this.$http
      .request({
        url: '/dept/getDepartTreeData',
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
  private submitForm(): any {
    // let form = this.$refs.ruleForm as ElForm
    // form.validate(async(valid: boolean) => {
    //   if (valid) {
    //     // console.log(this.tableData)
    //     this.saveData()
    //   } else {
    //     this.$base.win.msg('必填项不能为空', 'error')
    //     return false
    //   }
    // })
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
<style lang="scss" scoped>
  .ke-layout{
    height:100%;
    .ka-dispatch-bt-center{
      text-align: center;
    }
  }
</style>
