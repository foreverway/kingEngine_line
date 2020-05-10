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
          :model="tableData"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item
            label="字典名称"
            prop="dictName"
          >
            <el-input 
              v-model="tableData.dictName" 
              placeholder="请输入字典名称"
              maxlength="32"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item
            label="字典编码"
            prop="dictCode"
          >
            <el-input 
              v-model="tableData.dictCode" 
              placeholder="请输入字典编码"
              maxlength="32"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item
            label="排序号"
            prop="orderNo"
          >
            <el-input
              v-model.trim="tableData.orderNo"
              placeholder="请输入排序号"
              clearable
              class="el-input-rank"
            />
          <!-- <span class="tips">* 数字越大，排序越后</span> -->
          </el-form-item>
          <el-form-item
            label="指定值"
            prop="dictValue"
          >
            <el-input 
              v-model.trim="tableData.dictValue" 
              placeholder="请输入指定值"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="上级字典"
            prop="parentId"
          >
            <el-cascader
              ref="dIdCascader"
              v-model="tableData.parentId"
              placeholder="请选择上级字典"
              :options="treeData"
              :props="defaultProps"
              :show-all-levels="false"
              clearable
            />
          </el-form-item>
          <el-form-item
            class="mb10"
            label="字典图标"
            prop="dictIcon"
          >
            <el-input
              v-model="tableData.dictIcon"
              clearable
              :disabled="true"
              placeholder="请选择字典图标"
              maxlength="128"
              show-word-limit
            >
              <svg-icon
                slot="suffix"
                class="selectIcon"
                name="ok"
                @click="handleSelectIcon()"
              />
            </el-input>
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
              maxlength="400"
              show-word-limit
            />
          </el-form-item>
        </el-form>
        <div class="opeate-buttons">
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
      </div>
    </el-dialog>
    <icon-cls
      v-if="iconDialog.visible"
      :dialog.sync="iconDialog"
      @selectIcon="selectIcon"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  components: {
    IconCls: () => import('./iconCls.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) parentDialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private saveLoading: boolean = false
  private defaultProps: any= {
    children: 'children',
    label: 'dictName',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private iconDialog: any = {
    title: '选择图标',
    visible: false
  }
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
          if (Number.isInteger(Number(value)) && (Number(value) > 0 || Number(value) === 0) && Number(value) < 256){                
            callback()
          } else {                 
            callback(new Error('请输入大于等于0小于256的数字'))           
          }             
        },             
        trigger: 'change'          
      }
    ],
    dictValue: [
      { required: true, message: '请输入有效值', trigger: 'change' },
      {            
        validator(rule,value,callback){           
          if (Number.isInteger(Number(value)) && (Number(value) > 0 || Number(value) === 0) && Number(value) < 256){                
            callback()
          } else {                 
            callback(new Error('请输入大于等于0小于256的数字'))           
          }             
        },             
        trigger: 'change'          
      }
    ]
  }
  created() {
    this.initTreeData()
  }
  @Watch('tableData.parentId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.$refs.dIdCascader.toggleDropDownVisible()
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/sys/dict/tree',
      method: 'get',
      params: {}
    }).then((res: any) => {
      this.treeData = res.data
    })
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: this.tableData.id ? `sys/dict/edit/${this.tableData.id}` : '/sys/dict/add',
      method: this.tableData.id ? 'put' : 'post',
      data: this.tableData
    }).then((res: any) => {
      if (res.code === 200 ){
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$emit('update:parentDialog', dialog)
      }
      this.saveLoading = false
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        this.saveLoading = true
        this.saveData()
      } else {
        this.$base.win.msg('必填项不能为空', 'error')
        return false
      }
    })
  }
  private cancel(): void {
    let parentDialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:parentDialog', parentDialog)
  }
  private handleSelectIcon() {
    this.iconDialog.visible = true
  }
  private selectIcon(item:any) {
    // this.tableData.dictIcon = item.iconName
    this.tableData.dictIcon = item.url
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
