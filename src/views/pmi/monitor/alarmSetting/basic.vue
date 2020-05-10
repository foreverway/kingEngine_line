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
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="报警类型"
            prop="name"
          >
            <el-input
              v-model="tableData.name"
              placeholder="请输入报警类型"
              clearable
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="创建时间"
            prop="createTime"
          >
            <el-input
              v-model="tableData.createTime"
              placeholder="请选择创建时间"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="报警规则"
            prop="role"
          >
            <el-input
              v-model="tableData.role"
              placeholder="请输入报警规则"
              clearable
            >
              <template slot="append">
                %
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="报警描述"
        prop="remarks"
      >
        <el-input
          v-model="tableData.remarks"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="500"
          show-word-limit
          disabled
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
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: String, default: '' }) activeName !: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private rules:object = {
    name: [
      { required: true,pattern: '[^ \x22]+', message: '请输入报警类型', trigger: 'change' }
    ],
    role: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateRole, trigger: 'change' }
    ],
    createTime: [
      { required: true,pattern: '[^ \x22]+', message: '创建时间', trigger: 'change' }
    ],
    remarks: [
      { required: true,pattern: '[^ \x22]+', message: '请输入报警描述', trigger: 'change' }
    ]
  }
  private validateRole(rule: any, value: string, callback: any) {
    if (!value) {
      return callback(new Error('请输入报警规则'))
    } 
    if (/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value)) {
      return callback()
    } 
    return callback(new Error('数字，可输入小数点后两位')) 
  }
  created() {
    this.loading = false
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.eventClass as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          this.$emit('update:selectionItem', this.tableData)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
          return false
        }
      })
    })
    return res
  }
}
</script>

<style lang="scss" scoped>
</style>
