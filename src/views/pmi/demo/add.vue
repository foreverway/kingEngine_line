<template>
  <div class="add-department">
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="字典名称"
            prop="dictName"
          >
            <el-input v-model="tableData.dictName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="字典编码"
            prop="dictCode"
          >
            <el-input v-model="tableData.dictCode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="排序"
            prop="orderNo"
          >
            <el-input
              v-model="tableData.orderNo"
              class="el-input-rank"
              type="number"
            />
            <span class="tips">* 数字越大，排序越后</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="指定值"
            prop="dictValue"
          >
            <el-input v-model="tableData.dictValue" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="上级字典"
            prop="parentId"
          >
            <el-cascader
              v-model="tableData.parentId"
              :options="treeData"
              :props="defaultProps"
              :show-all-levels="false"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="备注"
        prop="note"
      >
        <el-input
          v-model="tableData.note"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div class="opeate-buttons">
      <el-button><svg-icon name="hamburger" />取消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
      >
        <svg-icon name="hamburger" />保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'TaskForm'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Boolean, default: {} }) visible !: true
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
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
      { required: true, message: '请输入排序号', trigger: 'change' }
    ],
    dictValue: [
      { required: true, message: '请输入指定值', trigger: 'change' }
    ]
  }
  created() {
    this.initTreeData()
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
      this.treeData = res.data
    })
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          // console.log(this.tableData)
          this.saveData()
          this.$emit('update:visible', false)
          resolve()
        } else {
          // this.$base.win.msg('必填项不能为空')
          return false
        }
      })
    })
    return res
  }
}
</script>

<style lang="scss" scoped>
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  // .el-input,.el-select{
  //   // width: 210px;
  // }
  .el-input-rank{
    width: 70px;
  }
  .no-margin{
    margin-bottom: 0px;
  }
</style>
