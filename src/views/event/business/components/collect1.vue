<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="660px"
  >
    <div class="add-department">
      <el-row>
        <el-col :span="12">
          <el-form
            ref="ruleForm"
            :label-position="top"
            :model="formData"
            :rules="rules"
          >
            <el-form-item
              label="收藏类别"
              prop="collectType"
            >
              <el-select
                v-model="formData.collectType"
              >
                <el-option
                  v-for="item in classesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="点评"
              prop="note"
            >
              <el-input
                v-model="tableData.note"
                type="textarea"
                :rows="8"
                resize="none"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-table
            ref="eltableCurrentRow"
            :data="data"
            stripe
            height="350"
            style="width: 100%"
            @row-click="handleClickRow"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="index"
              align="center"
            />
            <el-table-column
              type="selection"
              align="center"
            />
            <el-table-column
              prop="name"
              label="案件号"
              align="center"
            />
          </el-table>
        </el-col>
      </el-row>

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
  name: 'Collect'
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private checked: boolean = false
  private data: Array<any> = [
    {
      name: '那几件',
      id: 1
    },
    {
      name: '这几乎',
      id: 2
    },
    {
      name: '将就',
      id: 3
    },
    {
      name: '将就',
      id: 4
    },
    {
      name: '将就',
      id: 5
    },
    {
      name: '将就',
      id: 6
    },
    {
      name: '将就',
      id: 7
    },
    {
      name: '将就',
      id: 8
    },
    {
      name: '将就',
      id: 9
    },
    {
      name: '将就',
      id: 10
    },
    {
      name: '将就',
      id: 11
    }
  ]
  private tableData: any = this.$base.common.extend(this.selectionItem)
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private formData: object = {
    collectType: '',
    note: ''
  }
  private classes: string = ''
  private classesOptions: Array<any> = [
    {
      value: 1,
      label: '上午班'
    },
    {
      value: 2,
      label: '下午班'
    }
  ]
  private rules:object = {
    collectType: [
      { required: true, message: '请选择收藏类别', trigger: 'change' }
    ],
    note: [
      { required: true, message: '请输入点评', trigger: 'change' }
    ]
  }
  created() {
    this.$nextTick(() => { // 表格数据默认选中
      this.data.forEach((item: any) => {
        this.$refs.eltableCurrentRow.toggleRowSelection(item)
      })
    })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private saveData(): void { // 保存/修改 接口
    this.$http.request({
      url: '/dictionary/addOrUpdateDictionary',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      // console.log(res)
      let dialog = {
        title: '',
        visible: false,
        isAdd: true
      }
      this.$emit('update:dialog', dialog)
    })
  }
  private submitForm(): any {
    let form = this.$refs.ruleForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        // console.log(this.tableData)
        this.saveData()
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
  .el-row{
    .el-col:last-child{
      padding-left: 15px;
    }
  }
  .el-table{
    border: 1px solid #DCDFE6;
    border-radius: 4px;
  }
</style>
