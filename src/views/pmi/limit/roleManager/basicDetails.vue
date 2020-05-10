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
            label="角色名称："
            prop="roleName"
          >
            {{ tableData.roleName }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="角色编码："
            prop="roleCode"
          >
            {{ tableData.roleCode }}
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
            label="角色类型："
            prop="openType"
          >
            {{ tableData.roleType }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="所属区域："
            prop="areaId"
          >
            {{ tableData.areaName }}
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { METHODS } from 'http'
@Component({
  name: 'Basic'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: String, default: '' }) activeName !: string
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private rules:object = {
    roleName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入角色名称', trigger: 'change' }
    ],
    roleCode: [
      { required: true,pattern: '[^ \x22]+', message: '请输入角色编码',trigger: 'change' }
      // validator: this.validateRoleCode,
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
    this.formateData()
    this.loading = false
  }
  private hasRoleCode(code: string): any { // 验证角色编码是否存在
    return this.$http.request({
      url: '/role/validRoleCode',
      method: 'post',
      data: {
        roleCode: code
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
    console.log(this.tableData)
  }
  @Watch('selectionItem')
  private async onDialogVisibleChanged(val: boolean, oldVal: boolean) {
    this.tableData = val
    const obj = this.$base.common.extend(val)
    const list = await this.$base.dict.dictByCode('jslx',obj.roleType)
    this.tableData.roleType = list.dictName
  }
}
</script>

<style lang="scss" scoped>
  .basic{
    height: 380px;
  }
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  .el-input, .el-select, .el-cascader{
    width: 100%;
  }
  // .el-tabs__content{
  //   padding: 0 40px;
  //   box-sizing: border-box;
  //   height: 350px;
  // }
</style>
