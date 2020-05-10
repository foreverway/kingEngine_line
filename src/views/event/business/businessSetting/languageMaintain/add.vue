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
          label="类别"
          prop="type"
        >
          <ke-dict
            v-model="tableData.type"
            code="cccc"
          />
        </el-form-item>
        <el-form-item
          label="起始流程"
          prop="sworkFlowTache"
        >
          <el-input
            v-model="tableData.sworkFlowTache"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="结束流程"
          prop="eworkFlowTache"
        >
          <el-input
            v-model="tableData.eworkFlowTache"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNum"
        >
          <el-input
            v-model.number="tableData.orderNum"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="常用语"
          prop="word"
        >
          <el-input
            v-model="tableData.word"
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
    type: [
      { required: true, message: '请选择类别', trigger: 'change' }
    ],
    sworkFlowTache: [
      { required: true,pattern: '[^ \x22]+', message: '请输入起始流程', trigger: 'change' }
    ],
    eworkFlowTache: [
      { required: true, message: '请输入结束流程', trigger: 'change' }
    ],
    orderNum: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      { type: 'number', message: '排序号必须为数字值', trigger: 'change' }
    ],
    word: [
      { required: true, message: '请输入常用语', trigger: 'change' }
    ]
  }
  created() {
  }
  private saveData(): void { // 保存/修改 接口
    let url = ''
    this.dialog.title === '修改' ? url = '/evt/commonLanguage/editCommonLanguage' : url = '/evt/commonLanguage/addCommonLanguage'
    this.$http.request({
      url: url,
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
