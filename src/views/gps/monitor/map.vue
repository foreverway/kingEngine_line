/* eslint-disable vue/valid-v-for */
<template>
  <el-container class="ke-layout">
    <ul class="ka-rightMenu">
      <li 
        class="ka-bottom10"
        @click="switchingMap(0)"
      >
        <svg-icon
          title="清除"
          name="del"
          :class="{classred:blueClass==0}"
        />
      </li>
      <li 
        class="ka-bottom10"
        @click="switchingMap(1)"
      >
        <svg-icon
          title="测距"
          name="ranging"
          :class="{classred:blueClass==1}"
        />
      </li>
      <li 
        class="ka-bottom10"
        @click="switchingMap(2)"
      >
        <svg-icon
          title="测面积"
          name="area"
          :class="{classred:blueClass==2}"
        />
      </li>
      <li 
        class="ka-line ka-noblr"
        @click="switchingMap(3)"
      >
        <svg-icon
          title="放大地图范围"
          name="plus"
          :class="{classred:blueClass==3}"
        />
      </li>
      <li 
        class="ka-notlr ka-bottom10"
        @click="switchingMap(4)"
      >
        <svg-icon
          title="缩小地图范围"
          name="reduce"
          :class="{classred:blueClass==4}"
        />
      </li>
    </ul>
    <el-form
      class="ka-form"
    >
      <el-row>
        <el-col :span="24">
          <el-dropdown 
            v-for="(item,key) in dataMenu" 
            :key="key" 
            trigger="click"
            @click.native="handleCommand(key)"
          >
            <span 
              class="el-dropdown-link"
              :class="{classred:menuClass==key}" 
              @click.native="clickLink()"
            >
              <svg-icon :name="item.className" />
              {{ item.name }}
            </span>
            <el-dropdown-menu> 
              <!-- v-if="item.child" -->
              <el-dropdown-item 
                v-for="(list,index) in item.child" 
                :key="index" 
                :command="index"
              >           
                <el-checkbox v-if="list.check">
                  {{ list.name }}
                </el-checkbox>
                <span 
                  v-else-if="item.className === 'weather'" 
                  ref="contlist"
                  @mouseout="startScroll"
                  @mouseover="stopScroll"
                >
                  {{ list.name }}
                </span>
                <span 
                  v-else-if="item.className === 'basemap'" 
                  @click="switchMap(list.index)"
                >
                  <img
                    :src="list.icon"
                  >
                  {{ list.name }}
                </span>
                <span v-else>
                  <svg-icon 
                    v-if="item.className === 'Legend'"
                    :name="list.icon"
                    :class="list.class"
                  />
                  {{ list.name }}
                </span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-form>
    <div id="mapDiv" />
    <!-- <div
      id="overlay"
      class="overlay-box"
    >
      <div class="over-row">
        <div class="col">
          打卡时间:
        </div>
        <div class="col">
          20：94：34
        </div>
      </div>
      <div class="over-row">
        <div class="col">
          打卡类型:
        </div>
        <div class="col">
          12
        </div>
      </div>
      <div class="img-row">
        <div class="col">
          打卡图片:
        </div>
      </div>
      <div class="san" />
    </div> -->
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import 'kmap/kmap.css'
import KMap from 'kmap/KMap'
import XYZLayer from 'kmap/layer/XYZLayer' 
import Measure, { Type as MeasureType } from 'kmap/interaction/Measure' // 地图测量插件
import VectorLayer from 'kmap/layer/VectorLayer' // 添加图层
import Marker from 'kmap/geom/Marker' // 点
// import Polyline from 'kmap/geom/Polyline' // 画线
import Polygon from 'kmap/geom/Polygon' // 多点
import Graphic,{ GraphicType } from 'kmap/geom/Graphic' // 参数设置绘制图形的类型
import Overlay from 'kmap/Overlay' // 弹窗
let mapParameter = require('../mapConfig.json')
let map: any = null

