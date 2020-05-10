<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
  >
    <div class="add-department">
      <el-table
        :data="items"
        stripe
        height="200px"
        style="width: 100%"
        @row-click="handleClickRow"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="index"
          width="50"
          label=""
        />
        <el-table-column
          type="selection"
          align="center"
        />
        <el-table-column
          align="center"
          label="类别"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">系统常用语</span>
            <span v-if="scope.row.type === 2">个人常用语</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sworkFlowTacheStr"
          align="center"
          label="常用语内容"
        />
        <el-table-column
          align="center"
          label="操作"
        >
          <template>
            <el-button size="mini">
              编辑
            </el-button>
            <el-button size="mini">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-footer>
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper"
          :total="total"
          @current-change="handlePage"
        />
      </el-footer>
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="类别"
          prop="dictName"
        >
          <el-select
            v-model="type"
            placeholder="请选择类别"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="dictValue"
        >
          <el-input
            v-model.number="tableData.orderNo"
          />
        </el-form-item>
        <el-form-item
          label="语句"
          prop="note"
        >
          <el-input
            v-model="tableData.orderNo"
          />
        </el-form-item>
      </el-form>
      <div class="opeate-buttons">
        <el-button
          @click="cancel"
        >
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'CommonLanguage'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  // 表格数据源
  private items: Array<any> = []
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private total: number = 0
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private value1: string = ''
  private value2: string = ''
  private type: string = ''
  private typeOptions: Array<any> = [
    {
      value: 1,
      label: '个人常用语'
    },
    {
      value: 2,
      label: '系统常用语'
    }
  ]
  private defaultProps: any= {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private ruleForm:object = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  }
  private rules:object = {
    dictName: [
      { required: true, message: '请输入字典名称', trigger: 'change' }
    ],
    dictCode: [
      { required: true, message: '请输入字典编码', trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      // eslint-disable-next-line standard/object-curly-even-spacing
      { type: 'number', message: '排序号必须为数字值', trigger: 'change'}
    ],
    dictValue: [
      { required: true, message: '请输入指定值', trigger: 'change' }
    ]
  }
  created() {
    this.initTreeData()
  }
  @Watch('tableData.parentId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.$refs.dIdCascader.toggleDropDownVisible()
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/dictionary/findDictionaryTree',
      method: 'post',
      data: {}
    }).then((res: any) => {
      // console.log(res)
      this.treeData = res.data
    })
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/dictionary/addOrUpdateDictionary',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      // console.log(res)
      let dialog = {
        title: '',
        visible: false,
        isAdd: true
      }
      this.$emit('update:dialog', dialog)
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        // console.log(this.tableData)
        this.saveData()
      } else {
        this.$base.win.msg('必填项不能为空', 'error')
        return false
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
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.items, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handlePage(currentPage: number): void {
    //
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
