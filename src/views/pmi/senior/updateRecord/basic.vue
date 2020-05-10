<template>
  <div class="basic">
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="发布时间"
        prop="deployTime"
      >
        <el-date-picker
          v-model="tableData.deployTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="请选择发布时间"
        />
      </el-form-item>
      <el-form-item
        label="系统版本"
        prop="version"
      >
        <el-input 
          v-model="tableData.version" 
          placeholder="请输入系统版本"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="tableData.remark"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="200"
          show-word-limit
        />
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
