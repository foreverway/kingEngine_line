<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    :modal="false"
    width="420px"
  >
    <div>
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="收藏类别"
          prop="favouriteType"
        >
          <ke-dict
            v-model="tableData.favouriteType"
            code="favouriteType"
            type="select"
          />
        </el-form-item>
        <el-form-item
          label="收藏备注"
          prop="description"
        >
          <el-input
            v-model="tableData.description"
            type="textarea"
            :rows="4"
            resize="none"
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
  name: 'collectEdit'
})
export default class extends Vue {
 @Prop({ type: Object, default: {} }) dialog !: any
 @Prop({ type: Number, default: {} }) id !: any
   private tableData: any = {
     favouriteType: '',
     description: ''
   }
  private rules:object = {
    favouriteType: [
      { required: true, message: '请选择收藏类别', trigger: 'change' }
    ],
    description: [
      { required: true, pattern: '[^ \x22]+',message: '收藏备注不能为空', trigger: 'change' }
    ]
  }
  created() {
    this.initEditData()
  }
  private initEditData():void{
    this.$http.request({
      url: '/evt/favourite/findFavouriteById',
      method: 'post',
      data: {
        id: this.id
      }
    }).then((res:any) => {
      this.tableData = res.data
    })

  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/evt/favourite/editFavourite',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      let dialog = {
        title: '',
        visible: false,
        isAdd: true
      }
      this.$base.win.msg('成功','success')
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
  .opeate-buttons{
    text-align: right;
  }
  .el-footer{
    padding: 0!important;
  }
</style>
