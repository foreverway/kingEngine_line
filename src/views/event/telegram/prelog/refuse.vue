<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="500px"
  >
    <el-form label-width="85px">
      <el-form-item label="不受理理由">
        <el-input type="textarea" />
      </el-form-item>
    </el-form>
    <div class="opeate-buttons">
      <el-button @click="handleCancel">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="save" />提交
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({})
export default class Refuse extends Vue {

}
</script>

<style lang="scss">
.opeate-buttons {
  text-align: right;
}
</style>
