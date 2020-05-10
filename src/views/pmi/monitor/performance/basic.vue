<template>
  <div
    v-loading="loading"
    class="basic"
  >
    <el-row>
      <el-col :span="12">
        <label>报警类型：</label>
        {{ tableData.name }}
      </el-col>
      <el-col :span="12">
        <label>报警时间：</label>
        {{ tableData.createTime }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <label>短信内容：</label>
        {{ tableData.remarks }}
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import { METHODS } from 'http'
@Component({
  components: {
  }
})
export default class extends Vue {
  @Prop({ type: Number, default: 0 }) id !: number
  @Prop({ type: Object, default: {} }) selectionItem !: any
  @Prop({ type: String, default: '' }) activeName !: string
  public $refs: any = { quickEntry: HTMLFormElement }
  private tableData: any = this.$base.common.extend(this.selectionItem)
  private loading: boolean = true
  private rules:object = {}
  created() {
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.el-row{
  margin-bottom: 14px;
}
.el-col{
  line-height: 26px;
}
label{
  color: #000;
}
.basic{
  padding: 20px;
}
</style>
