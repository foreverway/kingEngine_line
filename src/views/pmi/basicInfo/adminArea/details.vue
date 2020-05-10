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
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="区域名称："
              prop="areaName"
            >
              {{ tableData.areaName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="上级区域："
              prop="parentId"
            >
              {{ tableData.parentName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="区域编码："
              prop="areaCode"
            >
              {{ tableData.parentCode }}{{ tableData.areaCode }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="区域级别："
              prop="areaLevel"
            >
              <!-- <ke-dict 
                v-model="tableData.areaLevel" 
                code="qyjbvalue"
                :disabled="true"
              /> -->
              {{ tableData.areaLevel }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="总面积："
              prop="totalArea"
            >
              {{ tableData.totalArea }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="人口总数："
              prop="areaPeople"
            >
              {{ tableData.areaPeople }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="排序号："
              prop="orderNo"
            >
              {{ tableData.orderNo }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="备注："
              prop="note"
            >
              {{ tableData.note }}
            </el-form-item>
          </el-col>
        </el-row>
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: ''
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: Object, default: {} }) dialog!: any
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private rules: object = {
    areaName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入区域名称', trigger: 'change' }
    ],
    areaCode: [
      { required: true,pattern: '[^ \x22]+', trigger: 'change' } 
    ],
    parentId: [
      { required: true, message: '请选择上级区域', trigger: 'change' }
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
  async created() {
    const val = await this.$base.dict.dictByCode('qyjbvalue',this.tableData.areaLevel)
    this.tableData.areaLevel = val.dictName
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
