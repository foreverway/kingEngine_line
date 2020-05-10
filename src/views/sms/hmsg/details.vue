<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
  >
    <div class="details">
      <el-row>
        <el-col :span="12">
          <label>接收人员：</label>
          {{ tableData.roleName }}
        </el-col>
        <el-col :span="12">
          <label>接收电话：</label>
          {{ tableData.roleName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <label>发送人员：</label>
          {{ tableData.roleName }}
        </el-col>
        <el-col :span="12">
          <label>短信类型：</label>
          {{ tableData.roleName }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <label>发送状态：</label>
          {{ tableData.roleCode }}
        </el-col>
        <el-col :span="12">
          <label>发送时间：</label>
          {{ tableData.createTime }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <label>短信内容：</label>
          {{ tableData.note }}
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: Object, default: {} }) dialog !: any
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
}
</script>

<style lang="scss" scoped>
.el-row{
  margin-bottom: 10px;
}
.el-col{
  line-height: 26px;
}
.details{
  height: 300px;
  padding: 10px 20px;
}
label{
  color: #000;
}
</style>
