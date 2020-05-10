<template>
  <div class="result">
    <el-table
      ref="eltableCurrentRow"
      v-loading="listLoading"
      :data="tableData"
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
})
export default class extends Vue {
  @Prop({ type: Array, default: [] }) resultData !: any
  private listLoading: boolean = false
  private tableData: Array<any> = this.$base.common.extend(this.resultData)
  created() {
    console.log(this.tableData)
  }
}
</script>

<style lang="scss" scoped>
.result{
  padding-bottom: 30px;
}
</style>
