<template>
  <el-container class="ke-layout">
    <div id="mapDiv" />
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import 'kmap/kmap.css'
import KMap from 'kmap/KMap'
import XYZLayer from 'kmap/layer/XYZLayer'
let map: any = null

@Component({
  components: {
    // EventForm: () => import('./form.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    mounted() {
      this.initMap()
    }
    private initMap(target = 'mapDiv'): void {
      map = new KMap({
        target,
        view: {
          center: [120.00724554061911, 30.282955],
          zoom: 14,
          projection: 'EPSG:4326'
        },
        layers: [
          new XYZLayer('vec', {
            url: 'http://t{0-4}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ac7457c812448c070e125a1488f3051c'
          })
        ]
      })
    }
}
</script>
<style lang="scss">
  
</style>
<style lang="scss" scoped>
  #mapDiv{
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }
</style>
