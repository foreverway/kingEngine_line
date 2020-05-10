<!-- eslint-disable no-irregular-whitespace -->
<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
  >
    <div
      class="add-department"
    >
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="工作网格"
              prop="workGroupName"
            >
              <!-- <el-input
                v-model="formData.workGroupName"
                clearable
              /> -->
              {{ dialog.item.gridName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="网格编码"
              prop="workGroupIds"
            >
              <!-- <el-input
                v-model="formData.workGroupIds"
                clearable
              /> -->
              {{ dialog.item.gridCode }}
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
                v-model="formData.orderNo"
                placeholder="请输入排序号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所属区域"
            >
              <!-- <el-select
                v-model="formData.areaId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in pdaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
              {{ dialog.item.areaName }}
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item
              label="监督员"
              prop="obsIds"
            >
              <supervisor
                ref="mySupervisor"
                :supervisor.sync="formData.supervisor"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-form-item
          label="备　注 "
          prop="note"
        >
          <el-input
            v-model="formData.note"
            placeholder="请输入备注"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div class="opeate-buttons">
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'TaskForm',
  components: {
    Supervisor: () => import('@/components/set/supervisor.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  @Prop() selectionItem: any
  private formData: any = {
    orderNo: '',
    note: '',
    id: '',
    gridName: '',
    gridCode: ''
  }
  private rules: any = {
    // workGroupName: [{ required: true, message: '请输入网格名称', trigger: 'change' }],
    // workGroupIds: [{required: true, message: '请输入网格编码',trigger: 'change'}],
    orderNo: [
      {required: true,message: '请输入排序编号',trigger: 'change'},
      {pattern: /^[0-9]*$/,message: '请输入正整数'}
    ]
    // areaId: [{required: true,message: '请选择所属区域',trigger: 'change'}],
    // obsIds: [{required: true,message: '请选择监督员',trigger: 'change'}]
  }
  mounted() {
    this.handleInitData()
  }
  private handleInitData(){
    let item = this.dialog.item
    console.log(item)
    if (item){
      for (let i in this.formData){
        if (typeof this.dialog.item[i] !== 'undefined'){
          this.formData[i] = this.dialog.item[i]
        }
      }
    }
  }
  private handleSubmit(){
    let form = this.$refs.ruleForm as ElForm
    form.validate(async (valid: boolean) => {
      if (valid) {
        if (this.dialog.item){
          this.handleEdit()
        } else {
          this.handleSave()
        }
      }
    }
    )
  }
  private handleEdit(){
    this.formData.orderNo = Number(this.formData.orderNo)
    this.$http({
      url: '/obs/workGroup/updateWorkGroup',
      method: 'post',
      data: this.formData
    }).then((res) => {
      let dialog = {
        title: '',
        visible: false,
        isAdd: false
      }
      this.$emit('update:dialog',dialog)
    })
  }
  private handleSave(): void{
    this.$http({
      url: '/obs/workGroup/addWorkGroup',
      method: 'post',
      data: this.formData
    }).then((res) => {
      let dialog = {
        title: '',
        visible: false,
        isAdd: false
      }
      this.$emit('update:dialog', dialog)
    })
  }
  private handleCancel(): void {
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
.pane-item {
  height: 100%;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
// .el-input,.el-select{
//   width: 210px;
// }
.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
.item-panel{
  margin-left: 30px;
  height: 35px;
  display: flex;
  flex-flow: row;
  align-items: center;
}
</style>
