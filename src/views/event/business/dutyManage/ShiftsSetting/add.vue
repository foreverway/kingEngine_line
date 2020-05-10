<template>
  <el-dialog
    v-dialogDrag
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="班次名称"
          prop="cname"
        >
          <el-input
            v-model="tableData.cname"
          />
        </el-form-item>
        <el-form-item
          label="上班时间"
          prop="beginTime"
        >
          <el-time-picker
            v-model="tableData.beginTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            :picker-options="{
              selectableRange:`00:00:00 -${tableData.endTime ? tableData.endTime+':00' : '23:59:00'}`
            }"
          />
        </el-form-item>
        <el-form-item
          label="下班时间"
          prop="endTime"
        >
          <el-time-picker
            v-model="tableData.endTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            :picker-options="{
              selectableRange:`${tableData.startTime ? tableData.startTime+':00' : '00:00:00'}-23:59:00`
            }"
          />
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNum"
        >
          <el-input
            v-model.number="tableData.orderNum"
          />
        </el-form-item>
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
        <el-button
          @click="cancel"
        >
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  // private tableData: any = this.$base.common.extend(this.selectionItem)
  private tableData: any = {}
  private rules:object = {
    cname: [
      { required: true,pattern: '[^ \x22]+' , message: '请选择班次名称', trigger: 'change' }
    ],
    beginTime: [
      { required: true, message: '请选择上班时间', trigger: 'change' }
    ],
    endTime: [
      { required: true, message: '请选择下班时间', trigger: 'change' }
    ],
    orderNum: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      { type: 'number', message: '排序号必须为数字值', trigger: 'change' }
    ]
  }
  created() {
    this.initData()
  }
  private initData(): void {
    if (this.id){
      this.$http
        .request({
          url: '/evt/opWorkNo/findOpWorkNoById',
          method: 'post',
          data: {id: this.id} 
        })
        .then((res: any) => {
          this.tableData = res.data
        })
    } else {
      this.tableData = {
        cname: '',
        beginTime: '',
        endTime: '',
        orderNum: 0,
        note: ''
      }
    }
  }
  private saveData(): void { // 保存 接口
    this.$http.request({
      url: '/evt/opWorkNo/addOpWorkNo',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      let dialog = {
        title: '',
        visible: false,
        isAdd: true
      }
      this.$emit('update:dialog', dialog)
      this.$base.win.msg('成功', 'success')
    })
  }
  private updateData(): void { // 修改 接口
    this.$http.request({
      url: '/evt/opWorkNo/editOpWorkNo',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      let dialog = {
        title: '',
        visible: false,
        isAdd: true
      }
      this.$emit('update:dialog', dialog)
      this.$base.win.msg('成功', 'success')
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        this.id ? this.updateData() : this.saveData()
      } else {
        return false
      }
    })
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
