<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="520px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="110px"
      >
        <el-form-item
          label="已选择案件"
          prop="cases"
        >
          <el-select
            v-model="formData.cases"
            multiple
          >
            <el-option
              v-for="item in selectedData"
              :key="item.id"
              :label="item.evtCodeStr"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="收藏类别"
          prop="favouriteType"
        >
          <ke-dict
            v-model="formData.favouriteType"
            code="favouriteType"
            type="select"
          />
        </el-form-item>
        <el-form-item
          label="收藏备注"
          prop="description"
        >
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="8"
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
  name: 'Collect'
})
export default class extends Vue {
  @Prop({ type: Array, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private formData: any = {
    cases: [],
    favouriteType: '',
    description: '',
    evtIds: ''
  }
  private selectedData: Array<any> = this.$base.common.extend(this.selectionItem)
  private rules:object = {
    favouriteType: [
      { required: true, message: '请选择收藏类别', trigger: 'change' }
    ],
    description: [
      { required: true, pattern: '[^ \x22]+',message: '请输入收藏备注', trigger: 'change' }
    ],
    cases: [
      { required: true, message: '请选择案件', trigger: 'change' }
    ]
  }
  created() {
    this.formateData()
  }
  private formateData(): void {
    this.selectedData.forEach((el: any) => {
      this.formData.cases.push(el.id)
    })
  }
  private saveData(): void { // 保存/修改 接口
    this.formData.evtIds = this.formData.cases.join()
    this.$http.request({
      url: '/evt/favourite/addFavourite',
      method: 'post',
      data: this.formData
    }).then((res: any) => {
      if (res.code === 200){
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$base.win.msg('成功','success')
        this.$emit('update:dialog', dialog)
      }
    
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
