<template>
  <div
    id="app"
    :style="{width:getDouble?'200%':'100%'}"
  >
    <router-view />
    <div
      v-if="getDouble"
      class="map"
    >
      我是双屏地图
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
@Component({
  name: 'App'
})
export default class extends Vue {
  get getDouble(){
    return AppModule.double
  }
  created() {
    window.onresize = this.rem
    this.rem() 
  }
  rem():void{
    let baseFontSize = 12
    let designWidth = 1366
    let width = window.innerWidth 
    if (width < 1366){
      width = 1366
    }
    let currentFontSize = width / designWidth * baseFontSize
    document.getElementsByTagName('html')[0].style.fontSize = currentFontSize + 'px'
  }
}
</script>
<style scoped>
#app{
  display: flex;
}
  .map {
      width:50%;
      height:100%;
  }
</style>
