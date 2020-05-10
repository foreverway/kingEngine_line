<template>
  <el-dialog
    v-loading="loading"
    v-dialog-drag
    title="详情"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <el-row>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>发送人：</label>
        {{ formData.senderName }}
      </el-col>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>接收人：</label>
        {{ formData.receiverName }}
      </el-col>
    </el-row>
    <el-row>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>创建时间：</label>
        {{ formData.createTime }}
      </el-col>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>发送时间：</label>
        {{ formData.sendTime }}
      </el-col>
    </el-row>
    <el-row>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>发送状态：</label>
        {{ formData.msgStatus === 1?"已发送":"未发送" }}
      </el-col>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>阅读状态：</label>
        {{ formData.readStatus === 1 }}
      </el-col>
    </el-row>
    <el-row>
      <el-col
        class="search-item"
        :span="24"
      >
        <label>消息内容</label>
        <div>
          {{ formData.content }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col
        class="upload-list"
        :span="24"
      >
        <label>附件列表：</label>
        <ul class="file-list">
          <li
            v-for="(item,index) in formData.annexes"
            :key="index"
            class="file-item"
          >
            <div class="file-name">
              {{ item.fileName }}
            </div>
            <el-button
              type="text"
              @click="handlePreview(item)"
            >
              预览
            </el-button>
            <el-button
              type="text"
              @click="handleDownload(item)"
            >
              下载
            </el-button>
          </li>
        </ul>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'detail',
  components: {}
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private formData = {}
  private loading: Boolean = true
  mounted(){
    this.initData()
  }
  private initData(){
    this.loading = true
    this.$http({
      url: '/obs/msg/getMessageDetail',
      method: 'post',
      data: {
        id: this.dialog.item.id
      }
    }).then((res) => {
      this.formData = res.data
      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  private handlePreview(item){
    window.open(item.filePath,'_blank')
  }
  private handleDownload(item){
    this.$http({
      url: '/system/file/fileDownload',
      method: 'post',
      data: {
        filePath: item.filePath
      }
    }).then((res) => {
      this.$base.win.msg('下载成功','success')
    })
  }
}
</script>

<style scoped>
.search-item {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-bottom: 15px;
  padding-right: 10px;
}
.upload-list{
  display: flex;
  flex-flow: row;
  margin-bottom: 15px;
  padding-right: 10px;
}
.search-item label,.upload-list label{
  width: 80px;
  line-height: 35px;
  flex-shrink: 0;
}
.file-item{
  display: flex;
  flex-flow: row;
  align-items: center;
  /* justify-content: space-between; */
  width: 100%;
  border-bottom: 1px solid #ddd;

}
.file-name{
    flex-grow: 1;
    padding-left: 10px;
  }
.file-list{
  border-top:1px solid #ddd;
  width: 100%
}
</style>
