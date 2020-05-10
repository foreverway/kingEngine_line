<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        label-width="80px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="发布人"
              prop="createUserName"
            >
              <el-input
                v-model="tableData.createUserName"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="回复人"
              prop="replier"
            >
              <el-input
                v-model="tableData.replyUserName"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="起始时间"
              prop="startTime"
            >
              <el-date-picker
                v-model="tableData.startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :picker-options="beginTimeOption"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结束时间"
              prop="endTime"
            >
              <el-date-picker
                v-model="tableData.endTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :picker-options="endTimeOption"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="留言内容"
          prop="content"
        >
          <el-input
            v-model="tableData.content"
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
          @click="handleCancel()"
        >
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSearch()"
        >
          查询
        </el-button>
        <el-button
          type="warning"
          @click="handleReset()"
        >
          <svg-icon name="reset" />重置
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'Search'
})
export default class extends Vue {
  // @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) params !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = {
    total: 0,
    page: 1,
    startTime: '',
    endTime: '',
    createUserName: '',
    replyUserName: '',
    content: ''
  }
  private beginTimeOption = {
    disabledDate: (time) => {
      let endDateVal = this.tableData.endTime
      if (endDateVal) {
        return time.getTime() > new Date(endDateVal).getTime()
      }
    }
  }
  private endTimeOption = {
    disabledDate: (time) => {
      let beginDateVal = this.tableData.startTime
      if (beginDateVal) {
        return (
          time.getTime() < new Date(beginDateVal).getTime()
        )
      }
    }
  }
  created() {
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: false
    }
    this.handleReset()
    this.$emit('update:dialog', dialog)
  }
  private handleSearch(): void {
    let dialog = {
      title: '',
      visible: false,
      isAdd: true
    }
    this.$emit('emitSetParams', this.tableData)
    this.$emit('update:dialog', dialog)
  }
  private handleReset(): void {
    this.tableData = {
      startTime: '',
      endTime: '',
      createUserName: '',
      replyUserName: '',
      content: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form{
    height: 300px;
  }
</style>
