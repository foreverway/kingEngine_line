<!-- eslint-disable no-irregular-whitespace -->
<template>
  <div>test</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { METHODS } from 'http'
import md5 from 'js-md5'
@Component({
  name: 'TaskForm'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: String, default: '' }) activeName!: string
  @Prop({ type: String, default: '' }) type!: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private formData: any = {
    userName: '',
    workerNo: '',
    entryDate: '',
    loginName: '',
    loginPwd: '',
    userMobile: '',
    pictureId: '',
    sex: '',
    idno: '',
    politicalStatus: '',
    nativePlace: '',
    acadQual: '',
    userType: '',
    pdaId: '',
    orderNo: '',
    workCells: '',
    address: '',
    speciality: '',
    hobby: '',
    reward: '',
    note: ''
  }
  private loading: boolean = true
  private personOptions: any = [
    {
      label: '一般人员',
      value: '一般人员'
    },
    {
      label: '中队长',
      value: '中队长'
    },
    {
      label: '分队长',
      value: '分队长'
    },{
      label: '大队长',
      value: '大队长'
    }
  ]
  private eduBgOptions: any = [
    {
      label: '初中',
      value: 1
    },
    {
      label: '高中',
      value: 2
    },
    {
      label: '专科',
      value: 3
    },
    {
      label: '本科',
      value: 4
    },
    {
      label: '研究生',
      value: 5
    },
    {
      label: '博士',
      value: 6
    },
    {
      label: '其他',
      value: 7
    }
  ]
  private sexOptions: any = [
    {
      label: '男',
      value: 1
    },
    {
      label: '女',
      value: 2
    }
  ]
  private politicsOptions: any = [
    {
      label: '共青团员',
      value: 1
    },
    {
      label: '党员',
      value: 2
    },
    {
      label: '其他',
      value: 3
    }
  ]
  private rules: object = {
    userName: [{ required: true, message: '请输入姓名', trigger: 'change' }],
    loginName: [{ required: true, message: '请输入登录名', trigger: 'change' }],
    loginPwd: [
      { required: true, message: '请输入登录密码', trigger: 'change' }
    ]
  }

  created() {
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async (valid: boolean) => {
        if (valid) {
          // console.log(this.formData)
          let data = this.$base.common.extend(this.formData)
          data.loginPwd = md5(data.loginPwd)
          this.$emit('update:selectionItem', data)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
          return false
        }
      })
    })
    return res
  }
}
</script>
<style scoped>
.fill-block{
  width: 100%;
  height: 10px;
}
.basic >>> .el-form-item{
  display: flex;
  flex-flow: row;
}
.basic >>> .el-input__inner{
  padding-right: 15px!important;
}
.basic >>> .el-form-item__content {
  margin-left: 0px !important;
  flex-grow:1;
}
.basic >>> .el-textarea__inner {
  height: 75px;
}
.status-form>>>.el-form-item{
  margin-bottom: 0px!important;
}
</style>
<style lang="scss" scoped>
.status-container{
  height: 60px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  line-height: 60px;
  box-sizing: border-box;
  margin-top: 30px;
  margin-left: 15px;
  margin-bottom: 30px;
}
.photo-container{
  width: 160px;
  height: 190px;
  background: #E5E5E5;
  margin-bottom: 10px;
  margin-top: 5px;
}
.col-container{
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}
.basic-form{
  overflow: auto;
  margin-bottom: 10px;
  .basic{
    padding-right: 15px;
  }
}
.col-item{
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-bottom: 15px;
  .blue-dot{
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4DAEFF;
    margin-right: 10px;
    margin-bottom: 5px;

  }
  .value{
    color: #028CFF
  }
}
.check-item {
  margin-top: 20px;
  padding-left: 15px;
}
.upload-container {
  width: 160px;
  height:190px;
  margin-top: 30px;
  .upload {
    width: 100%;
    height: 100%;
    background: #E5E5E5
  }
}
.checkbox-container {
  height: 35px;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding-left: 35px;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
.check-table {
  margin-top: 15px;
}
// .el-tabs__content{
//   padding: 0 40px;
//   box-sizing: border-box;
//   height: 350px;
// }
</style>
