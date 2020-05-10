<template>
  <el-dialog
    v-dialog-drag
    class="dialog-form"
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <el-form
      ref="rulesForm"
      :rules="rules"
      :model="form"
      label-position="right"
    >
      <el-tabs v-model="curIndex">
        <el-tab-pane
          name="first"
          label="基本信息"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="班次名称"
                prop="className"
              >
                <el-input
                  v-model="form.className"
                  placeholder="请输入班次名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="排序号"
                prop="orderNo"
              >
                <el-input
                  v-model="form.orderNo"
                  placeholder="请输入排序号"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="上班时间"
                prop="startTime"
              >
                <el-time-picker
                  v-model="form.startTime"
                  value-format="HH:mm"
                  placeholder="请选择上班时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="下班时间"
                prop="endTime"
              >
                <el-time-picker
                  v-model="form.endTime"
                  placeholder="请选择下班时间"
                  value-format="HH:mm"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item
                label="所属区域"
                prop="startTime"
              >
                <el-time-picker
                  v-model="form.startTime"
                  placeholder="选择时间"
                />
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item
                label="是否生效"
                prop="isEffect"
              >
                <el-select
                  v-model="form.isEffect"
                  placeholder="请选择是否生效"
                >
                  <el-option :value="2">
                    是
                  </el-option>
                  <el-option :value="1">
                    否
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="备注"
            prop="note"
          >
            <el-input
              v-model="form.note"
              placeholder="请输入备注"
              type="textarea"
              :rows="4"
              resize="none"
              maxlength="250"
              show-word-limit
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane
          name="second"
          label="工作网格"
        >
          <el-transfer
            v-model="selections"
            :data="tableData"
          />
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div class="opeate-buttons">
      <el-button
        @click="handleCancel"
      >
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        v-power
        type="primary"
        code="save"
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
  name: 'TaskForm',
  components: {}
})
export default class extends Vue {
  @Prop({type: Object,default: { visible: false, title: '新增' }}) dialog!: any
  private curIndex: string = 'first'
  private form: any = {
    className: '',
    endTime: '',
    gridIds: '',
    note: '',
    orderNo: '',
    startTime: '',
    isEffect: ''
  }
  private rules: any = {
    className: [
      { required: true, message: '请输入班次名称', trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' }
    ],
    startTime: [
      { required: true, message: '请选择上班时间', trigger: 'change' }
    ],
    endTime: [
      { required: true, message: '请选择下班时间', trigger: 'change' }
    ],
    isEffect: [
      { required: true, message: '请选择是否生效', trigger: 'change' }
    ]
  }
  private tableData: any = []
  private selections: any = []
  private listLoading : boolean = true;

  mounted() {
    this.initGridData()
    if (this.dialog.item){
      console.log(this.dialog.item)
      this.initData()
    }
  }

  private initData(){
    for (let i in this.form){
      if (this.dialog.item[i]){
        this.form[i] = this.dialog.item[i]
      }
    }
    this.form.id = this.dialog.item.id
  }

  private initGridData(){
    this.listLoading = true
    this.$http({
      url: '/obs/workGrid/findAllWorkGridList',
      method: 'post'
    }).then((res) => {
      res.data.forEach((item) => {
        item.key = item.id
        item.label = item.gridName
      })
      this.tableData = res.data
      this.$nextTick(() => {
        this.listLoading = false
      })
    })
  }

  private handleAdd(){
    this.$http({
      url: '/obs/scheduleClass/addScheduleClass',
      method: 'post',
      data: this.form
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleReload')
      this.handleCancel()
    })
  }

  private handleEdit(){
    this.$http({
      url: '/obs/scheduleClass/updateScheduleClass',
      method: 'post',
      data: this.form
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleInit')
      this.handleCancel()
    })
  }

  private handleSubmit(): void{
    let form = this.$refs.rulesForm as ElForm
    form.validate((valid) => {
      if (valid){
        this.form.gridIds = this.selections.join(',')
        if (this.dialog.item){
          this.handleEdit()
        } else {
          this.handleAdd()
        }
      }
    })
  }

  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>
<style scoped>
.dialog-form .el-form-item{
  display: flex;
  flex-flow: row;
  /* align-items: center; */
}
.dialog-form >>> .el-form-item__label{
  width: 100px;
  flex-shrink: 0;
}
.dialog-form >>> .el-form-item__content{
  flex-grow: 1;
}
</style>
<style lang="scss" scoped>
.pane-item {
  height: 100%;
}
.add-department {
  height: 470px;
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
