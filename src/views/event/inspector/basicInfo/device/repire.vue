<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <div class="repire">
      <el-form
        ref="ruleForm"
        label-width="100px"
        :model="formData"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              prop="amount"
              label="维修金额："
            >
              <el-input
                v-model="formData.amount"
                placeholder="请输入维修金额"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="费用类型："
              prop="costType"
            >
              <el-select
                v-model="formData.costType"
                placeholder="请选择费用类型"
              >
                <el-option
                  v-for="(item,index) in costOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="维修时间："
              prop="maintainTime"
            >
              <el-date-picker
                v-model="formData.maintainTime"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选择日期时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="维修原因：">
              <el-input
                v-model="formData.reason"
                placeholder="请输入维修原因"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="opeate-buttons">
      <el-button @click="handleClose">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        <svg-icon name="save" />保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
@Component({

})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private formData: any = {
    amount: '',
    costType: '',
    maintainTime: '',
    reason: ''
  }
  private pickerOptions= {
    // disabledDate(time) {
    //   return time.getTime() > Date.now()
    // },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date())
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }]
  }
  private rules = {
    amount: [{
      required: true,
      message: '请输入维修金额',
      trigger: 'change'
    },{
      pattern: /^[0-9]*(.[0-9]+)?$/,
      message: '请输入数字'
    }],
    maintainTime: [{
      required: true,
      message: '请选择维修时间',
      trigger: 'change'
    }]
  }
  private costOptions: any = [{
    value: 1,
    label: '公费'
  },{
    value: 2,
    label: '自费'
  }]
  mounted(){
    if (this.dialog.item){
      console.log(this.dialog.item)
      this.initData()
    }
  }
  private initData(){
    for (let i in this.formData){
      if (this.dialog.item[i]){
        this.formData[i] = this.dialog.item[i]
      }
    }
  }
  private handleClose() {
    let dialog = {
      visible: false,
      title: this.dialog.title
    }
    this.$emit('update:dialog',dialog)
  }
  private handleSubmit(){
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(isValid) => {
      if (isValid){
        this.formData.pdaId = this.dialog.pdaItem.id
        if (this.dialog.item){
          this.handleEdit()
        } else {
          this.handleSave()
        }
      } else {
        return false
      }
    })
  }
  private handleEdit(){
    this.formData.id = this.dialog.item.id
    this.$http({
      url: '/obs/pda/updateObserverPdaMaintainLog',
      method: 'post',
      data: this.formData
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleInit')
      this.handleClose()
    })
  }
  private handleSave() {
    this.$http({
      url: '/obs/pda/addObserverPdaMaintainLog',
      method: 'post',
      data: this.formData
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleReload')
      this.handleClose()
    })
  }
}
</script>

<style lang="scss" scoped>
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
</style>
