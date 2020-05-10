<template>
  <div>
    <el-dialog
      v-dialog-drag
      :title="parentDialog.title"
      :visible.sync="parentDialog.visible"
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
                label="字典名称："
                prop="dictName"
              >
                {{ tableData.dictName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="字典编码："
                prop="dictCode"
              >
                {{ tableData.dictCode }}
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
              <!-- <span class="tips">* 数字越大，排序越后</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="指定值："
                prop="dictValue"
              >
                {{ tableData.dictValue }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="上级字典："
                prop="parentId"
              >
                <!-- <el-cascader
                  ref="dIdCascader"
                  v-model="tableData.parentId"
                  placeholder="请选择上级字典"
                  :options="treeData"
                  :props="defaultProps"
                  :show-all-levels="false"
                  clearable
                /> -->
                {{ tableData.parentName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                class="mb10"
                label="字典图标："
                prop="dictIcon"
              >
                {{ tableData.dictIcon }}
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
        <div class="opeate-buttons">
          <el-button
            @click="cancel"
          >
            <svg-icon name="close" />取消
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  components: { }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) parentDialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private rules:object = {
    dictName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入字典名称', trigger: 'change' }
    ],
    dictCode: [
      { required: true,pattern: '[^ \x22]+', message: '请输入字典编码', trigger: 'change' }
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
    ],
    dictValue: [
      { required: true, message: '请输入有效值', trigger: 'change' }
    ]
  }
  created() {
    
  }
  private cancel(): void {
    let parentDialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:parentDialog', parentDialog)
  }
}
</script>

<style lang="scss" scoped>
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  .el-input,.el-select,.el-cascader{
    width: 100%;
  }
  // .el-input-rank{
  //   width: 170px;
  // }
  .no-margin{
    margin-bottom: 0px;
  }
</style>
