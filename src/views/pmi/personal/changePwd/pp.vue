<template>
  <div class="personal-info-wrapper">
    <el-main>
      <div class="list">
        <span>姓名：</span>
        <el-input v-model="input" />
      </div>
      <div class="list">
        <span>原始密码：</span>
        <el-input v-model="input" />
      </div>
      <div class="list">
        <span>新密码：</span>
        <el-input v-model="input" />
      </div>
      <div class="list">
        <span>确认新密码：</span>
        <el-input v-model="input" />
      </div>
      <el-button type="primary">
        <svg-icon name="edit" />保存
      </el-button>
    </el-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'App'
})
export default class extends Vue {
  private pageName: string = '个人信息'
  private input: string = ''
}
</script>
<style lang="scss" scoped>
.personal-info-wrapper{
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-sizing: border-box;
  .el-main{
    max-width: 66%;
    height: 100%;
    // background-color: palegoldenrod;
    margin: 0 auto;
    padding: 0;
    .list{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      span{
        width: 130px;
        text-align: right;
        padding-right: 10px;
        color: #666;
      }
    }
    .el-button {
      margin: 0 auto;
      display: block;
      margin-top: 16px;
    }
  }
}
</style>
