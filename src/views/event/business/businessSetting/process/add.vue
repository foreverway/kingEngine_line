<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="560px"
  >
    <div class="add-systemMaintain">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="流程名称"
          prop="name"
        >
          <el-input
            v-model="tableData.name"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="流程编码"
          prop="code"
        >
          <el-input
            v-model="tableData.code"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="版本号"
          prop="version"
        >
          <el-input
            v-model="tableData.version"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="状态"
          prop="dbStatus"
        >
          <ke-dict
            v-model="tableData.dbStatus"
            code="cccc"
          />
        </el-form-item>
        <el-form-item
          label="排序编号"
          prop="orderNo"
        >
          <el-input
            v-model.number="tableData.orderNo"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="note"
        >
          <el-input
            v-model="tableData.note"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
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
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private rules:object = {
    name: [
      { required: true, message: '请输入流程名称', trigger: 'change' }
    ],
    code: [
      { required: true, message: '请输入流程编码', trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      { type: 'number', message: '排序号必须为数字值', trigger: 'change' }
    ]
  }
  created() {
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
</style>
