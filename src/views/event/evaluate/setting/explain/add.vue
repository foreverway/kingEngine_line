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
        label-width="100px"
      >
        <el-form-item
          label="上级目录"
          prop="parent"
        >
          <el-input
            v-model="tableData.parent"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="文件夹名称"
          prop="fileName"
        >
          <el-input v-model="tableData.fileName" />
        </el-form-item>
        <el-form-item
          label="文件夹编号"
          prop="fileCode"
        >
          <el-input v-model.number="tableData.fileCode" />
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
        <el-button @click="handleCancel">
          <svg-icon name="hamburger" />取消
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
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: Object, default: {} }) dialog!: any
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private rules: object = {
    fileName: [
      { required: true, message: '请输入文件夹名称', trigger: 'change' }
    ],
    fileCode: [
      { required: true, message: '请输入文件夹编号', trigger: 'change' },
      { type: 'number', message: '文件夹编号必须为数字值', trigger: 'change' }
    ]
  }
  created() {
    this.initTreeData()
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/systemFile/findSystemFileTree',
        method: 'post',
        data: {}
      })
      .then((res: any) => {
        // console.log(res)
        this.treeData = res.data
      })
  }
  private saveData(): void {
    // 保存/修改 接口
    this.$http
      .request({
        url: '/systemFile/addOrUpdateSystemFile',
        method: 'post',
        data: this.tableData
      })
      .then((res: any) => {
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
    form.validate(async (valid: boolean) => {
      if (valid) {
        // console.log(this.tableData)
        this.saveData()
      } else {
        // this.$base.win.msg('必填项不能为空')
        return false
      }
    })
  }
  private handleCancel(): void {
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
