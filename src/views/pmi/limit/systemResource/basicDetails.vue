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
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="资源名称："
            prop="menuName"
          >
            {{ tableData.menuName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="上级资源："
            prop="parentId"
          >
            {{ tableData.parentName }}
            <!-- {{ tableData.parentId }} -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="资源编码："
            prop="menuCode"
          >
            {{ tableData.menuCode }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="资源类型："
            prop="menuType"
          >
            {{ tableData.menuType }}
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
            label="资源地址："
            prop="menuPath"
          >
            {{ tableData.menuPath }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="菜单图标："
            prop="menuIcon"
          >
            {{ tableData.menuIcon }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="系统图标："
            prop="sysIcon"
          >
            {{ tableData.sysIcon }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="打开类型："
            prop="openType"
          >
            {{ tableData.openType }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="双屏："
            prop="doubleScreen"
          >
            <el-checkbox 
              v-model="tableData.doubleScreen" 
              disabled
            >
              是
            </el-checkbox>
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
  private openTypeOptions: Array<any> = [
    {
      value: 1,
      label: '路由打开'
    },
    {
      value: 2,
      label: 'iframe打开'
    }
  ]
  private privilegeTypeOptions: Array<any> = [
    {
      value: 1,
      label: '资源'
    },
    {
      value: 2,
      label: '模块'
    },
    {
      value: 3,
      label: '功能'
    }
  ]
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
  // private getOpiton(): void { 
  //   this.rules.menuIcon[0].required = false
  //   this.rules.iconCss[0].required = false
  //   const flg = this.$refs.pIdCascader.getCheckedNodes()[0]
  //   if (!flg){
  //     return
  //   }
  //   if (flg.level === 1){
  //     this.rules.menuIcon[0].required = true
  //     this.rules.iconCss[0].required = true
  //   }
  // }
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
  private async formateData() {
    let data = this.tableData
    if (data.id) {
      data.doubleScreen === 0 ? data.doubleScreen = false : data.doubleScreen = true
      const val = await this.$base.dict.dictByCode('zylx',data.menuType)
      this.tableData.menuType = val.dictName
      const obj = await this.$base.dict.dictByCode('dklx',data.openType)
      this.tableData.openType = obj.dictName
      
    }
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
