<template>
  <div
    v-loading="loading"
    class="basicdetails"
  >
    <el-form
      ref="ruleForm"
      :rules="rules"
      :model="tableData"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="用户名："
                prop="userName"
              >
                {{ tableData.userName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="默认部门："
                prop="deptId"
              >
                {{ tableData.deptName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="登录名："
                prop="loginName"
              >
                {{ tableData.loginName }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="图片："
            prop="avatarUrl"
          >
            <ke-files
              ref="filesIds"
              class="kd-filesTextCenter"
              :data.sync="tableData.img"
              :ids.sync="tableData.avatarId"
              :accept="['.jpg','.png','.jpeg','.gif']"
              :limit="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="登录密码："
            prop="loginPwd"
          >
            <span v-if="tableData.loginPwd">●●●●●</span>
            <!-- {{ tableData.loginPwd }} -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="QQ号："
            prop="qqNo"
          >
            {{ tableData.qqNo }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="用户邮箱："
            prop="userMail"
          >
            {{ tableData.userMail }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="手机号："
            prop="userMobile"
          >
            {{ tableData.userMobile }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="办公电话："
            prop="userOph"
          >
            {{ tableData.userOph }}
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
      <el-form-item
        label="备注："
        prop="note"
      >
        {{ tableData.note }}
      </el-form-item>
      <el-form-item
        label="管理员："
        prop="isAdmin"
      >
        <el-checkbox 
          v-model="tableData.isAdmin"
          disabled
        >
          是
        </el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { METHODS } from 'http'
import md5 from 'js-md5'
@Component({
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: String, default: '' }) activeName !: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private rules:object = {
    userName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入用户名', trigger: 'change' }
    ],
    deptId: [
      { required: true, message: '请选择默认部门', trigger: 'change' }
    ],
    // 登录名需要做校验
    // loginName: [
    //   { required: true, validator: this.validateLoginName, trigger: 'change' }
    // ],
    loginName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入登录名', trigger: 'change' }
    ],
    loginPwd: [
      { required: true,pattern: '[^ \x22]+', message: '请输入登录密码', trigger: 'change' }
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
    this.loading = false
  }
  private formateData(): void {
    let data = this.tableData
    if (data.id) {
      data.isAdmin === 1 ? data.isAdmin = true : data.isAdmin = false
    }
  }
  @Watch('selectionItem')
  private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
    this.tableData = val
    this.formateData()
  }
}
</script>

<style lang="scss">
.basicdetails{
  .el-upload--picture-card{
    display: none
  }
}
</style>
<style lang="scss" scoped>
.basic{
  padding-right: 10px;
}
.kd-filesTextCenter{
  height: 150px!important;
}
</style>
