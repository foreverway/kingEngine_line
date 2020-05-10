<template>
  <div>
    <!-- <el-button
      type="text"
      @click="handleLocate"
    >
      {{ coordinate[0]?(coordinate[0]+' '+coordinate[1]):'选择坐标' }}
    </el-button> -->
    <el-dialog
      :visible.sync="dialog.visible"
      :append-to-body="true"
      :title="dialog.title"
    >
      <div class="map-container">
        <div id="locateMap" />
      </div>
      <div
        v-if="canEdit"
        class="opeate-buttons"
      >
        <el-button @click="handleCancel">
          <svg-icon name="close" />取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          <svg-icon name="save" />保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import axios from 'axios'
import ArcGISTileLayer from 'kmap/layer/ArcGISTileLayer'
import VectorLayer from 'kmap/layer/VectorLayer'
import 'kmap/kmap.css'
import Marker from 'kmap/geom/Marker'
import KMap from 'kmap/KMap'
import { UserModule } from '@/store/modules/user'
import XYZLayer from 'kmap/layer/XYZLayer'

const defaultMap: any = {
  zoom: 17,
  minZoom: 12,
  projection: 'EPSG:4326',
  center: [114.057998657227, 22.4459373082422],
  gisLayer: sessionStorage.getItem('gisLayer')
}
const defaultStyle: any = {
  offset: [0,0],
  anchor: [0.5,1],
  size: [200, 200],
  scale: 0.2
}
let map
@Component
export default class extends Vue {
  // 定位坐标数组
   @Prop({ default: () => [0,0] }) coordinate !: any
   @Prop({ type: Boolean, default: false }) canEdit !: boolean
   @Prop() dialog: any
   private handleShowLocate: boolean = false
   private editCoordinate: any= []
   created(){

   }
   mounted(){
     this.editCoordinate = this.coordinate
     setTimeout(() => {

       this.handleInit()
     },500)
   }
   private handleInit(){
     map = new KMap({
       target: 'locateMap',
       view: {
         center: defaultMap.center,
         zoom: defaultMap.zoom,
         projection: defaultMap.projection,
         minZoom: defaultMap.minZoom
       },
       layers: [
         new XYZLayer('vecbase',{
           url: defaultMap.gisLayer
         })
       ]
     })
     if (this.canEdit){
       map.on('singleclick', this.handleMapSingleClick)
     }
     let Veclayer = new VectorLayer('vec')
     map.addLayer(Veclayer)
     if (this.coordinate[0]){
       this.initMarker(this.coordinate)
     }
   }
   private initMarker(coordinate){
     let Veclayer = map.getLayer('vec')
     let data = {
       id: 1,
       icon: require('@/assets/marker.png'),
       longitude: coordinate[0],
       latitude: coordinate[1]
     }
     this.handleAddMarker(Veclayer,data)
   }
   private handleMapSingleClick(e){
     let coordinate = e.coordinate
     this.editCoordinate = coordinate
     let flag = false
     let layer = map.getLayer('vec')
     layer.forEach((graphic) => {
       if (graphic){
         graphic.setCoordinates(coordinate)
         flag = true
       }
     })
     if (!flag){
       this.initMarker(coordinate)
     }
   }
   private handleSave(){
     this.$confirm('是否修改定位坐标？', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).then(() => {
       this.$emit('update:coordinate',this.editCoordinate)
       this.handleCancel()
     })
   }
   private handleCancel(){
     let dialog = Object.create(this.dialog)
     dialog.visible = false
     this.$emit('update:dialog',dialog)
   }
   private handleAddMarker(layer: VectorLayer,data:any){
     if (
       data.latitude &&
      data.latitude !== ''
     ) {
       let attributes: object = {
         id: data.id,
         data
       }
       let marker:any
       let iconStyle = {
         src: data.icon,
         offset: defaultStyle.offset,
         anchor: defaultStyle.anchor,
         size: defaultStyle.size,
         scale: defaultStyle.scale
       }
       marker = new Marker({
         geom: [data.longitude, data.latitude],
         style: iconStyle,
         attributes
       })
       layer.add(marker)
     }
   }
}
</script>
<style lang="scss">

</style>
<style lang="scss" scoped>
#locateMap{
  width: 600px;
  height: 500px;
}
.map-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
}
.opeate-buttons{
  margin-top: 10px;
  text-align: right;
}
</style>
