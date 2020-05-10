<template>
  <div
    v-loading="loading"
    class="basic"
  >
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="用户名"
                prop="userName"
              >
                <el-input
                  v-model="tableData.userName"
                  placeholder="请输入用户名"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="默认部门"
                prop="deptId"
              >
                <el-cascader
                  ref="dIdCascader"
                  v-model="tableData.deptId"
                  placeholder="请选择默认部门"
                  :options="departTree"
                  :props="defaultProps"
                  :show-all-levels="false"
                  clearable
                  @change="setdepartmentIds"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="登录名"
                prop="loginName"
              >
                <el-input
                  v-model="tableData.loginName"
                  maxlength="64"
                  show-word-limit
                  placeholder="请输入登录名"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="图片"
            prop="avatarUrl"
          >
            <ke-files
              ref="filesIds"
              class="kd-filesTextCenter"
              action="sys/file/fileUpload"
              :data.sync="tableData.img"
              :ids.sync="tableData.avatarId"
              tip="上传图片"
              :accept="['.jpg','.png','.jpeg','.gif']"
              :limit="1"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="登录密码"
            prop="loginPwd"
          >
            <el-input
              v-model="tableData.loginPwd"
              
              maxlength="64"
              show-word-limit
              placeholder="请输入登录密码"
             show-password
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="QQ号"
            prop="qqNo"
          >
            <el-input
              v-model="tableData.qqNo"
              placeholder="请输入QQ号"
              maxlength="32"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="用户邮箱"
            prop="userMail"
          >
            <el-input
              v-model="tableData.userMail"
              maxlength="16"
              show-word-limit
              placeholder="请输入用户邮箱"
              
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="手机号"
            prop="userMobile"
          >
            <el-input
              v-model="tableData.userMobile"
              maxlength="16"
              show-word-limit
              placeholder="请输入手机号"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="办公电话"
            prop="userOph"
          >
            <el-input
              v-model="tableData.userOph"
              placeholder="请输入办公电话"
              maxlength="20"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
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
          maxlength="400"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="管理员"
        prop="isAdmin"
      >
        <el-checkbox v-model="tableData.isAdmin">
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
@Component({})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number;
  @Prop({ type: Object, default: {} }) selectionItem!: any;
  @Prop({ type: String, default: '' }) activeName!: string;
  public $refs: any = { quickEntry: HTMLFormElement };
  private departTree: Array<any> = [];
  private tableData: any = this.$base.common.extend(this.selectionItem);
  private loading: boolean = true;
  private flg: boolean = false;
  private originalLoginName: String = '';
  private originalLoginPwd: string = '';
  private defaultProps: any = {
    children: 'children',
    label: 'name',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  };
  private rules: object = {
    userName: [
      {
        required: true,
        pattern: '[^ \x22]+',
        message: '请输入用户名',
        trigger: 'change'
      }
    ],
    deptId: [{ required: true, message: '请选择默认部门', trigger: 'change' }],
    // 登录名需要做校验
    // loginName: [
    //   { required: true, validator: this.validateLoginName, trigger: 'change' }
    // ],
    loginName: [
      {
        required: true,
        pattern: '[^ \x22]+',
        message: '请输入登录名',
        trigger: 'change'
      }
    ],
    loginPwd: [
      {
        required: true,
        pattern: '[^ \x22]+',
        message: '请输入登录密码',
        trigger: 'change'
      }
    ],

    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      {
        validator(rule, value, callback) {
          if (
            Number.isInteger(Number(value)) &&
            (Number(value) > 0 || Number(value) === 0)
          ) {
            callback()
          } else {
            callback(new Error('请输入大于等于0的数字'))
          }
        },
        trigger: 'change'
      }
    ],
    userMobile: [{ validator: this.validatePhone, trigger: 'change' }],
    userOph: [],
    userMail: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'change' }
    ],
    qqNo: [{ validator: this.validateQq, trigger: 'change' }]
  };

  created() {
    this.initDepartTree()
    this.loading = false
    this.originalLoginName = this.tableData.loginName
    this.originalLoginPwd = this.tableData.loginPwd

    // console.log(md5(this.tableData.loginPwd))
  }
  @Watch('tableData.deptId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    if (val && oldVal) {
      this.$refs.dIdCascader.toggleDropDownVisible()
    }
  }
  private formateData(): void {
    let data = this.tableData
    if (data.id && !this.flg) {
      // console.log(data.is_admin)
      data.isAdmin === 1 ? (data.isAdmin = true) : (data.isAdmin = false)
    }
    // console.log(this.tableData)
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
  private validateQq(rule: any, value: string, callback: any) {
    if (value) {
      const tel = /^[1-9]\d{4,9}$/
      if (tel.test(value)) {
        return callback()
      }
      return callback(new Error('QQ号码格式不正确'))
    }
    return callback()
  }
  private validateLoginName(rule: any, value: string, callback: any) {
    if (!value) {
      return callback(new Error('请输入登录名'))
    }
    if (value === this.originalLoginName) {
      // 修改时可与原登录名相同
      return callback()
    }
    this.hasLoginName(value).then((res: any) => {
      if (res) {
        return callback()
      }
      return callback(new Error('登录名存在'))
    })
  }
  private setdepartmentIds(val): void {
    this.$emit('func', { id: val })
  }
  private hasLoginName(name: string): any {
    // 验证登录名是否存在
    return this.$http
      .request({
        url: '/user/validLoginName',
        method: 'post',
        data: {
          name: name
        }
      })
      .then((res: any) => {
        return true
      })
      .catch((err: any) => {
        console.log(err)
        return false
      })
  }
  private initDepartTree(): void {
    this.$http
      .request({
        url: '/pmi/department/tree',
        method: 'get',
        params: {}
      })
      .then((res: any) => {
        this.departTree = res.data
      })
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async (valid: boolean) => {
        if (valid) {
          // console.log(this.tableData)
          let data = this.$base.common.extend(this.tableData)
          if (data.loginPwd && this.originalLoginPwd !== data.loginPwd) {
            data.loginPwd = md5(data.loginPwd)
          }
          data.isAdmin === true ? (data.isAdmin = 1) : (data.isAdmin = 0)
          // this.tableData.avatarId = parseInt(this.tableData.avatarId)
          this.flg = true
          this.$emit('update:selectionItem', data)
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
  @Watch('selectionItem')
  private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
    if (!this.flg) {
      this.tableData = val
      this.formateData()
    }
  }
}
</script>

<style lang="scss" scoped>
.basic {
  padding-right: 10px;
}
.kd-filesTextCenter {
  height: 150px !important;
}
</style>
