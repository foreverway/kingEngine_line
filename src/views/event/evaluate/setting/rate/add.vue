<template>
  <el-dialog
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
          label="评价等级"
          prop="rate"
        >
          <el-input
            v-model="tableData.rate"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="起始分值"
          prop="startScore"
        >
          <el-input
            v-model="tableData.startScore"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="结束分值"
          prop="endScore"
        >
          <el-input
            v-model="tableData.endScore"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="表示颜色"
          prop="color"
        >
          <el-row>
            <el-col :span="20">
              <el-input
                v-model="tableData.color"
                disabled
              />
            </el-col>
            <el-col :span="4">
              <el-color-picker
                v-model="tableData.color"
                class="color-picker"
              />
            </el-col>
          </el-row>
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
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private rules:object = {
    rate: [
      { required: true, message: '请输入评价等级', trigger: 'change' }
    ],
    startScore: [
      { required: true, message: '请输入起始分值', trigger: 'change' }
    ],
    endScore: [
      { required: true, message: '请输入结束分值', trigger: 'change' }
    ],
    color: [
      { required: true, message: '请选择颜色', trigger: 'change' }
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
.color-picker{
  margin-left: 27px;
}
</style>
