<template>
  <div class="table-wrapper">
    <el-table
      ref="eltableCurrentRow"
      v-loading="listLoading"
      :data="tableData"
      stripe
      style="width: 100%"
      height="100%"
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
        prop="userName"
        label="姓名"
        align="center"
      />
      <el-table-column
        prop="sex"
        label="性别"
        align="center"
      />
      <el-table-column
        prop="no"
        label="编号"
        align="center"
      />
      <el-table-column
        prop="type"
        label="人员类型"
        align="center"
      />
      <el-table-column
        prop="address"
        label="所属区域"
        align="center"
      />
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'App',
  components: {}
})
export default class extends Vue {
  // @Prop({ type: Array, default: [] }) tableData!: any
  private pageName: string = '部门管理'
  private tableData: Array<any> = []
  created() {}
  private handleClickRow() {}
  private handleSelectionChange() {}
}
</script>
<style lang="scss" scoped>
.table-wrapper {
  // padding: 0 10px;
  box-sizing: border-box;
  height: 360px;
  margin-bottom: 20px;
}
</style>
