<!-- eslint-disable no-irregular-whitespace -->
<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
  >
    <div
      v-loading="loading"
      class="add-department"
    >
      <el-form
        ref="basicForm"
        :model="formData"
        :rules="rules"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="设 备 编 号"
              prop="code"
            >
              <el-input
                v-model="formData.code"
                placeholder="请输入设备编号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="城 管 通 号 "
              prop="num"
            >
              <el-input
                v-model="formData.num"
                placeholder="请输入城管通编号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="设备IEMI号"
              prop="imei"
            >
              <el-input
                v-model="formData.imei"
                placeholder="请输入设备IEMI号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="P D A 用 途 "
              prop="pdaUse"
            >
              <ke-dict
                code="obs_pda_use"
                type="select"
                placeholder="请选择PDA用途"
                :value="formData.pdaUse"
                @input="handleDictInput"
              />
              <!-- <el-select
                v-model="formData.pdaUse"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in pdaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="设 备 品 牌 "
              prop="brand"
            >
              <el-input
                v-model="formData.brand"
                placeholder="请输入设备品牌"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="设 备 型 号 "
              prop="model"
            >
              <el-input
                v-model="formData.model"
                placeholder="请输入设备型号"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="软件版本号"
              prop="version"
            >
              <el-input
                v-model="formData.version"
                placeholder="请输入软件版本号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="item-panel">
              <el-checkbox v-model="formData.isCenter">
                是否归属管理中心
              </el-checkbox>
            </div>
          </el-col>
        </el-row>
        <el-form-item
          label="随 机 配 件 "
          prop="pdaFitting"
        >
          <el-input
            v-model="formData.pdaFitting"
            placeholder="请输入随机配件"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="250"
            show-word-limit
          />
        </el-form-item>
        <el-form-item
          label="备　　注 "
          prop="descript"
        >
          <el-input
            v-model="formData.descript"
            placeholder="请输入备注"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="250"
            show-word-limit
          />
        </el-form-item>
      </el-form>
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
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
@Component({
  name: 'TaskForm',
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  @Prop() selectionItem: any
  private formData: any = {
    code: '',
    num: '',
    imei: '',
    pdaUse: '',
    brand: '',
    model: '',
    version: '',
    isCenter: false,
    pdaFitting: '',
    descript: ''
  }
  private pdaOptions: any = [{
    label: '管理机',
    value: 1
  },{
    label: '网络机',
    value: 2
  },{
    label: '备用机',
    value: 3
  }]
  private dict:Array<any> = []
  private rules: any = {
    code: [{ required: true, message: '请输入设备编号', trigger: 'change',pattern: '[^ \x22]+' }],
    imei: [{required: true, message: '请输入IEMI号',trigger: 'change',pattern: '[^ \x22]+'}],
    version: [{required: true,message: '请输入软件版本号',trigger: 'change',pattern: '[^ \x22]+'}]
  }
  private loading: boolean = false
  created() {
    // this.handleGetDict()
    if (this.dialog.item){
      this.initData()
    }
  }
  async handleGetDict(){
    let res = await this.$base.dict.getItems('obs_pda_use')
    this.dict = res
  }
  private initData() {
    this.formData.id = ''
    for (let i in this.formData){
      if (this.dialog.item[i]){
        this.formData[i] = this.dialog.item[i]
      }
    }
    this.formData.isCenter = this.formData.isCenter === 1 ? true : false
  }
  private handleSubmit(){
    let form = this.$refs.basicForm as ElForm
    form.validate((valid) => {
      if (valid) {
        this.formData.isCenter = this.formData.isCenter ? 1 : 2
        if (this.dialog.item){
          this.handleEdit()
        } else {
          this.handleAdd()
        }
      }
    })
  }
  private handleDictInput(val){
    this.formData.pdaUse = val
  }
  private handleAdd(): void{
    this.$http({
      url: '/obs/pda/addObserverPda',
      method: 'post',
      data: this.formData
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleReload')
      this.handleClose()
    })
  }
  private handleEdit():void{
    this.$http({
      url: '/obs/pda/updateObserverPda',
      method: 'post',
      data: this.formData
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleInit')
      this.handleClose()
    })
  }
  private handleClose(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
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
.item-panel{
  margin-left: 30px;
  height: 35px;
  display: flex;
  flex-flow: row;
  align-items: center;
}
</style>
