<template>
  <el-dialog
    :title="dialog.title"
    width="600px"
    :visible.sync="dialog.visible"
  >
    <el-form
      ref="ruleForm"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="85px"
      class="ke-form"
    >
      <el-row>
        <el-col :span="24">
          <el-row>
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="车牌号"
                    prop="licensePlate"
                  >
                    <el-input
                      v-model="form.licensePlate"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="司机"
                    prop="xxx"
                  >
                    <ke-set
                      v-model="form.x1"
                      placeholder="请选择司机"
                      path="driver"
                      title="选择司机"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item 
                    label="所属部门" 
                    prop="department"
                  >
                    <el-select v-model="form.department">
                      <el-option 
                        label="全部"
                        value="0"
                      />
                      <el-option 
                        label="在线" 
                        value="1"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="GPS卡号"
                    prop="gps"
                  >
                    <el-input
                      v-model="form.gps"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="车辆编号"
                    prop="xxx"
                  >
                    <el-input
                      v-model="form.x4"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="登记时间"
                    prop="registrationTime"
                  >
                    <el-date-picker
                      v-model="form.registrationTime"
                      type="datetime"
                      placeholder="选择日期时间"
                      default-time="12:00:00"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="是否离线">
                    <el-select v-model="form.x6">
                      <el-option 
                        label="全部"
                        value="0"
                      />
                      <el-option 
                        label="在线" 
                        value="1"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="图片"
                prop="xxx"
              >
                <ke-files
                  class="kd-filesTextCenter"
                  :data="form.files"
                  styles="height: 192px;"
                  tip="上传图片"
                  :accept="['.jpg','.png','.jpeg','.gif']"
                  :limit="1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="用途"
                prop="xxx"
              >
                <el-input
                  v-model="form.x7"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="车辆类型"
                prop="vehicleType"
              >
                <el-select v-model="form.vehicleType">
                  <el-option 
                    label="全部"
                    value="0"
                  />
                  <el-option 
                    label="在线" 
                    value="1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属企业"
                prop="xxx"
              >
                <el-input
                  v-model="form.x8"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="车牌颜色"
                prop="xxx"
              >
                <el-input
                  v-model="form.x10"
                />
                <el-color-picker 
                  v-model="form.x9"
                  @change="onChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="SP07"
              >
                <el-input
                  v-model="form.x11"
                  type="textarea"
                  maxlength="1500"
                  show-word-limit=""
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="ke-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取 消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit('ruleForm')"
      >
        <svg-icon name="save" />确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
import KeSet from '@/components/set/keSet.vue'

@Component({
  components: {   
    KeSet
  }
})
export default class extends Vue {
    @Prop() private dialog:any
    private loading:boolean=false
    private form:any={
      files: []
    }
  private rules:any={
    licensePlate: [
      { required: true,message: '字段不能为空', trigger: 'change' }
    ],
    department: [
      { required: true,message: '字段不能为空', trigger: 'change' }
    ],
    gps: [
      { required: true,message: '字段不能为空', trigger: 'change' }
    ],
    registrationTime: [
      { required: true,message: '字段不能为空', trigger: 'change' }
    ],
    vehicleType: [
      { required: true,message: '字段不能为空', trigger: 'change' }
    ]
  }
  private vehicleCondition: Array<any> = [
    {
      value: 1,
      label: '正常'
    },
    {
      value: 2,
      label: '维修中'
    },
    {
      value: 3,
      label: '报废'
    }
  ]
  created() {
    // this.form.files = [{url: '/keumserver/upload.doc',name: 'xxx.doc'}]
    this.load()
  }
  private load(): void {
    if (this.dialog.type === 'modify'){
      this.loading = true
      this.$http.post('...',{
        id: this.dialog.data.id
      }).then((res: any) => {
        this.loading = false
        this.form = res.data
      })
    }
  }
  private handleSubmit(formName:string) {
    this.loading = true
    let form = (this.$refs.ruleForm as ElForm)
    form.validate((valid) => {
      if (valid) {
        this.$http.post('...',this.form).then((res: any) => {
          if (res.type === 'success'){
            this.$emit('reLoad',this.dialog.type === 'create')
            if (this.dialog.type === 'create'){
              form.resetFields()
            } else {
              this.handleCancel()
            }
          }
          this.loading = false
          this.$base.win.msgJson(res)
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.loading = false
      }
    })
  }
  private handleCancel(): void {
    this.$emit('update:dialog', {
      visible: false
    })
  }
  private onChange(color): void {
    this.form.x10 = color
    debugger
  }
}
</script>
<style lang="scss" scoped>
  .el-color-picker{
    position: absolute;
    right: 0;
  }
  .kd-filesTextCenter{
    text-align: center;
  }
</style>
