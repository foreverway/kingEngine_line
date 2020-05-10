<!-- eslint-disable no-irregular-whitespace -->
<template>
  <div
    v-loading="loading"
    class="basic"
  >
    <el-form
      ref="basicForm"
      :model="tableData"
      :rules="rules"
      label-width="120px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="工作组名称"
            prop="groupName"
          >
            <el-input
              v-model="tableData.groupName"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="所 属 区 域 "
            prop="address"
          >
            <el-select
              v-model="tableData.address"
              placeholder="深圳"
            >
              <el-option
                v-for="item in addressOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="排　序　号"
            prop="orderNo"
          >
            <el-input
              v-model="tableData.orderNo"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="备　　　注"
        prop="note"
      >
        <el-input
          v-model="tableData.note"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="250"
          show-word-limit
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { METHODS } from 'http'
import md5 from 'js-md5'
@Component({
  name: 'TaskForm'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: Object, default: {} }) roles!: object
  @Prop({ type: String, default: '' }) activeName!: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private departTree: Array<any> = []
  private tableData: any = {
    groupName: '',
    orderNo: '',
    address: '',
    note: ''
  }
  private loading: boolean = true
  private originalLoginName: String = ''
  private addressOptions: any = [
    {
      label: '宝安区',
      value: '宝安区'
    },{
      label: '南山区',
      value: '南山区'
    },{
      label: '罗湖区',
      value: '罗湖区'
    },{
      label: '福田区',
      value: '福田区'
    },{
      label: '龙岗区',
      value: '龙岗区'
    },{
      label: '盐田区',
      value: '盐田区'
    }
  ]
  private defaultProps: any = {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private rules: object = {
    groupName: [
      { required: true, message: '请输入工作组名称', trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      // eslint-disable-next-line standard/object-curly-even-spacing
      { type: 'number', message: '排序号必须为数字值', trigger: 'change' }
    ],
    note: [
      {required: false, message: '请输入备注', trigger: 'change'}
    ]
  }

  created() {
    this.formateData()
    this.loading = false
    this.originalLoginName = this.tableData.loginName
    // console.log(md5(this.tableData.loginPwd))
  }
  @Watch('tableData.deptId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.$refs.dIdCascader.toggleDropDownVisible()
  }
  private formateData(): void {
    let data = this.tableData
    console.log(data)
    if (data.id) {
      // console.log(data.is_admin)
      data.is_admin === 1 ? (data.is_admin = true) : (data.is_admin = false)
    }
    // console.log(this.tableData)
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async (valid: boolean) => {
        if (valid) {
          // console.log(this.tableData)
          let data = this.$base.common.extend(this.tableData)
          data.loginPwd = md5(data.loginPwd)
          data.is_admin === true ? (data.is_admin = 1) : (data.is_admin = 0)
          this.$emit('update:selectionItem', data)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
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
.basic {
  height: 380px;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
// .el-tabs__content{
//   padding: 0 40px;
//   box-sizing: border-box;
//   height: 350px;
// }
</style>
