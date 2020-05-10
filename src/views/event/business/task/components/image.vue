<template>
  <div>
    <ke-images
      ref="myImages"
      height="175px"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import KeImages from '@/components/keImages.vue'
@Component({
  components: {
    KeImages
  }
})
export default class extends Vue {
    private tabActiveName:string ='image'
    public setData(data:any){
      (this.$refs.myImages as any).setData( data.images)
    }
}
</script>
 
<style lang="scss" scoped>
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
