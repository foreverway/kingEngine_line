<template>
  <el-dialog
    :title="dialog.title"
    width="650px"
    :append-to-body="true"
    :visible.sync="dialog.visible"
  >
    <el-table
      :data="files"
      height="410px"
    >
      <el-table-column
        label="附件名"
        prop="fileName"
        width="130"
        show-overflow-tooltip
      />
      <el-table-column
        label="附件地址"
        prop="filePath"
        show-overflow-tooltip
      />
      <el-table-column
        label="附件后缀"
        prop="annexeType"
        align="center"
        width="100"
      />
      <el-table-column
        label=""
        width="70px"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleClick(scope.row)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-dialog-drag
      :title="dialogImage.title"
      width="550px"
      :visible.sync="dialogImage.visible"
      :append-to-body="true"
    >
      <ke-images
        ref="refImage"
        height="430px"
        :append-to-body="true"
      />
    </el-dialog>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import KeImages from '@/components/keImages.vue'
@Component({
  name: 'DrTree',
  components: {
    KeImages
  }
})
export default class extends Vue {
    @Prop() private dialog:any
    @Prop() private files!:Array<any>
    private dialogImage:any = {
      title: '图片浏览',
      visible: false
    }
    created(){

    }
    private handleClick(row:any){
      if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(row.annexeType)) {
        // 是图片
        this.dialogImage.visible = true
        let imgs:Array<string> = []
        this.files.forEach((element:any) => {
          if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(element.annexeType)) {
            imgs.push(element.filePath)
          }
        })
        setTimeout(() => {
          const $res = (this.$refs.refImage as any)
          $res.setData(imgs)
        }, 500)
      } else {
        window.open(row.filePath)
      }
    }
}
</script>
<style lang="scss" scoped>
 
</style>