@Component({
  components: {
    // EventForm: () => import('./form.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) defaultProps !: any
  @Prop({ type: Array, default: {} }) queryData !: any
  private locationPoint: any = {} // 定位Marker
  private layer: any = {} // 其它图层
  private administrationLayer: any = {} // 行政区域图层
  private queryLayer: any = {} // 查询图层
  private blueClass: any = {}
  private menuClass: any = {}
  private scrollW: any = 0
  private scrollTime: any = {} 
  private img: any = {
    cn_canvas: require('@/assets/gps/cn_canvas.jpg'),
    tempimagery: require('@/assets/gps/tempimagery.jpg')
  }
  private dataMenu: Array<any> = [
    {name: '图层',
      className: 'layer',
      child: [
        {check: true,name: '车辆'}
      ]
    },
    {name: '图例',
      className: 'Legend',
      child: [
        {name: '离线',icon: 'vehicle',class: 'prohibitColor'},
        {name: '在线',icon: 'vehicle',class: 'vehicleColor'}
      ]
    },
    {name: '天气',
      className: 'weather',
      child: [
        {name: 'CSS calc() 函数 CSS 函数 实例 使用 calc() 函数计算 <div> 元素的宽度: [mycode3 type=cs'}
      ]
    },
    {name: '地图',
      className: 'basemap',
      child: [
        {name: '矢量',icon: this.img.cn_canvas,index: 0, class: 'prohibitColor'},
        {name: '影像',icon: this.img.tempimagery,index: 1,class: 'vehicleColor'}
      ]
    }
  ]
  created(){
    
  }
  mounted() {
    this.initMap()
    this.creatVectorLayer()
  }
  private initMap(target = 'mapDiv'): void {
    let layer = mapParameter.layers[0]
    map = new KMap({
      target,
      view: {
        center: mapParameter.center,
        zoom: 14,
        projection: 'EPSG:4326'
      },
      layers: [
        new XYZLayer('vec', { // 矢量底图
          url: layer.vec.url,
          visible: true
        }),
        new XYZLayer('cva', { // 矢量文字
          url: layer.cva.url,
          visible: true
        }),
        new XYZLayer('img', { // 影像底图
          url: layer.img.url,
          visible: false
        }),
        new XYZLayer('cia', { // 影像文字
          url: layer.cia.url,
          visible: false
        })
      ]
    })
  }
  private creatVectorLayer(): void {
    this.layer = new VectorLayer('vec')
    this.administrationLayer = new VectorLayer('administration')
    this.queryLayer = new VectorLayer('query')
    // type是图形类型，表示只有这种类型的图形，才会使用该渲染参数
    this.administrationLayer.setStyle([
      {
        type: GraphicType.POLYGON,
        width: 4,
        color: 'rgba(255,51,255,0.4)',
        fillColor: 'rgba(23,145,252,0.4)'
      }
    ])
    // type是图形类型，表示只有这种类型的图形，才会使用该渲染参数
    this.queryLayer.setStyle([
      {
        type: GraphicType.MARKER,
        src: mapParameter.marker.src, // 图片路径
        size: mapParameter.marker.size, // 尺寸必填
        anchor: [0.5, 1]
      }
    ])
    map.addLayer(this.queryLayer) // 查询图层
    map.addLayer(this.layer) // 添加其它图层
    map.addLayer(this.administrationLayer) // 添加图层
  }
  private handleCommand(index): void {
    clearInterval(this.scrollTime) // 清除定时器
    if (this.menuClass === index){
      this.menuClass = null
      return
    }
    // map.un('singleclick',this.setMarker) // 解绑点击事件
    // if (index === 0){
    //   this.locationPoint = null // 删除定位标记
    //   map.setInteraction() // 清空测量工具
    //   this.layer.clear() // 清空图层中的图形
    //   // map.removeLayer(this.layer) // 删除图层
    // } else if (index === 1 || index === 2){
    //   if (this.locationPoint && this.locationPoint.featureInternal){
    //     this.layer.remove(this.locationPoint) // 删除marker图形
    //     this.locationPoint = null // 删除定位标记
    //   }
    //   let type = index === 1 ? MeasureType.LENGTH : MeasureType.AREA // 线LENGTH ，面积AREA
    //   let tool1 = new Measure(type)
    //   map.setInteraction(tool1)
    // } else 
    if (index === 0){
      map.setInteraction() // 清空测量工具
    } else if (index === 2){
      this.startScroll()
    }
    this.menuClass = index
    this.blueClass = null
  }
  private switchingMap(key): void {
    if (key === 4){
      map.zoomOut()
    } else if (key === 3){
      map.zoomIn()
    } else if (key === 1 || key === 2){
      if (this.locationPoint && this.locationPoint.featureInternal){
        this.layer.remove(this.locationPoint) // 删除marker图形
        this.locationPoint = null // 删除定位标记
      }
      let type = key === 1 ? MeasureType.LENGTH : MeasureType.AREA // 线LENGTH ，面积AREA
      let tool1 = new Measure(type)
      map.setInteraction(tool1)
      // map.setInteraction() // 清空测量工具
      // if (this.blueClass === key){
      //   this.blueClass = null
      //   map.un('singleclick',this.setMarker) // 解绑点击事件
      //   return
      // }
      // map.on('singleclick', this.setMarker) // 绑定点击事件
    } else if (key === 0){
      this.locationPoint = null // 删除定位标记
      map.setInteraction() // 清空测量工具
      this.layer.clear() // 清空图层中的图形
      // map.setExtent(mapParameter.extent) // 区域范围坐标
      if (this.blueClass === key){
        this.blueClass = null
        return
      }
    }
    this.menuClass = null
    this.blueClass = key
  }
  private setMarker(e): void { // 地图点击定位坐标
    if (this.locationPoint && this.locationPoint.featureInternal){
      this.layer.remove(this.locationPoint) // 删除marker图形
    }
    this.locationPoint = new Marker({
      geom: e.coordinate,
      style: {
        src: mapParameter.marker.src, // 图片路径
        size: mapParameter.marker.size // 尺寸必填
      }
    })
    this.layer.add([this.locationPoint])
  }
  private startScroll(): void { 
    const target = this.$refs.contlist[0]
    this.scrollW = target.offsetLeft // 移开时记录向左移动的距离
    this.scroll()
  }
  // private setmaptype(): void { 
  //   debugger
  // }
  private stopScroll(): void { 
    const target = this.$refs.contlist[0]
    clearInterval(this.scrollTime)
  }
  private scroll(): void { 
    let that = this // 因为定时器里要使用vue对象时不能用this, 在定时器中的 this 代表
    let target = this.$refs.contlist[0]
    let initLeft = 0  
    if (this.scrollW < 0){
      initLeft = this.scrollW * (-1)
    }
    // 定时器
    this.scrollTime = setInterval(function(){
      initLeft++
      if (initLeft >= target.offsetWidth / 1 ){
        initLeft = 0
      }
      target.style.left = '-' + initLeft + 'px' // 获取不到translateX的值改用 left
    },30)
  }
  private switchMap(num): void { // 切换底图
    let vecLayer = map.getLayer('vec')
    vecLayer.setVisible(num === 0)
    let cvaLayer = map.getLayer('cva')
    cvaLayer.setVisible(num === 0)
    let imgLayer = map.getLayer('img')
    imgLayer.setVisible(num === 1)
    let ciaLayer = map.getLayer('cia')
    ciaLayer.setVisible(num === 1)
  }
  @Watch('defaultProps.data')
  private switchAdministration(newVal:Array<any>,oleVal:Array<any>) {
    this.administrationLayer.clear() // 清空图层中的图形
    for (let i = 0; i < newVal.length; i++){
      let polygon = new Polygon({
        geom: [newVal[i]]
      })
      this.administrationLayer.add([polygon]) // 图层添加多边形
    }
  }
  @Watch('queryData')
  private switchQueryResults(newVal:Array<any>,oleVal:Array<any>) {
    map.un('singleclick',this.getMarkerMsg) // 解绑点击事件
    this.queryLayer.clear() // 清空图层中的图形
    for (let i = 0; i < newVal.length; i++){
      let marker = new Marker({
        attributes: { id: 1 },
        geom: [newVal[i].log,newVal[i].lat]
      })
      this.queryLayer.add([marker]) // 图层添加多个点
    }
    map.on('singleclick', this.getMarkerMsg) // 绑定点击事件
  }
  private getMarkerMsg(e): void { // 地图点击定位坐标
    /* let selectedGraphics:Graphic[] = []
    map.forEachGraphicAtPixel(e.pixel, function (graphic, layer) {
      debugger
      if (graphic.getVisible()) {
        let popup = graphic.getPopup()
        if (!popup){
          let vectorLayer = layer as VectorLayer
          popup = vectorLayer.getPopup()
          graphic.setPopup(popup)
        }
        if (popup){
          selectedGraphics.push(graphic)
        }
      }
    })
    if (selectedGraphics.length > 0){
      let popup = document.getElementById('overlay')
      if (popup) {
        popup.style.display = 'block'
      }
      this.currentIndex = 0
      this.selectedGraphics = selectedGraphics
      let g1 = selectedGraphics[0]
      if (g1.getType() === GraphicType.MARKER){
        let marker = g1 as Marker
        overlay.setPosition(marker.getCoordinates())
      } else {
        overlay.setPosition(e.coordinate)
      }
    } else {
      this.closePopup()
    } */

    // map.forEachGraphicAtPixel(e.pixel, (graphic, layer) => {
    //   if (graphic.getType() === GraphicType.MARKER){
    //     let id = graphic.getAttribute('id')
    //     debugger
    //     // 添加overlay
    //     let overlay = new Overlay({
    //       id: '1',
    //       element: document.getElementById('overlay') || undefined,
    //       offset: [0, 5],
    //       autoPanMargin: 50
    //     })
        
    //     // 第二个参数默认为true，可通过map.overlay来获取
    //     map.addOverlay(overlay, true)
    //     // 在地图中心显示overlay
    //     let center = map.getCenter()
    //     overlay.setPosition(center)
    //   }
    // })
  }
  
}
</script>
<style lang="scss" scoped>
  #mapDiv{
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .el-dropdown-menu__item{
    img{
      width: 100px;
      height: 70px;
      vertical-align: middle;
      margin-bottom: 10px;
    }
  }
  .ka-rightMenu{
    position: absolute;
    z-index: 99;
    right: 10px;
    bottom: 10px;
    padding: 5px;
    border-radius: 3px;
    li{
      font-size: 20px;
      padding: 8px;
      color: #666;
      background: #fff;
      border-radius: 3px;
      box-shadow: 0px 2px 1px #888888;
    }
    .ka-notlr{
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
    .ka-noblr{
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
    .ka-bottom10{
      margin-bottom: 8px;
    }
    .ka-line{
      border-bottom: 1px solid #ccc;
    }
    .ka-chingMag{
      position: relative;
      .ka-switchmap{
        position: absolute;
        right: 38px;
        background: #fff;
        top: -60px;
        width: 215px;
        padding-left: 5px;
        img{
          width: 100px;
          height: 70px;
        }
        .ka-switchText{
          text-align: center;
          font-size: 16px;
        }
        .ka-switchmapDiv{
          display: inline-block;
        }
        .ka-switchmapDiv:hover img{
          border: 1px solid blue
        }
        .el-col{
          margin: 5px 0 5px;
        }
        // .el-col:first-child{
        //   margin-left: 5px;
        // }
      }
    }
  }
  .ka-form{
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 99;
    padding: 5px;
    background: #fff;
    border-radius: 10px;
    margin: 5px;
    .el-dropdown{
      font-size: 16px;
      padding: 2px 8px;
      margin: 8px 0;
      border-right: 1px solid #ccc;
      color: #666;
      cursor: default;
    }
    .el-dropdown:last-child{
      border-right:none;
    }
  }
  .classred{
    color:#0091ff
  }
  .vehicleColor{
    color:#3F87F1
  }
  .prohibitColor{
    color:#999
  }
  .el-dropdown-menu__item{
    position: relative;
    overflow: hidden;
    span{
      position: relative;
      display: block;
    }
  }
  .overlay-box{
    position: relative;
    background-color: #fff;
    width:270px;
    .img-row{
      display: flex;
      padding:10px 20px;
    }
    .over-row{
      display: flex;
      height: 30px;
      line-height: 30px;
      padding:10px 20px;
    }
    .col{
        margin-right: 10px;
      }
    .san{
      position: absolute;
      left:50%;
      bottom:-10px;
      width:0;
      height:0;
      margin-left: -10px;
      border-left:8px solid transparent;
      border-right:8px solid transparent;
      border-top:10px solid #fff;
    }
  }
</style>
