<template>
  <div class="add-department">
    <el-form
      ref="ruleForm"
      label-position="right"
      class="ke-form"
      :rules="rules"
      label-width="80px"
      :model="commonLanguage"
    >
      <el-form-item
        label="类型"
        prop="type"
      >
        <el-select
          v-model="commonLanguage.type"
          placeholder="请选择类型"
        >
          <el-option
            label="系统常用语"
            value="1"
          />
          <el-option
            label="个人常用语"
            value="2"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="排序号"
        prop="orderNum"
      >
        <el-input v-model="commonLanguage.orderNum" />
      </el-form-item>
      <el-form-item
        label="常用语"
        prop="word"
      >
        <el-input
          v-model="commonLanguage.word"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <div class="opeate-buttons">
      <el-button
        @click="cancel"
      >
        <svg-icon name="hamburger" />取消
      </el-button>
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
  name: 'Add'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Boolean, default: {} }) visible !: true
  private commonLanguage: any = this.$base.common.extend(this.selectionItem)
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
    type: [
      { required: true, message: '请选择类别', trigger: 'change' }
    ],
    word: [
      { required: true, message: '请输入常用语', trigger: 'change' }
    ]
  }
  created() {

  }

  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/comLanguage/addOrUpdateCommonLanguage',
      method: 'post',
      data: this.commonLanguage
    }).then((res: any) => {
      this.$emit('update:visible', false)
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        this.saveData()
      } else {
        // this.$base.win.msg('必填项不能为空', 'error')
        return false
      }
    })
  }
  private cancel(): void {
    this.$emit('update:visible', false)
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
  .no-margin{
    margin-bottom: 0px;
  }
</style>
