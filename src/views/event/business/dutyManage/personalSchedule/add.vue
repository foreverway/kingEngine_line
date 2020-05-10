<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <div
      v-loading="loading"
      class="add-department"
    >
      <el-form
        class="ke-search form-container"
        label-width="90px"
      >
        <el-row class="ke-search">
          <el-col :span="10">
            <el-form-item
              label="选择班次："
            >
              <el-select
                v-model="classes"
                placeholder="请选择班次"
              >
                <el-option
                  v-for="item in classesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="transfer-wrapper">
        <el-transfer
          v-model="value"
          filterable
          style="text-align: left; display: block;"
          :titles="['可选择工作人员', '已选择工作人员']"
          :props="{
            key: 'id',
            label: 'roleName'
          }"
          :data="rolesData"
          @change="handleChange"
        />
      </div>
      <div class="opeate-buttons">
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Number, default: 0 }) sonId !: number
  @Prop({ type: Object, default: {} }) dialog !: any
  private activeName:string = 'first'
  private saveFlag: boolean = false
  private basicData: any = {}
  private loading: boolean = false
  private flag = false
  public $refs: any = { quickEntry: HTMLFormElement }
  private value: any = []
  private rolesData: Array<any> = []
  private classes: string = ''
  private classesOptions: Array<any> = [
    {
      value: 1,
      label: '上午班'
    },
    {
      value: 2,
      label: '下午班'
    }
  ]
  created() {
    this.initData()
    this.initTreeData()
    // console.log(this.basicData)
  }
  private initData() {
    if (this.sonId) {
      this.$http.request({
        url: '/user/getUserById',
        method: 'post',
        data: {
          id: this.sonId
        }
      }).then((res: any) => {
        // console.log(res)
        this.basicData = res.rows
        this.flag = true
      })
    } else {
      this.basicData = {
        userName: '',
        deptId: '',
        deptName: '',
        loginName: '',
        loginPwd: '',
        userMail: '',
        userMobile: '',
        orderNo: 0,
        note: '',
        is_admin: false,
        userOph: '',
        roles: [],
        departments: []
      }
      this.flag = true
    }
  }
  // 初始化角色数据
  private initTreeData(): void {
    this.$http.request({
      url: '/role/findRolesByPage',
      method: 'post',
      data: {
        name: ''
      }
    }).then((res: any) => {
      // console.log(res)
      this.rolesData = res.rows
    })
  }
  async handleSave() {
    // console.log(this.title)
    await this.$refs.myBasic.submitForm()
    // // console.log(this.basicData)
    await this.$refs.myRoles.commitRoles()
    await this.$refs.myLimit.commitMenus()
    // console.log(this.basicData)
    await this.editApp()
    // this.$emit('update:visible', false)
  }
  private editApp() {
    let res = new Promise((resolve, reject) => {
      this.loading = true
      this.$http.request({
        url: '/user/addOrUpdateUserInfo',
        method: 'post',
        data: this.basicData
      }).then((response: any) => {
        // console.log(res)
        this.loading = false
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$emit('update:dialog', dialog)
        this.$base.win.msg('成功', 'success')
        resolve()
      }).catch(() => {
        this.loading = false
        this.$base.win.msg('保存失败', 'error')
      })
    })
    return res
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
  private handleClick(tab: any, event: any): void {
    // console.log(tab, event);
  }
  // 选中的时候数据变化
  private handleChange(value: any, direction: any, movedKeys: any) {
    // console.log(value, direction, movedKeys)
    // let selectValue = this.$base.common.extend(value)
    // console.log(this.formateDta(selectValue, this.rolesData))
  }
}
</script>

<style lang="scss" scoped>
  .add-department{
    height: 470px;
  }
  .opeate-buttons{
    text-align: right;
  }
  .transfer-wrapper{
    height: 350px;
    margin-bottom: 20px;
  }
</style>
