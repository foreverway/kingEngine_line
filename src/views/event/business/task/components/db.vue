<template>
  <el-dialog
    :title="dialog.title"
    width="800px"
    :visible.sync="dialog.visible"
  >
    <el-row class="images">
      <el-col :span="12">
        <div class="horn qian" />
        <ke-images
          id="qianImages"
          ref="qianImages"
          height="250px"
          class="phone"
        />
      </el-col>
      <el-col :span="12">
        <div class="horn hou" />
        <ke-images
          id="houImages"
          ref="houImages"
          height="250px"
          class="phone"
        />
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import KeImages from '@/components/keImages.vue'

@Component({
  components: {
    KeImages
  }
})
export default class extends Vue {
    @Prop()private dialog:any
    mounted(){
      this.$nextTick(() => {
        this.load()
      })
    }
    load(){
      debugger
      if (this.dialog.data.annexeBeforeList.length > 0){
        (this.$refs.qianImages as any).setData(this.dialog.data.annexeBeforeList.map((item) => {
          return item.filePath
        }))
      }
      if (this.dialog.data.annexeBeforeList.length > 0){
        (this.$refs.houImages as any).setData(this.dialog.data.annexeAfterList.map((item) => {
          return item.filePath
        }))
      }
    }
}
</script>
 
<style lang="scss" scoped>
 .images{
    margin: 10px 0 25px 0;
    .el-col-12{
        position: relative;
        height:250px;
        .phone{
            width:calc(100% - 60px);
        }
        .horn {
            position: absolute;
            top: 0;
            left: 0;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center center;
            width: 60px;
            height: 60px;
            z-index: 999;
        }
        .qian{
            background: url(~@/assets/business/task/qian.png) no-repeat left top;
        }
        .hou{
            background: url(~@/assets/business/task/hou.png) no-repeat left top;
        }
    }
}
</style>
