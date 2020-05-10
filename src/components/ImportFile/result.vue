<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="700px"
    :close-on-click-modal="false"
  >
    <div class="result">
      <el-table
        ref="eltableCurrentRow"
        v-loading="listLoading"
        :data="tableData"
        empty-text="数据模板不正确或无数据"
        stripe
        style="width: 100%"
        height="360px"
      >
        <el-table-column
          label="序号"
          type="index"
          align="center"
        />
        <el-table-column
          prop="name"
          label="导入项"
          align="center"
        />
        <el-table-column
          prop="result"
          label="导入结果"
          align="center"
          width="80px"
        />
        <el-table-column
          prop="content"
          label="描述"
          align="center"
        />
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'App'
})
export default class extends Vue {
  @Prop({ type: Array, default: [] }) resultData !: any
  private listLoading: boolean = false
  @Prop({ type: Object, default: {} }) dialog !: any
  private tableData: Array<any> = this.$base.common.extend(this.resultData)
  created() {
    // console.log(this.tableData)
  }
}
</script>

<style lang="scss" scoped>
.result{
  padding-bottom: 30px;
}
</style>
