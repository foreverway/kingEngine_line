<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <div class="add-department">
      <el-form
        ref="ruleForm"
        :model="tableData"
        :rules="rules"
        label-width="110px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="网格名称"
              prop="gridName"
            >
              <el-input
                v-model="tableData.gridName"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="网格编码"
              prop="gridCode"
            >
              <el-input
                v-model="tableData.gridCode"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="所属工作网格"
            >
              <el-input
                v-model="selectGird.gridName"
                suffix-icon="el-icon-edit"
                clearable
                @focus="handleChoose"
                @clear="handleClear"
              />
            <!-- <svg-icon name="edit" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="所属社区"
              prop="parentName"
            >
              <el-input
                v-model="tableData.parentName"
                disabled
                clearable
              />
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
          <el-col :span="12">
            <el-form-item
              label="面积"
              prop="areaage"
            >
              <el-input
                v-model="tableData.areaage"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="排序号"
              prop="orderNo"
            >
              <el-input
                v-model.number="tableData.orderNo"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item
              label="面积"
              prop="areaage"
            >
              <el-input
                v-model="tableData.areaage"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row> -->
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
        <el-button @click="handelCancel">
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
      <cell-gird
        v-if="cellDialog.visible"
        :cell-dialog.sync="cellDialog"
        :select-gird.sync="selectGird"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: 'addFour',
  components: {
    CellGird: () => import('./cellGird.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  private checked: boolean = false
  private tableData: any = this.$base.common.extend(this.selectionItem)
  // 传给cellGird的值 当前选中的单元网格
  private selectGird: any = {}
  private saveLoading: boolean = false
  private cellDialog: any = {
    title: '',
    visible: false
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
    gridName: [
      { required: true, message: '请输入网格名称', trigger: 'change' }
    ],
    gridCode: [
      { required: true, validator: this.validateCode, trigger: 'change' }
    ],
    // dbStatus: [
    //   { required: true, message: '请选择', trigger: 'change' }
    // ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      // eslint-disable-next-line standard/object-curly-even-spacing
      { type: 'number', message: '排序号必须为数字值', trigger: 'change'}
    ]
  }
  created() {
    if (this.tableData.workGridId) {
      this.getCellGrid(this.tableData.workGridId)
    }
  }
  private validateCode(rule: any, value: string, callback: any) {
    // console.log(value)
    if (!value) {
      return callback(new Error('请输入网格编码'))
    } 
    this.validateAreaCode(value).then((res: any) => {
      if (res) {
        return callback()
      } 
      return callback(new Error('网格编码格式不正确'))
      
    })
    
  }
  private validateAreaCode(code: string): any {
    return this.$http.request({
      url: '/cellGrid/validateCellGridCode',
      method: 'post',
      data: { code: code }
    }).then((res: any) => {
      return true
    }).catch((err: any) => {
      console.log(err)
      return false
    })
  }
  private getCellGrid(id:any): void{
    this.$http.request({
      url: '/cellGrid/getCellGridById',
      method: 'post',
      data: {
        id: id
      }
    }).then((res: any) => {
      // console.log(res)
      this.selectGird = res.rows
      this.selectGird.gridName = this.selectGird.cellName
    })
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/cellGrid/addOrUpdateCellgrid',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      // console.log(res)
      let dialog = {
        title: '',
        visible: false,
        level: 1,
        isAdd: true
      }
      this.$emit('update:dialog', dialog)
      this.saveLoading = false
      // this.$router.push({ path: '/pmi/basicInfo/adminArea/cell' })
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        if (this.selectGird.id) { // 有选中单元网格要进行关联
          this.tableData.workGridId = this.selectGird.id
        }
        this.saveLoading = true
        this.saveData()
      } else {
        // this.$base.win.msg('必填项不能为空')
        return false
      }
    })
  }
  private handelCancel(): any {
    let dialog = {
      title: '',
      visible: false,
      level: 1,
      isAdd: false
    }
    this.$emit('update:dialog', dialog)
  }
  private handleChoose(): void {
    // console.log('111')
    this.cellDialog.title = '单元网格'
    this.cellDialog.visible = true
  }
  private handleClear(): void {
    // console.log('清除了吗')
    this.selectGird.id = 0
  }
}
</script>

<style lang="scss" scoped>

</style>
