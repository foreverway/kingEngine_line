<template>
  <div
    class="personal-info-wrapper ke-body"
  >
    <el-main>
      <el-form
        ref="ruleForm"
        :model="userInfo"
        :rules="rules"
        label-width="85px"
      >
        <el-form-item
          label="姓名"
          prop="userName"
        >
          <el-input
            v-model="userInfo.userName"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="部门"
          prop="deptName"
        >
          <el-input
            v-model="userInfo.deptName"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="电子邮箱"
          prop="userMail"
        >
          <el-input
            v-model="userInfo.userMail"
            type="email"
          />
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="userMobile"
        >
          <el-input
            v-model="userInfo.userMobile"
          />
        </el-form-item>
      </el-form>
    </el-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'PersonalInfo'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dataParams !: any
  private userInfo: any = this.$base.common.extend(this.selectionItem)
  private checkedWorks: Array<any> = []
  private worksList: Array<any> = []
  private refreshEventTime: number = 0
  private activeName: string = 'first'
  private pageName: string = '个人信息'
  private input: string = ''
  // 用户id
  private userId: number = 2
  private params: any = {}
  private loading: boolean = true
  private rules:object = {
    userName: [
      { required: true, message: '请输入用户名', trigger: 'change' }
    ],
    userMobile: [
      { validator: this.validatePhone, trigger: 'change' }
    ],
    userMail: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
    ],
    loginPwd: [
      { required: true, message: '请输入原始密码', trigger: 'change' }
    ],
    newLoginPwd: [
      { required: true, message: '新密码', trigger: 'change' }
    ],
    confirmNewLoginPwd: [
      { required: true, message: '确认密码', trigger: 'change' }
    ]
  }
  private validatePhone(rule: any, value: string, callback: any) {
    if (value) {
      if (this.$base.common.validatePhone(value)) {
        return callback()
      }
      return callback(new Error('手机号格式不正确'))

    }
    return callback()

  }
  created() {
    // UserModule.GetUserInfo(userName)
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          let data = this.$base.common.extend(this.userInfo)
          let params = {email: data.userMail,userMobile: data.userMobile}
          params = Object.assign(this.dataParams, params)
          this.$emit('update:dataParams', params)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
          return false
        }
      })
    })
    return res
  }
  @Watch('selectionItem')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.userInfo = this.$base.common.extend(val)
  }
}
</script>
<style lang="scss" scoped>
.personal-info-wrapper{
  .el-main{
    margin: 0 auto;
    padding: 0;
    .list{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      span{
        width: 130px;
        text-align: right;
        padding-right: 10px;
        color: #666;
      }
    }
    // .el-button {
    //   margin: 0 auto;
    //   display: block;
    //   margin-top: 16px;
    // }
    .oparate-buttons{
      // margin: 0 auto;
      text-align: center;
      margin-top: 26px;
    }
  }
}
</style>
