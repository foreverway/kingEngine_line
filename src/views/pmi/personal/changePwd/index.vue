<template>
  <div
    class="personal-info-wrapper ke-body"
  >
    <el-main>
      <el-form
        ref="ruleForm"
        :model="params"
        :rules="rules"
        label-width="110px"
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
          label="原始密码"
          prop="secrit"
        >
          <el-input
            v-model="params.secrit"
            type="password"
            auto-complete="new-password"
            autocomplete="off"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item
          label="新密码"
          prop="newLoginPwd"
        >
          <el-input
            v-model="params.newLoginPwd"
            type="password"
            auto-complete="new-password"
            autocomplete="off"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item
          label="确认新密码"
          prop="confirmNewLoginPwd"
        >
          <el-input
            v-model="params.confirmNewLoginPwd"
            type="password"
            auto-complete="new-password"
            autocomplete="off"
            show-password
            clearable
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
import md5 from 'js-md5'
@Component({
  name: 'ChangePwd'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dataParams !: any
  private userInfo: any = this.$base.common.extend(this.selectionItem)
  private pageName: string = '个人信息'
  private input: string = ''
  // 用户id
  private userId: number = 0
  private params: any = {
    oldLoginPwd: '',
    newLoginPwd: '',
    confirmNewLoginPwd: '',
    secrit: ''
  }
  private rules:object = {
    secrit: [
      { required: true, validator: this.validateLoginPwd, trigger: 'change' }
    ],
    newLoginPwd: [
      { required: true, message: '请输入密码', trigger: 'change' }
    ],
    confirmNewLoginPwd: [
      { required: true, validator: this.validateNewLoginPwd, trigger: 'change' }
    ]
  }
  private validateLoginPwd(rule: any, value: string, callback: any) {
    if (value) {
      // const value1 = md5(this.params.loginPwd).toUpperCase()
      const value1 = md5(this.params.secrit)
      if (value1 === this.userInfo.loginPwd) {
        return callback()
      }
      return callback(new Error('原始密码不正确'))

    }
    return callback(new Error('请输入原始密码'))

  }
  private validateNewLoginPwd(rule: any, value: string, callback: any) {
    if (value) {
      if (this.params.newLoginPwd === this.params.confirmNewLoginPwd) {
        return callback()
      }
      return callback(new Error('两次输入密码不一致'))

    }
    return callback(new Error('请确认新密码'))

  }
  created() {
    
  }
  private submitForm(): any {
    if (!this.params.secrit && !this.params.confirmNewLoginPwd && !this.params.newLoginPwd){
      return
    }
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          // this.params = Object.assign(this.dataParams, this.params)
          this.params.type = 1
          let data = this.params
          data.newLoginPwd = md5(data.newLoginPwd)
          data.confirmNewLoginPwd = md5(data.confirmNewLoginPwd)
          data.oldLoginPwd = md5(md5(data.secrit) + 'kingdom')
          data = Object.assign(this.dataParams, data)
          this.$emit('update:dataParams', data)
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
<style lang="scss">
.personal-info-wrapper{
  padding: 0!important;
  .el-main{
    overflow: hidden;
  }
}
</style>
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
