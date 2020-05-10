
<template>
  <div
    id="event-map"
    class="map"
  />
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import 'kmap/kmap.css'
import KMap from 'kmap/KMap'
import XYZLayer from 'kmap/layer/XYZLayer'
import Marker from 'kmap/geom/Marker'
import VectorLayer from 'kmap/layer/VectorLayer'
import { MarkerStyle } from 'kmap/geom/Style'

let map:any = null
let layer:any = null
@Component
export default class extends Vue {
  mounted() {
    map = new KMap({
      target: 'event-map',
      view: {
        center: [114.057998657227, 22.4459373082422],
        zoom: 14,
        projection: 'EPSG:4326'
      },
      layers: [
        new XYZLayer('vec', {
          url: 'http://t{0-4}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ac7457c812448c070e125a1488f3051c'
        })
      ]
    })
    map.on('singleclick', this.handleClick)
    layer = new VectorLayer('vec1')
    map.addLayer(layer)
    let marker = new Marker({
      geom: [114.057998657227, 22.4459373082422],
      style: {
        src: '',// require('@/assets/map/logo.png'),
        size: [40, 62],
        offset: [0.5, 1]
      }
    })
    layer.add(marker)
  }
  handleClick(e:any){
    map.forEachGraphicAtPixel(e.pixel, (graphic:any, _layer:any) => {
      if (graphic.getType() === 'marker') {
        console.log(e)
      }
    })
  }
}
</script>
 
<style lang="scss" scoped>
.map{
    width:100%;
    height: 100%;
}
</style>
