<template>
  <div class="add-details">
    <div class="list">
      <span>系统名称：</span>
      <el-input v-model="input" />
    </div>
    <div class="list">
      <span>发布明细：</span>
      <el-input v-model="input" />
    </div>
    <div class="opeate-buttons">
      <el-button><svg-icon name="hamburger" />取消</el-button>
      <el-button type="primary">
        <svg-icon name="hamburger" />保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
})
export default class extends Vue {
  private pageName = '系统帮助文档'
  private input: string = ''
}
</script>
<style lang="scss" scoped>
.opeate-buttons{
  display: flex;
  justify-content: flex-end;
  margin-top: 80px;
}
.list{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-right: 20px;
  span{
    width: 110px;
    text-align: right;
    padding-right: 10px;
    color: #666;
  }
  .el-dialog__body{
    padding-top: 0;
  }
}
</style>
