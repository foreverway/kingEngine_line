<template>
  <div
    v-loading="loading"
    class="system-wrapper ke-body"
  >
    <p class="tips">
      *注意，该模块各功能项修改对系统影响很大，请谨慎操作。
    </p>
    <p class="title">
      基础设置
    </p>
    <div class="form-container">
      <div class="list">
        <span>系统名称：</span>
        <el-input v-model="tableData.sysName" />
      </div>
      <div class="list">
        <span>系统版本号：</span>
        <el-input v-model="tableData.version" />
      </div>
      <div class="list">
        <span>底部版权：</span>
        <el-input v-model="tableData.bottom" />
      </div>
      <div class="list">
        <span>下载链接：</span>
        <el-input
          v-model="tableData.toolDownload"
          type="textarea"
          :rows="4"
          resize="none"
          maxlength="200"
          show-word-limit
        />
      </div>
    </div>
    <el-button
      type="primary"
      @click="handleSave"
    >
      <svg-icon name="save" />保存
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component({
  name: 'SystemProfile'
})
export default class extends Vue {
  private pageName = '系统信息配置'
  private input: string = ''
  private tableData: object = {}
  private loading: boolean = false
  created() {
    this.getSystemInfo()
  }
  private getSystemInfo(): void {
    // this.$http
    //   .request({
    //     url: '/systemManage/getSystemInfo',
    //     method: 'post',
    //     data: {}
    //   })
    //   .then((res: any) => {
    //     // console.log(res)
    //     this.tableData = res.rows
    //   })
  }
  private handleSave(): void {
    this.loading = true
    this.$http
      .request({
        url: '/sys/systemInfo/addSysInfo',
        method: 'post',
        data: this.tableData
      })
      .then((res: any) => {
        if (res.code === 200) {
          this.tableData = {
            sysName: '',
            version: '',
            bottom: '',
            toolDownload: ''
          }
        }
        this.loading = false
        this.$base.win.msgJson(res)
      })
  }
}
</script>
<style lang="scss" scoped>
.system-wrapper {
  color: #666;
  overflow-y: auto;
  .form-container {
    margin-left: 30px;
  }
  .tips {
    color: $pink;
    margin: 0;
    margin-bottom: 15px;
  }
  .title {
    font-size: 16px;
    margin-top: 15px;
  }
  .list {
    display: flex;
    align-items: center;
    margin-top: 16px;
    padding-right: 30px;
    span {
      width: 120px;
      text-align: left;
      padding-right: 10px;
      color: #666;
    }
    .el-input {
      flex: 1;
    }
    .el-textarea {
      flex: 1;
    }
  }
  .row-list {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 15px;
    span {
      padding: 0 3px;
    }
    span:nth-child(1) {
      // width: 120px;
      text-align: left;
      padding: 0;
      padding-left: 30px;
      padding-right: 10px;
    }
    .w115 {
      width: 115px;
    }
    .w65 {
      width: 65px;
    }
  }
  .el-button {
    margin: 0 auto;
    display: block;
    margin-top: 20px;
  }
}
</style>
