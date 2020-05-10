<template>
  <el-dialog
    v-dialogDrag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
  >
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
          >
            <el-option
              label="系统常用语"
              :value="1"
            />
            <!-- <el-option
              label="个人常用语"
              value="2"
            /> -->
          </el-select>
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNum"
        >
          <el-input
            v-model="commonLanguage.orderNum"
            maxlength="3"
            clearable
          >
            <el-tooltip
              slot="suffix"
              content="排序号越小，排名越前"
              placement="top"
            >
              <i
                class="el-icon-info"
              />
            </el-tooltip>
          </el-input>
        </el-form-item>
        <el-form-item
          label="起始流程"
          prop="sworkFlowTache"
        >
          <el-input
            v-model="commonLanguage.sworkFlowTache"
            maxlength="20"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="结束流程"
          prop="eworkFlowTache"
        >
          <el-input
            v-model="commonLanguage.eworkFlowTache"
            maxlength="20"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item
          label="常用语"
          prop="word"
        >
          <el-input
            v-model="commonLanguage.word"
            type="textarea"
            maxlength="50"
          />
        </el-form-item>
      </el-form>
      <div class="opeate-buttons">
        <el-button
          icon="el-icon-circle-close"
          @click="handelCancel"
        >
          取消
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
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'TaskForm'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) selectionItem1 !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  private commonLanguage: any = this.$base.common.extend(this.selectionItem)
  private Language: any = this.$base.common.extend(this.selectionItem1)
  private sworkFlowTache = this.Language.source.activityName
  private eworkFlowTache = this.Language.target.activityName
  private workflowId = this.Language.processDefinitionKey
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
    ],
    orderNum: [
      { required: true, validator: this.validateOrderNo, trigger: 'change' }
    ]
  }
  created() {
    this.$set(this.commonLanguage, 'sworkFlowTache', this.sworkFlowTache)
    this.$set(this.commonLanguage, 'eworkFlowTache', this.eworkFlowTache)
    this.$set(this.commonLanguage, 'workflowId', this.workflowId)
    
  }

  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/comLanguage/addOrUpdateCommonLanguage',
      method: 'post',
      data: this.commonLanguage
    }).then((res: any) => {
      // console.log(res)
      let dialog = {
        title: '',
        visible: false,
        level: 1,
        isAdd: true
      }
      this.$emit('update:dialog', dialog)
      this.$base.win.msg('成功', 'success')
    }).catch((err: any) => {
      this.$base.win.msg(err, 'error')
    })
  }

  private validateOrderNo(rule: any, value: string, callback: any) {
    if (value === '') {
      return callback(new Error('请输入排序号'))
    }
    let reg = /^[0-9]+$/
    if (!reg.test(value)) {
      return callback(new Error('排序号必须为正整数或0'))
    }
    return callback()
  }

  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        // console.log(this.tableData)
        this.saveData()
      } else {
        // this.$base.win.msg('必填项不能为空', 'error')
        return false
      }
    })
  }
  private handelCancel(): any {
    let dialog = {
      title: '',
      visible: false,
      level: 1,
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
  .no-margin{
    margin-bottom: 0px;
  }
</style>
