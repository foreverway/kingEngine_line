<template>
  <el-dialog
    v-dialog-drag
    :title="enclosure.title"
    :visible.sync="enclosure.visible"
    width="550px"
    :close-on-click-modal="false"
  >
    <div class="add-department">
      <el-table
        ref="eltableCurrentRow"
        :data="enclosureItem"
        stripe
        style="width: 100%;"
        height="100%"
      >
        <el-table-column
          type="index"
          align="center"
        />
        <el-table-column
          prop="fileName"
          label="文件名称"
          align="center"
          width="180"
        />
        <el-table-column
          prop="uploadTime"
          label="上传时间"
          align="center"
          width="180"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <span
              class="download"
              @click.stop="handleDownload(scope.row.filePath)"
            >[下载]</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
@Component({
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) enclosure !: any
  @Prop({ type: Array, default: {} }) enclosureItem !: any
  private tableData: any = this.$base.common.extend(this.enclosureItem)
  // 上传日期
  private data: number = 0
  private typeOptions: Array<any> = []
  async created() {
    
  }
  private handleDownload(list): void {
    window.open(list)
  }
}
</script>

<style lang="scss" scoped>
  .upload{
    width: 100%;
    height: 150px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    padding: 5px 15px;
    overflow: auto;
    .upload-demo{
      height: 100%;

    }
  }
  .download {
    color: #1890ff;
    cursor: pointer;
  }
</style>
