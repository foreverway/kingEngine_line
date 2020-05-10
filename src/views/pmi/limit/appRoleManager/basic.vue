<template>
  <div
    v-loading="loading"
    class="basic"
  >
    <el-form
      ref="eventClass"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <!-- {{tableData}} -->
      <el-form-item
        label="角色名称"
        prop="name"
      >
        <el-input
          v-model="tableData.name"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="角色编码"
        prop="code"
      >
        <el-input
          v-model="tableData.code"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="是否巡查员"
        prop="is_observer"
      >
        <el-radio-group v-model="tableData.is_observer">
          <el-radio
            v-for="(item, i) in observerOptions"
            :key="i"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item
        label="状态"
        prop="dbStatus"
      >
        <el-radio-group v-model="tableData.dbStatus">
          <el-radio
            v-for="(item, i) in dbStatusOptions"
            :key="i"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item
        label="备注"
        prop="description"
      >
        <el-input
          v-model="tableData.description"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="500"
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
@Component({
  name: 'AppRoleManagerBasic'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) roles !: object
  @Prop({ type: String, default: '' }) activeName !: string
  private checked: boolean = false
  private treeData: Array<any> = []
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private observerOptions: Array<any> = [
    {
      value: 1,
      label: '是'
    },
    {
      value: 0,
      label: '否'
    }
  ]
  private dbStatusOptions: Array<any> = [
    {
      value: 1,
      label: '正常'
    },
    {
      value: 0,
      label: '删除'
    }
  ]
  private rules:object = {
    name: [
      { required: true, message: '请输入角色名称', trigger: 'change' }
    ],
    code: [
      { required: true, validator: this.validateCode, trigger: 'change' }
    ],
    is_observer: [
      { required: true, message: '请选择是否巡查员', trigger: 'change' }
    ]
  }
  private validateCode(rule: any, value: string, callback: any) {
    // console.log(value)
    if (!value) {
      return callback(new Error('请输入角色编码'))
    } 
    let reg = /^[0-9a-zA-Z]+$/
    if (reg.test(value)) {
      return callback()
    } 
    return callback(new Error('角色编码格式不正确'))      
  }
  created() {
    this.formateData()
    this.loading = false
  }
  private formateData(): void {
    let data = this.tableData
    // if (data.id) {
    // }
    console.log(this.tableData)
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.eventClass as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          // console.log(this.tableData)
          this.$emit('update:selectionItem', this.tableData)
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
  .basic{
    height: 350px;
  }
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  .el-input, .el-select, .el-cascader{
    width: 100%;
  }
  // .el-tabs__content{
  //   padding: 0 40px;
  //   box-sizing: border-box;
  //   height: 350px;
  // }
</style>
