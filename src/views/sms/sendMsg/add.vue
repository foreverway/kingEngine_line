<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item
        label="短信内容"
        prop="note"
      >
        <el-input
          v-model="tableData.note"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="处置单位人员"
        prop="professional"
      >
        <el-input
          v-model="selectProfessionalNames"
          :title="selectProfessionalNames"
          readonly
        >
          <svg-icon
            slot="suffix"
            class="selectIcon"
            name="ok"
            @click="selectProfessional()"
          />
        </el-input>
      </el-form-item>
      <el-form-item
        label="监督员"
        prop="supervisor"
      >
        <el-input
          v-model="selectSupervisorNames"
          readonly
          :title="selectSupervisorNames"
        >
          <svg-icon
            slot="suffix"
            class="selectIcon"
            name="ok"
            @click="selectSupervisor()"
          />
        </el-input>
      </el-form-item>
      <el-form-item
        label="所在部门"
        prop="department"
      >
        <el-input
          v-model="selectDepartmentNames"
          readonly
          :title="selectDepartmentNames"
        >
          <svg-icon
            slot="suffix"
            class="selectIcon"
            name="ok"
            @click="selectDepartment()"
          />
        </el-input>
      </el-form-item>
      <add-professional
        v-if="proDialog.visible"
        :dialog.sync="proDialog"
        :select-users.sync="tableData.professional"
      />
      <add-supervisor
        v-if="supDialog.visible"
        :dialog.sync="supDialog"
        :select-users.sync="tableData.supervisor"
      />
      <add-department
        v-if="depDialog.visible"
        :dialog.sync="depDialog"
        :selection-item.sync="tableData.department"
      />
    </el-form>
    <div
      slot="footer"
      class="ke-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        type="primary"
      >
        <svg-icon name="form" />暂存
      </el-button>
      <el-button
        type="primary"
        :loading="saveLoading"
        @click="handleSave"
      >
        <svg-icon name="export" />发送
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  components: {
    AddProfessional: () => import('@/components/set/professional.vue'),
    AddSupervisor: () => import('@/components/set/supervisor.vue'),
    AddDepartment: () => import('./departments.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) dialog !: any
  @Prop({ type: Object, default: {} }) selectionItem !: any
  private activeName:string = 'first'
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = false
  public $refs: any = { quickEntry: HTMLFormElement }
  private saveLoading: boolean = false
  private rules:object = {
    note: [
      { required: true, message: '请输入短信内容', trigger: 'change' }
    ]
  }
  private proDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private supDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private depDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private selectProfessionalNames: string = ''
  private selectSupervisorNames: string = ''
  private selectDepartmentNames: string = ''
  created() {
    this.initData()
  }
  private initData() {
  }
  @Watch('tableData.professional')
  private professionalsChange(val: any, oldVal: any): void {
    if (val.length) {
      let names: Array<any> = []
      val.forEach((el: any) => {
        names.push(el.userName)
      })
      this.selectProfessionalNames = names.join(',')
    }
  }
  @Watch('tableData.supervisor')
  private supervisorsChange(val: any, oldVal: any): void {
    if (val.length) {
      let names: Array<any> = []
      val.forEach((el: any) => {
        names.push(el.userName)
      })
      this.selectSupervisorNames = names.join(',')
    }
  }
  @Watch('tableData.department')
  private departmentsChange(val: any, oldVal: any): void {
    if (val.length) {
      let names: Array<any> = []
      val.forEach((el: any) => {
        names.push(el.text)
      })
      this.selectDepartmentNames = names.join(',')
    }
  }
  private selectProfessional(): void {
    this.proDialog.title = '新增'
    this.proDialog.visible = true
    this.proDialog.isAdd = false
  }
  private selectSupervisor(): void {
    this.supDialog.title = '新增'
    this.supDialog.visible = true
    this.supDialog.isAdd = false
  }
  private selectDepartment(): void {
    this.depDialog.title = '新增'
    this.depDialog.visible = true
    this.depDialog.isAdd = false
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async(valid: boolean) => {
        if (valid) {
          this.$emit('update:selectionItem', this.tableData)
          resolve()
        } else {
          this.$emit('update:activeName', 'first')
          return false
        }
      })
    })
    return res
  }
  async handleSave() {
    // console.log(this.title)
    await this.$refs.myBasic.submitForm()
    await this.$refs.myProfessional.commitProfessional()
    await this.$refs.mySupervisor.commitSupervisor()
    await this.$refs.myDepartment.commitDepartment()
    console.log(this.tableData)
    // this.saveLoading = true
    // await this.editApp()
    // this.saveLoading = false
    // // this.$emit('update:visible', false)
  }
  private editApp() {
    let res = new Promise((resolve, reject) => {
      this.loading = true
      this.$http.request({
        url: '/user/addOrUpdateUserInfo',
        method: 'post',
        data: this.tableData
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
}
</script>
<style lang="scss">
  .msg-tabs{
    .el-tabs__content{
      height: calc(100% - 55px);
      overflow-y: auto;
    }
  }
</style>
<style lang="scss" scoped>
.el-form{
  height: 400px;
  margin-bottom: 20px;
}
.selectIcon{
  cursor: pointer;
}
</style>
