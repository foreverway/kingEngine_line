<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
  >
    <el-form
      ref="ruleForm"
      class="ke-search"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="短信类型"
            prop="roleName"
          >
            <el-input
              v-model="tableData.roleName"
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
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="开启状态"
            prop="deptName"
          >
            <ke-dict code="cccc" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="短信内容"
        prop="note"
      >
        <el-input
          v-model="tableData.note"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="200"
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
        :loading="saveLoading"
        @click="submitForm"
      >
        <svg-icon name="save" />保存
      </el-button>
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
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private saveLoading: boolean = false
  private rules:object = {
    deptName: [
      { required: true, message: '请选择开启状态', trigger: 'change' }
    ],
    note: [
      { required: true, message: '请输入短信内容', trigger: 'change' }
    ]
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/dept/addOrUpdateDepartment',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      // console.log(res)
      let dialog = {
        title: '',
        visible: false,
        isAdd: true
      }
      this.saveLoading = false
      this.$emit('update:dialog', dialog)
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        this.saveLoading = true
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
