<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
    :close-on-click-modal="false"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="工作网格"
              prop="gridName"
            >
              <el-input
                v-model="tableData.gridName"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="网格编码"
              prop="gridCode"
            >
              <el-input
                v-model="tableData.gridCode"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="排序号"
              prop="orderNo"
            >
              <el-input
                v-model.number="tableData.orderNo"
                placeholder="请输入排序号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所属区域"
            >
              <el-input
                v-model.number="tableData.areaId"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item
              label="监督员"
              prop="orderNo"
            >
              <el-input
                v-model="tableData.deptIcon"
                clearable
                placeholder="请选择监督员"
              >
                <svg-icon
                  slot="suffix"
                  class="selectIcon"
                  name="ok"
                  @click="addSupervisor()"
                />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-form-item
          label="备注"
          prop="note"
        >
          <el-input
            v-model="tableData.note"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="ke-dialog-footer"
      >
        <el-button @click="cancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="submitForm"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
      <!-- <add-roles
        v-if="cellDialog.visible"
        :dialog.sync="cellDialog"
        :select-users.sync="selectUsers"
      /> -->
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'GridManageAdd',
  components: {
    addRoles: () => import('./addRoles.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id!: number
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: Object, default: {} }) dialog!: any
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private checked: boolean = false
  private areaTree: Array<any> = []
  private departTree: Array<any> = []
  // 传给cellGird的值 当前选中的单元网格
  private selectUsers: Array<any> = []
  private saveLoading: boolean = false
  private cellDialog: any = {
    title: '',
    visible: false
  }
  private rules: object = {
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      { type: 'number', message: '排序号必须为数字值', trigger: 'change' }
    ]
  }
  created() {
    
  }
  @Watch('selectUsers')
  private handleUsersChanged(val: any, oldVal: any): any {
    if (val !== oldVal) {
      this.tableData = this.tableData.concat(val)
      let hash: any = {}
      this.tableData = this.tableData.reduce((item, next) => {
        if (hash[next.id]) {
          hash[next.id] = ''
        } else {
          hash[next.id] = true && item.push(next)
        }
        // hash[next.id] ? '' : hash[next.id] = true && item.push(next)
        return item
      }, [])
    }
  }
  private saveData(): void {
    // 修改 接口
    this.$http
      .request({
        url: '/obs/workGrid/updateWorkgrid',
        method: 'post',
        data: this.tableData
      })
      .then((res: any) => {
        if (res.code === 200) {
          let dialog = {
            title: '',
            visible: false,
            isAdd: true
          }
          this.$emit('update:dialog', dialog)
          this.saveLoading = false
          this.$base.win.msg('成功', 'success')
        } else {
          this.$base.win.msg(res.msg, 'error')
        }
      })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async (valid: boolean) => {
      if (valid) {
        this.saveData()
      } else {
        // this.$base.win.msg('必填项不能为空', 'error')
        return false
      }
    })
  }
  private addSupervisor(): void {
    this.cellDialog.title = '监督员'
    this.cellDialog.visible = true
  }
  private cancel(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
</style>
