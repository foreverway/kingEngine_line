<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="时限名称"
          prop="limitRuleName"
        >
          <el-input
            v-model="tableData.limitRuleName"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="创建时间"
          prop="createTime"
        >
          <el-input
            v-model="tableData.createTime"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="时限规则"
          prop="timeLimit"
        >
          <el-input
            v-model.trim="tableData.timeLimit"
            type="number"
            clearable
          >
            <template slot="append">
              分钟
            </template>
          </el-input>
        </el-form-item>
        <el-form-item
          label="时限描述"
          prop="description"
        >
          <el-input
            v-model="tableData.description"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
            disabled
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
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
  name: 'TimeLimitAdd'
})
export default class extends Vue {
  @Prop({ type: String, default: '' }) limitRule !: string
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  // private tableData: any = this.$base.common.extend(this.selectionItem)
  private tableData: any = {}
  private rules:object = {
    limitRuleName: [
      { required: true, message: '请输入时限名称', trigger: 'change' }
    ],
    timeLimit: [
      { required: true,pattern: '[^ \x22]+', message: '请输入时限规则', trigger: 'blur' }
    ],
    createTime: [
      { required: true, message: '请输入创建时间', trigger: 'change' }
    ],
    description: [
      { required: true, message: '请输入时限描述', trigger: 'change' }
    ]
  }
  private validateRole(rule: any, value: string, callback: any) {
    if (!value) {
      return callback(new Error('请输入时限规则'))
    } 
    if (/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value)) {
      return callback()
    } 
    return callback(new Error('数字，可输入小数点后两位')) 
  }
  created() {
    this.initData()
  }
  private initData():void{
    this.$http.request({
      url: '/evt/timeLimitSetting/findLimitSetByLimitRule',
      method: 'post',
      data: {
        limitRule: this.limitRule
      }
    }).then((res:any) => {
      this.tableData = res.data
    })
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/evt/timeLimitSetting/addOrEditTimeLimitSetting',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
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
        this.saveData()
      } else {
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
</style>
