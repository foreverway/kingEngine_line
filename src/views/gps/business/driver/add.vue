<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="90px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="姓名"
              prop="dictName"
            >
              <el-input
                v-model="tableData.dictName"
                class="el-input-rank"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="性别"
              prop="dictCode"
            >
              <el-select v-model="tableData.x7">
                <el-option 
                  label="未知"
                  value="0"
                />
                <el-option 
                  label="男" 
                  value="1"
                />
                <el-option 
                  label="女" 
                  value="2"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="工卡号"
              prop="dictValue"
            >
              <el-input
                v-model="tableData.dictCode"
                class="el-input-rank"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="身份证号"
              prop="dictCode"
            >
              <el-input
                v-model="tableData.dictCode"
                class="el-input-rank"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="驾驶证号"
              prop="dictValue"
            >
              <el-input
                v-model="tableData.dictCode"
                class="el-input-rank"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="从业资格证"
              prop="dictValue"
            >
              <el-input
                v-model="tableData.dictCode"
                class="el-input-rank"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="发证机关"
              prop="dictValue"
            >
              <el-input
                v-model="tableData.dictCode"
                class="el-input-rank"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="联系电话"
              prop="dictValue"
            >
              <el-input
                v-model="tableData.dictCode"
                class="el-input-rank"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否在职"
              prop="dictValue"
            >
              <el-select v-model="tableData.x1">
                <el-option 
                  label="未知" 
                  value="0"
                />
                <el-option 
                  label="在职" 
                  value="1"
                />
                <el-option 
                  label="离职" 
                  value="2"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="备注"
              prop="SP07"
            >
              <el-input
                v-model="tableData.x11"
                type="textarea"
                maxlength="200"
                show-word-limit=""
              />
            </el-form-item>
          </el-col>
        </el-row>
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
  name: ''
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private value1: string = ''
  private value2: string = ''
  private classes: string = ''
  private classesOptions: Array<any> = [
    {
      value: 1,
      label: '上午班'
    },
    {
      value: 2,
      label: '下午班'
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
}
</script>

<style lang="scss" scoped>
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  .el-input,.el-select,.el-cascader{
    width: 100%;
  }
  // .el-input-rank{
  //   width: 170px;
  // }
  .no-margin{
    margin-bottom: 0px;
  }
</style>
