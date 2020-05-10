<!-- eslint-disable no-irregular-whitespace -->
<template>
  <div
    v-loading="loading"
    class="sys-basic"
  >
    <el-form
      ref="basicForm"
      :model="tableData"
      :rules="rules"
      label-width="120px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="标题"
            prop="msgTitle"
          >
            <el-input
              v-model="tableData.msgTitle"
              placeholder="请输入标题"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="发布时间"
            prop="pubTime"
          >
            <el-date-picker
              v-model="tableData.pubTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择发布时间"
              :picker-options="beginTimeOption"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="有效时间至"
            prop="finishTime"
          >
            <el-date-picker
              v-model="tableData.finishTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择发布时间"
              :picker-options="endTimeOption"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="正文"
          prop="msgContent"
        >
          <el-input
            v-model="tableData.msgContent"
            type="textarea"
            maxlength="200"
            show-word-limit=""
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item
            label="附件上传"
            prop="annexe"
          >
            <ke-files
              ref="filesIds"
              styles="height: 192px;"
              class="kd-filesTextCenter"
              action="system/file/fileUpLoad"
              :data.sync="tableData.annexe"
              :ids.sync="tableData.annexeIds"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
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
  @Prop({ type: Object, default: {} }) selectionItem!: any
  @Prop({ type: String, default: '' }) activeName!: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private flg: boolean = true
  private strIds: any = this.tableData.annexeIds
  private defaultProps: any = {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private rules: object = {
    finishTime: [
      { required: true, message: '请选择时间', trigger: 'change' }
    ],
    pubTime: [
      {required: true, message: '请选择时间', trigger: 'change'}
    ]
  }
  created() {
    this.loading = false
  }
  private beginTimeOption = {
    disabledDate: (time) => {
      let endDateVal = this.tableData.finishTime
      if (endDateVal) {
        return time.getTime() > new Date(endDateVal).getTime()
      }
    }
  }
  private endTimeOption = {
    disabledDate: (time) => {
      let beginDateVal = this.tableData.pubTime
      if (beginDateVal) {
        return (
          time.getTime() < new Date(beginDateVal).getTime()
        )
      }
    }
  }
  private submitForm(): any {
    let res = new Promise((resolve, reject) => {
      let form = this.$refs.basicForm as ElForm
      form.validate(async (valid: boolean) => {
        if (valid) {
          this.tableData.annexeIds = this.strIds
          let data = this.$base.common.extend(this.tableData)
          this.$emit('update:selectionItem', data)
          this.flg = false
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
    if (this.id && this.flg) {
      this.tableData = val
    }
  }
  @Watch('tableData.annexeIds')
  private getids(val: boolean, oldVal: boolean): void {
    if ( this.flg ) {
      this.strIds = val
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
