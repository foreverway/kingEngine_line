<template>
  <div
    v-if="imgList.length>0"
    class="main-container"
  >
    <div class="big-photo">
      <img :src="imgList[currentIndex]">
    </div>
    <div class="list-container">
      <el-scrollbar>
        <ul>
          <li
            v-for="(item,index) in imgList"
            :key="index"
          >
            <img
              class="small-photo"
              :src="imgList[index]"
              @click="handleImageClick(index)"
            >
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({

})
export default class extends Vue {
  @Prop({ default: [] }) private imgList!:any
  private currentIndex: number = 0
  private handleImageClick(index): void {
    this.currentIndex = index
  }
}
</script>
<style lang="scss" scoped>
.big-photo{
   user-select: none;
  img{
    width: 100%;
    height: 160px;
    object-fit: cover;
    cursor: pointer;
  }
}
ul{
    display: flex;
    flex-flow: row;
    align-items: center;
     user-select: none;
    li{
      img{
        width: 40px;
        height: 26px;
        object-fit: cover;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
</style>
