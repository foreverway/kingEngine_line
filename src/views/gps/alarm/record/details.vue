<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
  >
    <div class="add-department">
      <el-form
        :model="tableData"
        label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="车辆："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="是否在线："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="所属部门："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="车辆类型："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="司机："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="联系电话："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="报警名称："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="报警类型："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="false">
          <el-col :span="12">
            <el-form-item
              label="最高时速："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="超速时速："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="true">
          <el-col :span="12">
            <el-form-item
              label="界线类型："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="界线名称："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="报警时间："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="报警地点："
            >
              <el-input
                v-model="tableData.roleName"
                readonly
              />
              <!-- {{ tableData.roleName }} -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="opeate-buttons">
        <el-button
          @click="cancel"
        >
          <svg-icon name="close" />取消
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
  name: ''
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private readonly: boolean = true
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private treeData: Array<any> = []
  private value1: string = ''
  private value2: string = ''
  private classes: string = ''
  created() {
    this.initTreeData()
  }
  private initTreeData(): void {
    console.log(this.tableData)
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
  .opeate-buttons{
    text-align: right;
  }
  .tips{
    color: #ff4949;
  }
  .el-input,.el-select,.el-cascader{
    width: 100%;
  }
  // .el-input-rank{
  //   width: 170px;
  // }
  .no-margin{
    margin-bottom: 0px;
  }
</style>
