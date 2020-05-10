<template>
  <div class="auto">
    <div
      v-if="images!==undefined&&images.length>0"
      class="swiper-container"
    >
      <el-carousel
        :id="id"
        :height="height"
      >
        <el-carousel-item
          v-for="(url,key) in images"
          :key="key"
        >
          <img
            :src="url" 
          >
        </el-carousel-item>
      </el-carousel>
    </div>
    <div
      v-else
      class="ke-no-data"
    >
      暂无图片
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch,Prop } from 'vue-property-decorator'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
@Component
export default class extends Vue {
    @Prop({default: 'images'})private id:any
    @Prop({default: '150px'})private height:any
    private tabActiveName:string ='image'
    private images?:Array<string>= []
    public setData(images:any){
      if (images && images.length > 0){
        this.images = images
        this.$nextTick(() => {
          const viewerDom = document.getElementById(this.id)
          const params:any = {
            title: false,
            toolbar: {
              zoomIn: true, 
              zoomOut: true,
              reset: true,
              prev: true,
              next: true,
              rotateLeft: true,
              rotateRight: true
            }
          }
          const viewer = new Viewer(viewerDom as any, params)
        })
      }
    }
}
</script>
 
<style lang="scss" scoped>
.auto{
    width:100%;
    height:100%;
}
 .swiper-container {
      width: 100%;
      height:100%;
    }
    img,.el-image{
        height:100%;
        width:100%;
    }
    .swiper-button-prev,
    .swiper-button-next{
      height:26px;
      width:26px;
      color:#ccc;
    }
    .swiper-button-next::after, .swiper-button-prev::after{
      font-size: 26px;
    }
    .swiper-slide {
      text-align: center;
      font-size: 18px;
      background: #fff;

      /* Center slide text vertically */
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
    }
</style>
