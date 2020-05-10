<template>
  <div class="basic">
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="发布时间："
        prop="deployTime"
      >
        {{ tableData.deployTime }}
      </el-form-item>
      <el-form-item
        label="系统版本："
        prop="version"
      >
        {{ tableData.version }}
      </el-form-item>
      <el-form-item
        label="备注："
        prop="remark"
      >
        {{ tableData.remark }}
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) basicData !: any
  private tableData: any = this.$base.common.extend(this.basicData)
  private pageName = '基础信息'
  private ruleForm:object = {
    name: '',
    desc: ''
  }
  private rules:object = {
    deployTime: [
      { required: true, message: '请输入选择时间', trigger: 'change' }
    ],
    version: [
      { required: true,pattern: '[^ \x22]+', message: '请输入系统版本', trigger: 'change' }
    ]
  }
  private submitBasic(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          // console.log(this.tableData)
          this.$emit('update:basicData', this.tableData)
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
  padding: 0 40px;
  box-sizing: border-box;
  height: 350px;
}
.el-date-editor{
  width: 100%;
}
</style>
