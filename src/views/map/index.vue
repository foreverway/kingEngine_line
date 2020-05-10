<template>
  <div class="page">
    <div
      :class="[left.drawer?'open':'close']"
      class="left"
    >
      内容待定
      <div
        class="ke-flex fold"
        @click="left.drawer=!left.drawer"
      >
        <i
          v-if="left.drawer"
          class="el-icon-arrow-left"
        />
        <i
          v-else
          class="el-icon-arrow-right"
        />
      </div>
    </div>
    <div
      :class="[right.drawer?'open':'close']"
      class="right"
    >
      内容待定
      <div
        class="ke-flex fold"
        @click="right.drawer=!right.drawer"
      >
        <i
          v-if="right.drawer"
          class="el-icon-arrow-right"
        />
        <i
          v-else
          class="el-icon-arrow-left"
        />
      </div>
    </div>
    <div
      id="map"
      class="map"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import 'kmap/kmap.css'
import KMap from 'kmap/KMap'
import XYZLayer from 'kmap/layer/XYZLayer'
let map:any = null
@Component({
})
export default class extends Vue {
  private left:any = {
    drawer: true
  }
  private right:any = {
    drawer: true
  }
  created() {
    
  }
  mounted() {
    map = new KMap({
      target: 'map',
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
  }
}
</script>
<style lang="scss" scoped>
.page{
  position: relative;
  $fold_width:1.8rem;
  $fold_height:4rem;
  .left,.right{
    position: absolute;
    top:0;
    background-color: #fff;
    z-index: 99;
    transition-property:all;
    transition-duration:.5s;
    border-top: 1px solid #ddd;
    .fold{
      position: absolute;
      top:50%;
      width:$fold_width;
      height:$fold_height;
      background-color: #fff;
      margin-top: -2rem;
      cursor: pointer;
      i{
        font-size: 1.3rem;
        color: #ddd;
        font-weight: 600;
      }
    }
  }
  .left{
    left:0;
    $width:22rem;
    width:$width;
    .fold{
      border-radius: 0 5px 5px 0;
      right:-$fold_width;
    }
    &.open{
      left:0;
    }
    &.close{
      left: -$width;
    }
  }
  .right{
    right:0;
    $width:20rem;
    width:$width;
    .fold{
      border-radius: 5px 0 0 5px;
      left:-$fold_width;
    }
    &.open{
      right:0;
    }
    &.close{
      right: -$width;
    }
  }
}
.map,.page{
    width:100%;
    height:100%;
}
</style>
