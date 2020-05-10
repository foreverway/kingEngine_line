<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
    :close-on-click-modal="false"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :rules="rules"
        :model="tableData"
        label-width="120px"
      >
        <el-form-item
          label="事部件名称："
          prop="className"
        >
          {{ tableData.className }}
        </el-form-item>
        <el-form-item
          label="事部件编码："
          prop="classCode"
        >
          {{ tableData.classCode }}
        </el-form-item>
        <el-form-item
          label="排序号："
          prop="orderNo"
        >
          {{ tableData.orderNo }}
        </el-form-item>
        <el-form-item
          label="案件类型："
          prop="parentName"
        >
          {{ tableData.parentName }}
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="handelCancel">
          <svg-icon name="close" />取消
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'SmallAdd'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private rules:object = {
    className: [
      { required: true,pattern: '[^ \x22]+', message: '请输入事部件名称', trigger: 'change' }
    ],
    classCode: [
      { required: true,pattern: '[^ \x22]+', trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      {            
        validator(rule,value,callback){            
          if (Number.isInteger(Number(value)) && (Number(value) > 0 || Number(value) === 0)){                
            callback()
          } else {                 
            callback(new Error('请输入大于等于0的数字'))           
          }             
        },             
        trigger: 'change'          
      }
    ]
  }
  created() {
    
  }
  private handelCancel(): any {
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
