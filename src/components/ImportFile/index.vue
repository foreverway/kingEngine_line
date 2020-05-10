<template>
  <div class="import">
    <el-upload
      class="no-list-upload"
      :action="baseURL + url"
      :data="data"
      :headers="headers"
      :on-success="uploadSuccess"
      :on-error="error"
      accept=".xls,.xlsx"
    >
      <el-button
        v-power
        code="importExcel"
      >
        <svg-icon name="import" /> {{ text }}
      </el-button>
    </el-upload>
    <upload-result
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :result-data.sync="resultData"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
  @Component({
    components: {
      UploadResult: () => import('./result.vue')
    }
  })
export default class extends Vue {
    @Prop({ type: String, default: '' }) url !: string
    @Prop({ type: String, default: '导入' }) text !: string
    @Prop({ type: Object,default: '' }) data !: any
    private baseURL: any = sessionStorage.getItem('baseURL')
    private headers: object = {}
    // result 导入结果数据
    private resultData: Array<any> = []
    private dialog: any = {
      title: '',
      visible: false,
      isAdd: false
    }
    created() {
      this.headers = {
        'X-Access-Token': UserModule.token
      }
    }
    @Watch('dialog.visible')
    private handleVisibleChanged(val: boolean, oldVal: boolean): void {
      if (val === false) {
        this.$emit('update:isUpload', false)
      }
    }
    private uploadSuccess(response: any, file: any, fileList: any) { // 上传文件成功
      // console.log(response, file, fileList)
      this.resultData = response.data || response.rows
      this.dialog.title = '导入结果'
      this.dialog.visible = true
      this.$emit('update:isUpload', true)
    }
    private error(response: any, file: any, fileList: any) { // 上传文件失败
      
    }
}
</script>

<style>
.import{
  display: inline-block;
  margin-right: 10px;
}
</style>
