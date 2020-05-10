<!-- eslint-disable no-irregular-whitespace -->
<template>
  <el-dialog
    v-dialog-drag
    title="拍照打卡"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <el-form>
      <el-form-item label="打卡班次：">
        2019-10-12 早班
      </el-form-item>
      <el-form-item label="打卡类型：">
        上班打卡
      </el-form-item>
      <el-form-item label="打卡时间：">
        09:10:32
      </el-form-item>
      <el-form-item label="打卡图片：" />
    </el-form>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({

})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
}
</script>

<style lang="scss" scoped>

</style>
