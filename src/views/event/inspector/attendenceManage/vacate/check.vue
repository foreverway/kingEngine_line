<template>
  <el-dialog
    v-loading="loading"
    v-dialog-drag
    title="审批"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <el-form
      ref="ruleForm"
      :model="formData"
      :rules="props"
      label-width="100px"
    >
      <el-row>
        <el-col
          :span="12"
          class="form-item"
        >
          <span class="items">姓名：{{ detailData.observerName }}</span>
        </el-col>
        <el-col :span="12">
          <span class="items">申请时间：{{ detailData.createTime }}</span>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:10px">
        <el-col :span="12">
          <span class="items">开始时间：{{ detailData.startDate }}</span>
        </el-col>
        <el-col :span="12">
          <span class="items">结束时间：{{ detailData.endDate }}</span>
        </el-col>
      </el-row>
      <el-form-item label="请假原因：">
        <el-input
          v-model="detailData.reason"
          :disabled="true"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="250"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="审批结果："
        prop="auditStatus"
      >
        <el-select
          v-model="formData.auditStatus"
          placeholder="请选择审批结果"
        >
          <el-option
            v-for="item in auditOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="审批意见："
        prop="auditDesc"
      >
        <el-input
          v-model="formData.auditDesc"
          placeholder="请输入审批意见"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="250"
          show-word-limit
        />
      </el-form-item>
      <div class="opeate-buttons">
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          <svg-icon name="save" />确定
        </el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
@Component({
  name: 'TaskForm',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private loading: boolean = true
  private formData :any = {
    auditStatus: '',
    auditDesc: '',
    id: ''
  }
  private props = {
    auditStatus: [
      { required: true, message: '请选择审批结果', trigger: 'change' }
    ]
  }
  private auditOptions: any = [{
    label: '通过',
    value: 2
  },{
    label: '不通过',
    value: 3
  }]
  private detailData: any = {}
  created() {

    // console.log(this.basicData)
  }
  mounted(){
    this.formData.observerId = this.dialog.item.observerId
    this.initData()
  }
  private initData() {
    this.$http({
      url: '/obs/leave/getObsLeaveDetail',
      method: 'post',
      data: {
        id: this.dialog.item.observerId
      }
    }).then((res) => {
      this.detailData = res.data
      this.formData.id = res.data.id
      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  private handleSave(){
    let form = this.$refs.ruleForm as ElForm
    form.validate((valid) => {
      if (valid){
        this.handleAudit()
      } else {
        return false
      }
    })
  }
  private handleAudit(){
    this.$http({
      url: '/obs/leave/auditObserverLeave',
      method: 'post',
      data: this.formData
    }).then((res) => {
      this.$base.win.msg('审批成功','success')
      this.handleCancel()
    })
  }
  private handleCancel(){
    let dialog = {
      visible: false
    }
    this.$emit('update:dialog',dialog)
  }

}
</script>

<style lang="scss" scoped>
.items{
  height: 36px;
  display: flex;
  align-items: center;
  padding-left: 18px;
}
.pane-item {
  height: 100%;
}
.add-department {
  min-height: 470px;
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
.form-item {
  display: flex;
  flex-flow: row;
  align-items: center;
  padding-right: 20px!important;
  label{
      width: 60px;
  }
}
</style>
