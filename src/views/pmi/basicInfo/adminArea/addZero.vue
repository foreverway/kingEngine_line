<template>
  <div class="add-department">
    <!-- {{ tableData }} -->
    <el-form
      ref="ruleForm"
      :model="tableData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="区域名称"
        prop="areaName"
      >
        <el-input v-model="tableData.areaName" />
      </el-form-item>
      <el-form-item
        label="区域编码"
        prop="areaCode"
      >
        <el-input v-model="tableData.areaCode" />
      </el-form-item>
      <!-- <el-form-item
        label="所在城市"
        prop="parentName"
      >
        <el-input
          v-model="tableData.parentName"
          :disabled="true"
        />
      </el-form-item> -->
      <el-form-item
        label="状态"
        prop="dbStatus"
      >
        <el-select
          v-model="tableData.dbStatus"
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in dbStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="排序编号"
        prop="orderNo"
      >
        <el-input
          v-model="tableData.orderNo"
          type="number"
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
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="ke-dialog-footer"
    >
      <el-button @click="handelCancel">
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'addZero'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Boolean, default: {} }) visible !: true
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private defaultProps: any= {
    children: 'children',
    label: 'text',
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
  private rules:object = {
    areaName: [
      { required: true, message: '请输入区域名称', trigger: 'change' }
    ],
    areaCode: [
      { required: true, validator: this.validateCode, trigger: 'change' }
    ],
    dbStatus: [
      { required: true, message: '请选择', trigger: 'change' }
    ],
    orderNo: [
      { required: true, message: '请输入排序编号', trigger: 'change' }
    ]
  }
  created() {
    this.tableData.areaLevel = 1
  }
  private validateCode(rule: any, value: string, callback: any) {
    // console.log(value)
    if (!value) {
      return callback(new Error('请输入区域编码'))
    } 
    this.validateAreaCode(value).then((res: any) => {
      if (res) {
        return callback()
      } 
      return callback(new Error('区域编码格式不正确'))
      
    })
    
  }
  private validateAreaCode(code: string): any {
    return this.$http.request({
      url: '/area/validateAreaCode',
      method: 'post',
      data: { code: code }
    }).then((res: any) => {
      return true
    }).catch((err: any) => {
      console.log(err)
      return false
    })
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/area/addOrUpdateArea',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      console.log(res)
      this.$emit('update:visible', false)
      // this.$router.push({ path: '/pmi/basicInfo/adminArea/area' })
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        // console.log(this.tableData)
        this.saveData()
      } else {
        // this.$base.win.msg('必填项不能为空', 'error')
        return false
      }
    })
  }
  private handelCancel(): any {
    this.$emit('update:visible', false)
  }
}
</script>

<style lang="scss" scoped>
</style>
