<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
    :close-on-click-modal="false"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="类别"
          prop="type"
        >
          <el-select
            v-model="tableData.type"
            placeholder="请选择类别"
            clearable
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="起始流程"
          prop="sworkTacheName"
        >
          <el-input
            v-model="tableData.sworkTacheName"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="结束流程"
          prop="eworkTacheName"
        >
          <el-input
            v-model="tableData.eworkTacheName"
            disabled
          />
        <!-- <span class="tips">* 数字越大，排序越后</span> -->
        </el-form-item>
        <el-form-item
          label="排序号"
          prop="orderNum"
        >
          <el-input
            v-model.number="tableData.orderNum"
            placeholder="请输入排序号"
            class="el-input-rank"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="常用语"
          prop="word"
        >
          <el-input
            v-model="tableData.word"
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
  name: 'ManageAdd'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private value1: string = ''
  private value2: string = ''
  private type: string = ''
  private typeOptions: Array<any> = [
    {
      value: 2,
      label: '个人常用语'
    },
    {
      value: 1,
      label: '系统常用语'
    }
  ]
  private defaultProps: any= {
    children: 'children',
    label: 'text',
    value: 'id',
    checkStrictly: true,
    emitPath: false
  }
  private ruleForm:object = {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  }
  private rules:object = {
    type: [
      { required: true, message: '请选择类别', trigger: 'change' }
    ],
    word: [
      { required: true,pattern: '[^ \x22]+', message: '请输入常用语', trigger: 'change' }
    ]
  }
  created() {
    this.getList()
  }
  private getList(): void {
    if (this.id) {
      this.$http.request({
        url: '/evt/commonLanguage/findCommonLanguageById',
        method: 'post',
        data: {id: this.id}
      }).then((res: any) => {
        if (res.code === 200) {
          this.tableData = res.data
          this.tableData.id = this.id
        }
      })
    } 
  }
  @Watch('tableData.parentId')
  private handlePidChanged(val: boolean, oldVal: boolean): void {
    this.$refs.dIdCascader.toggleDropDownVisible()
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: this.id ? 'evt/commonLanguage/editCommonLanguage' : '/evt/commonLanguage/addCommonLanguage',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      if (res.code === 200) {
        let dialog = {
          title: '',
          visible: false,
          isAdd: true
        }
        this.$base.win.msg('成功', 'success')
        this.$emit('update:dialog', dialog)
      } else {
        this.$base.win.msg(res.msg, 'success')
      }
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        // console.log(this.tableData)
        this.saveData()
      } else {
        this.$base.win.msg('必填项不能为空', 'error')
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
