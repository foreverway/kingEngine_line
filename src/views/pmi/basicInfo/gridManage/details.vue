<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
    :close-on-click-modal="false"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="tableData"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="工作网格："
              prop="gridName"
            >
              {{ tableData.gridName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="网格编码："
              prop="gridCode"
            >
              {{ tableData.gridCode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="排序号："
              prop="orderNo"
            >
              {{ tableData.orderNo }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所属区域："
            >
              {{ tableData.areaName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="备注："
          prop="note"
        >
          {{ tableData.note }}
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="cancel">
          <svg-icon name="close" />取消
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'GridManageAdd'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: Object, default: {} }) dialog!: any
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private rules: object = {
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      { type: 'number', message: '排序号必须为数字值', trigger: 'change' }
    ]
  }
  created() {
    
  }
  private cancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
</style>
