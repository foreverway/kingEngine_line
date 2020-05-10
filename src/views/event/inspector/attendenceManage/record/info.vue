<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="300px"
  >
    <el-form v-loading="loading">
      <el-form-item label="打卡班次：">
        {{ formData.scheduleClassName }}
      </el-form-item>
      <el-form-item label="打卡类型：">
        {{ formData.signType === 1? "上班打卡":"下班打卡" }}
      </el-form-item>
      <el-form-item label="打卡时间：">
        {{ formData.signDate }}
      </el-form-item>
      <template v-if="dialog.title === '定位打卡'">
        <el-form-item label="打卡地址：">
          {{ formData.address }}
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="打卡图片：">
          <photo-preview :img-list="formData.annexes" />
        </el-form-item>
      </template>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'TaskForm',
  components: {
    photoPreview: () => import('../../components/photoPreview.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private formData: any = {}
  private loading: boolean = true
  mounted() {
    this.initData()
  }
  private initData() {
    this.dialog.title === '定位打卡' ? this.handleGetLocateDetail() : this.handleGetPicDetail()
  }
  private handleGetLocateDetail(){
    this.$http({
      url: '/obs/signlog/getSingLogLocationInfo',
      method: 'post',
      data: {
        id: this.dialog.id
      }
    }).then((res) => {
      this.formData = res.data
      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  private handleGetPicDetail(){
    this.$http({
      url: '/obs/signlog/getSingLogPhoteInfo',
      method: 'post',
      data: {
        id: this.dialog.id
      }
    }).then((res) => {
      this.formData = res.data
      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
}
</script>

<style lang="scss" scoped>
.pane-item {
  height: 100%;
}
.add-department {
  min-height: 470px;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
// .el-input,.el-select{
//   width: 210px;
// }
.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
