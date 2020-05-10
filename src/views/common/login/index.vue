<template>
  <div class="login">
    <div class="header">
      <div class="logo" />
      <span class="h3">{{ title }}</span>
    </div>
    <div class="form">
      <div class="h3">
        用户登录
      </div>
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
        label-width="0"
      >
        <el-form-item prop="param1">
          <div class="parent">
            <i class="el-icon-user" />
            <input
              v-model="loginForm.param1"
              class="input"
              placeholder="用户名"
            >
          </div>
        </el-form-item>
        <el-form-item prop="param2">
          <div class="parent">
            <i class="el-icon-lock" />
            <input
              v-model="loginForm.param2"
              class="input"
              type="password"
              placeholder="密码"
            >
          </div>
        </el-form-item>
        <el-form-item
          class="mb"
          prop="code"
        >
          <el-row>
            <el-col :span="16">
              <div class="parent">
                <i class="el-icon-box" />
                <input
                  v-model="loginForm.code"
                  class="input"
                  placeholder="验证码"
                  maxlength="4"
                  @keyup.native.native="handleLogin"
                >
              </div>
            </el-col>
            <el-col :span="8">
              <img
                class="img"
                src
                alt="验证码"
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="mb">
          <div class="oos">
            <el-checkbox v-model="loginForm.checked">
              记住我
            </el-checkbox>
            <el-radio-group v-model="loginForm.radio">
              <el-radio label="1">
                单屏
              </el-radio>
              <el-radio label="2">
                双屏
              </el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            @click.native.prevent="handleLogin"
          >
            登&nbsp;&nbsp;&nbsp;&nbsp;录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <div class="bq">
        <span>业主单位： 深圳金证引擎城市管理系统</span>
        <span>开发单位：深圳市金证科技股份有限公司</span>
      </div>
      <div class="bq">
        <span>版本号：1.0.0</span>
        <span>必备下载工具：</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '../../../store/modules/app'

const key = 'login_user'
@Component({
  name: 'Login'
})
export default class extends Vue {
  private loginForm: any = {
    param1: '',
    param2: '',
    code: ''
  };
  private loginRules = {
    param1: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
    param2: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
    code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
  };
  private loading = false;
  private title: string = '';
  created() {
    // 登录改成单屏
    if (AppModule.double === true) {
      AppModule.SET_DOUBLE(false)
    }
    if (process.env.NODE_ENV === 'development') {
      this.loginForm = {
        param1: 'admin',
        param2: '1',
        code: '1111'
      }
    } else {
      const userName = localStorage.getItem(key)
      if (userName) {
        this.loginForm.param1 = userName
        this.loginForm.checked = true
      }
    }
  }
  mounted() {
    this.title = process.env.VUE_APP_NAME || ''
    if (this.loginForm.param1 === '') {
      (this.$refs.param1 as Input).focus()
    } else if (this.loginForm.param2 === '') {
      (this.$refs.param2 as Input).focus()
    }
  }
  private async handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true
        let res = await UserModule.Login(this.loginForm).catch((e) => {
          console.log(e)
        })
        this.loading = false
        if (res !== null && res.code === 200) {
          if (this.loginForm.checked === true) {
            // 安全起见，只记住用户名

            localStorage.setItem(key, this.loginForm.param1)
          } else {
            localStorage.removeItem(key)
          }
          AppModule.SET_DOUBLE(this.loginForm.radio === '2')
          this.$message({
            message: `欢迎你，${res.data.userName}`,
            type: 'success'
          })
          this.$router.push({
            path: '/nav'
          })
        } else {
          this.$base.win.msg('用户名或密码错误', 'error')
        }
      } else {
        this.loading = false
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url(~@/assets/login/bg.png) no-repeat center center;
  background-size: 100% 100%;
  .footer {
    position: fixed;
    bottom: 3vh;
    text-align: center;
    width: 100%;
    color: #fff;
    font-size: 2vh;
    .bq {
      margin-bottom: 2vh;
      span + span {
        margin-left: 3vh;
      }
    }
  }
  .header {
    padding: 5vh 0 0 5vh;
    display: flex;
    align-content: center;
    .logo {
      width: 7vh;
      height: 7vh;
      background: url(~@/assets/login/logo.png) no-repeat center center;
      background-size: 100% 100%;
    }
    .h3 {
      font-size: 4vh;
      color: #fff;
      font-weight: 600;
      line-height: 1.8;
      margin-left: 2.8vh;
    }
  }
  .form {
    background: #f8f9fb;
    border-radius: 1px;
    width: 48vh;
    position: absolute;
    bottom: 25vh;
    right: 20vh;
    padding: 3.5vh 4vh;
    $height: 5.2vh;
    .h3 {
      font-weight: 500;
      font-size: 3.4vh;
      color: #333333;
      margin-bottom: 3vh;
    }
    .el-form-item {
      margin-bottom: 2.8vh;
      &.mb {
        margin-bottom: 1vh;
      }
      .parent {
        display: flex;
        align-items: center;
        position: relative;
        i {
          position: absolute;
          left: 1.5vh;
          font-size: 2.5vh;
          color: #c0c4cc;
        }
      }

      .input {
        color: rgb(170, 169, 169);
        height: $height;
        line-height: $height;
        border: 1px solid #ccc;
        font-weight: 400;
        border-radius: 1px;
        width: 100%;
        padding: 0 1vh 0 4.8vh;
        &:focus {
          border-color: rgb(103, 118, 252);
        }
        font-size: 2.1vh;
        &.code {
          padding-left: 1.5vh;
          width: calc(100% - 0.4vh);
        }
      }
    }
    .img {
      height: $height;
    }
    .oos {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .el-radio {
      margin-right: 4vh;
    }
    .el-button {
      width: 100%;
    }
    .el-button--medium {
      padding: 1.8vh 2.5vh !important;
      font-size: 2.5vh;
    }
  }
}
</style>
