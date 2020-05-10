<template>
  <div
    v-loading="loading"
    class="basic"
  >
    <el-form
      ref="eventClass"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <!-- {{ tableData.menuIcon }}
      {{ tableData.iconCss }} -->
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="资源名称"
            prop="menuName"
          >
            <!-- v-model.trim="tableData.menuName" -->
            <el-input
              v-model="tableData.menuName"
              placeholder="请输入资源名称"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="上级资源"
            prop="parentId"
          >
            <el-cascader
              ref="pIdCascader"
              v-model="tableData.parentId"
              placeholder="请选择上级资源"
              :options="treeData"
              :props="defaultProps"
              :show-all-levels="false"
              clearable
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="资源编码"
            prop="menuCode"
          >
            <el-input
              v-model="tableData.menuCode"
              placeholder="请输入资源编码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="资源类型"
            prop="menuType"
          >
            <ke-dict
              v-model="tableData.menuType"
              type="select"
              code="zylx"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="排序号"
            prop="orderNo"
          >
            <el-input
              v-model.trim="tableData.orderNo"
              placeholder="请输入排序号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="资源地址"
            prop="menuPath"
          >
            <el-input
              v-model="tableData.menuPath"
              placeholder="请输入资源地址"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="菜单图标"
            prop="menuIcon"
          >
            <el-input
              v-model="tableData.menuIcon"
              clearable
              placeholder="请选择或输入图标名称"
              :disabled="true"
              @change="handleIcon"
            >
              <svg-icon
                slot="suffix"
                class="selectIcon"
                name="ok"
                @click="handleSelectIcon('menuIcon')"
              />
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="系统图标"
            prop="sysIcon"
          >
            <el-input
              v-model="tableData.sysIcon"
              clearable
              placeholder="请选择或输入图标名称"
              :disabled="true"
              @change="handleIcon"
            >
              <svg-icon
                slot="suffix"
                class="selectIcon"
                name="ok"
                @click="handleSelectIcon('sysIcon')" 
              />
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="打开类型"
            prop="openType"
          >
            <ke-dict
              v-model="tableData.openType"
              type="select"
              code="dklx"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="双屏"
            prop="doubleScreen"
          >
            <el-checkbox v-model="tableData.doubleScreen">
              是
            </el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
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
    <icon-cls
      v-if="dialog.visible"
      :dialog.sync="dialog"
      @selectIcon="selectIcon"
    />
    <icon-menu
      v-if="dialogIconMenu.visible"
      :dialog.sync="dialogIconMenu"
      @selectIcon="selectIconMenu"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import IconCls from './iconCls.vue'
import IconMenu from './iconMenu.vue'
import { METHODS } from 'http'
@Component({
  components: {
    IconCls,
    IconMenu
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: String, default: '' }) activeName !: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private treeData: Array<any> = []
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private sysIcon!:string
  private defaultProps: any= {
    children: 'children',
    label: 'menuName',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private rules: any = {
    menuName: [
      { required: true, pattern: '[^ \x22]+',message: '请输入权限名称', trigger: 'change' }
    ],
    menuCode: [
      { required: true, pattern: '[^ \x22]+',message: '请输入编码',trigger: 'change' }// validator: this.validatePriviCode,
    ],
    orderNo: [
      { required: true,message: '请输入排序号', trigger: 'change' },
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
    menuIcon: [
      { required: false, message: '请上传菜单图标', trigger: 'change' }
    ],
    // sysIcon: [
    //   { required: true,message: '请上传系统图标', trigger: 'change' }
    // ],
    openType: [
      { required: true,message: '请上选择打开类型', trigger: 'change' }
    ],
    menuType: [
      { required: true, message: '请上选择资源类型', trigger: 'change' }
    ]
  }
  private dialog: any = {
    title: '选择菜单图标',
    visible: false
  }
  private dialogIconMenu: any = {
    title: '选择系统图标',
    visible: false
  }
  // private validatePriviCode(rule: any, value: string, callback: any) {
  //   if (!value) {
  //     return callback(new Error('请输入权限编码'))
  //   } 
  //   this.hasPriviCode(value).then((res: any) => {
  //     if (res) {
  //       let reg = /^[0-9a-zA-Z]+$/
  //       if (reg.test(value)) {
  //         return callback()
  //       }
  //       return callback(new Error('权限编码格式不正确'))
  //     } 
  //     return callback(new Error('权限编码存在'))     
  //   })   
  // }
  private handleChange(value,options): void {
    // this.rules.menuIcon[0].required = false
    // let menuIconNode = this.$refs.pIdCascader.getCheckedNodes()
    // if (menuIconNode[0].level === 2 || menuIconNode[0].level === 1) {
    //   this.rules.menuIcon[0].required = true
    // }
    if (value === this.tableData.id) {
      this.$base.win.msg('不能选自己', 'error')
      this.tableData.parentId = ''
    }
  }
  created() {
    this.initTreeData()
    this.loading = false
  }
  @Watch('tableData.parentId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    if (val && oldVal) {
      this.$refs.pIdCascader.toggleDropDownVisible()
    }
  }
  private handleIcon(): void { 
    // this.getOpiton()
  }
  private hasPriviCode(code: string): any { // 验证权限编码是否存在
    return this.$http.request({
      url: '/privilege/validPrivilegeCode',
      method: 'post',
      data: {
        code: code
      }
    }).then((res: any) => {
      return true
    }).catch((err: any) => {
      console.log(err)
      return false
    })
  }
  private formateData(): void {
    let data = this.tableData
    if (data.id) {
      data.doubleScreen === 0 ? data.doubleScreen = false : data.doubleScreen = true
      if (data.menuType === 0) {
        data.menuType = ''
      }
    }
    // console.log(this.tableData)
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/pmi/menu/tree',
      method: 'get',
      params: {disableId: this.tableData.id}
    }).then((res: any) => {
      this.treeData = res.data
    })
  } 
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.eventClass as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          this.tableData.doubleScreen === false ? this.tableData.doubleScreen = 0 : this.tableData.doubleScreen = 1
          this.$emit('update:selectionItem', this.tableData)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
          // this.$base.win.msg('必填项不能为空')
          return false
        }
      })
    })
    return res
  }
  private selectIcon(item:any) {
    this.tableData.sysIcon = item.iconName
  }
  private selectIconMenu(item:any) {
    this.tableData.menuIcon = item.iconName
  }
  private handleSelectIcon(field:string) {
    this.sysIcon = field
    if (field === 'sysIcon'){
      this.dialog.visible = true
    } else if (field === 'menuIcon'){
      this.dialogIconMenu.visible = true
    }
  }
  @Watch('selectionItem')
  private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
    this.tableData = val
    this.formateData()
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
  .el-input-rank{
    width: 70px;
  }
  .basic{
    height: 385px;
  }
  .selectIcon{
    cursor: pointer;
  }
</style>
