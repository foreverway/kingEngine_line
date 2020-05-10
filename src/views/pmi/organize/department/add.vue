<template>
  <div>
    <el-dialog
      v-dialog-drag
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="100px"
      >
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-col :span="24">
                  <el-form-item
                    label="部门名称"
                    prop="deptName"
                  >
                    <el-input
                      v-model="tableData.deptName"
                      placeholder="请输入部门名称"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="所属区域"
                    prop="areaId"
                  >
                    <ke-tree 
                      v-model="tableData.areaId" 
                      placeholder="请选择所属区域"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item
                    label="部门类型"
                    prop="deptType"
                  >
                    <ke-dict 
                      v-model="tableData.deptType" 
                      code="sectorType"
                    />
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="图片"
                  prop="img"
                >
                  <ke-files
                    ref="filesIds"
                    class="kd-filesTextCenter"
                    action="sys/file/fileUpload"
                    :data.sync="tableData.img"
                    :ids.sync="tableData.logoId"
                    tip="上传图片"
                    :accept="['.jpg','.png','.jpeg','.gif']"
                    :limit="1"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="上级部门"
              prop="parentId"
            >
              <el-cascader
                ref="pIdCascader"
                v-model="tableData.parentId"
                placeholder="请选择上级部门"
                :options="departTree"
                :props="defaultProps"
                :show-all-levels="false"
                clearable
                @change="handleChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="排序号"
              prop="orderNo"
            >
              <el-input
                v-model.trim="tableData.orderNo"
                placeholder="请输入排序号"
                clearable
              />
            <!-- <span class="tips">* 数字越大，排序越后</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="部门编码"
              prop="deptCode"
            >
              <el-input
                v-model="tableData.parentCode"
                disabled
                style="width: 30%;" 
                :title="tableData.parentCode" 
              /> - 
              <el-input
                v-model="tableData.deptCode"
                placeholder="请输入3位数字"
                clearable
                style="width: 60%;" 
              /> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="mb10"
              label="部门图标"
              prop="deptIcon"
            >
              <el-input
                v-model="tableData.deptIcon"
                clearable
                placeholder="请选择或输入图标名称"
                :disabled="true"
              >
                <svg-icon
                  slot="suffix"
                  class="selectIcon"
                  name="ok"
                  @click="handleSelectIcon()"
                />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item
              label="状态"
              prop="dbStatus"
            >
              <el-radio-group v-model="tableData.dbStatus">
                <el-radio
                  v-for="(item, i) in dbStatusOptions"
                  :key="i"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-form-item
          label="备注"
          prop="note"
        >
          <el-input
            v-model="tableData.note"
            type="textarea"
            :rows="4"
            resize="none"
            maxlength="200"
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
          :loading="saveLoading"
          @click="submitForm"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </el-dialog>
    <icon-cls
      v-if="iconDialog.visible"
      :dialog.sync="iconDialog"
      @selectIcon="selectIcon"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import IDict from '@/interface/dict'
@Component({
  components: {
    IconCls: () => import('./iconCls.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  // @Prop({ type: Boolean, default: false }) visible !: boolean
  // @Prop({ type: String, default: '' }) title !: string
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private checked: boolean = false
  private departTree: Array<any> = []
  private thisDeptCode: String = ''
  private saveLoading: boolean = false
  private defaultProps: any= {
    children: 'children',
    label: 'name',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private defaultPropst: any= {
    children: 'children',
    label: 'areaName',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private dbStatusOptions: Array<any> = [
    {
      value: 1,
      label: '正常'
    },
    {
      value: 0,
      label: '删除'
    }
  ]
  private iconDialog: any = {
    title: '选择图标',
    visible: false
  }
  private rules:object = {
    parentId: [
      { required: true, message: '请选择部门', trigger: 'change' }
    ],
    deptName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入部门名称', trigger: 'change' }
    ],
    deptCode: [
      { required: true,pattern: '[^ \x22]+', validator: this.validateCode, trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      {            
        validator(rule,value,callback){            
          if (Number.isInteger(Number(value)) && (Number(value) > 0 || Number(value) === 0)){                
            callback()
          } else {                 
            callback(new Error('请输入大于等于0的数字'))           
          }             
        },             
        trigger: 'change'          
      }
    ],
    departIcon: [
      { required: true,pattern: '[^ \x22]+', message: '请输入部门图标', trigger: 'change' }
    ]
  }
  private validateCode(rule: any, value: string, callback: any) {
    if (!value) {
      return callback(new Error('请输入部门编码'))
    }
    if (value.length !== 3) {
      return callback(new Error('只能输入3位数字'))
    }
    let reg = /^[0-9]+$/
    if (reg.test(value)) {
      return callback()
    }
    return callback(new Error('部门编码只能输入数字'))
  }
  async created() {
    this.initDepartTree()
  }
  @Watch('tableData.parentId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.$refs.pIdCascader.toggleDropDownVisible()
  }
  private handleChange(value,options): void {
    let list = this.$refs.pIdCascader.getCheckedNodes()[0].data
    this.tableData.parentCode = list.code
  }
  private hasDeptCode(code: string): any { // 验证部门编码是否存在
    return this.$http.request({
      url: '/dept/validDepartCode',
      method: 'post',
      data: {
        deptCode: code
      }
    }).then((res: any) => {
      return true
    }).catch((err: any) => {
      console.log(err)
      return false
    })
  }
  private initDepartTree(): void {
    this.$http.request({
      url: '/pmi/department/tree',
      method: 'get',
      params: {disableId: this.tableData.id}
    }).then((res: any) => {
      this.departTree = res.data
      this.getDateTree(res.data)
    })
  }
  private getDateTree(array: any): void {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === this.tableData.id) {
        array[i].disabled = true
        break
      } else if (array[i].children) {
        this.getchildren(array[i])
      }
    }
  }
  private getchildren(array: any): void {
    for (let i = 0; i < array.length; i++) {
      if (array[i].id === this.tableData.id) {
        array[i].disabled = true
      } 
    }
  }
  private editData(): void { // 新增 修改 接口
    console.log('ids',this.tableData.logoId)
    // if (this.$refs.filesIds.ids.length !== 0) {
    //   this.tableData.logoId = this.$refs.filesIds.ids[0] // 图片id
    // } else {
    //   this.tableData.logoId = 0
    // }

    this.$http.request({
      url: this.tableData.id ? `/pmi/department/${this.tableData.id}` : '/pmi/department/',
      method: this.tableData.id ? 'put' : 'post',
      data: this.tableData
    }).then((res: any) => {
      this.saveLoading = false
      if (res.code === 200) {
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$emit('update:dialog', dialog)
      }
      this.$base.win.msgJson(res)
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        this.saveLoading = true
        this.editData()
      } else {
        // this.$base.win.msg('必填项不能为空', 'error')
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
  private handleSelectIcon() {
    // this.iconField = field
    this.iconDialog.visible = true
  }
  private selectIcon(item:any) {
    this.tableData.deptIcon = item.iconName
  }

}
</script>

<style lang="scss" scoped>
  .mb10{
    margin-bottom: 10px;
  }
  .selectIcon{
    cursor: pointer;
  }
  // .el-tabs__content{
  //   padding: 0 40px;
  //   box-sizing: border-box;
  //   height: 350px;
  // }
</style>
