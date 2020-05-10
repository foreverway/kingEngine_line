<template>
  <el-container class="ke-layout">
    <el-aside
      class="ka-asidel"
      width="auto"
    >
      <template>
        <ul class="ka-legend">
          <li 
            v-for="(item,key) in selectData"
            :key="key"
            :title="item.title"
            :class="{'ka-legend-hover':item.code === serial}"
            @click="showPopup(item)"
          >
            <svg-icon
              :title="item.title"
              :name="item.name" 
              :class="item.color"
            />
          </li>
        </ul>
      </template>
    </el-aside>
    <ke-aside
      v-if="popup"
      class="ka-aside"
      width="300px"
      :popup.sync="popup"
      :title="popupTitle"
    >
      <query 
        v-if="serial === 1" 
        @setQueryResults="queryResults"
      />
      <car v-if="serial === 4" />
      <div v-if="serial === 2">
        <el-scrollbar class="tree-container">
          <el-tree
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            highlight-current
            node-key="id"
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </div>
      <enforcement-view v-if="serial === 3" />
    </ke-aside>
    <el-main class="ka-body">
      <div class="ka-map">
        <map-view 
          v-if="true" 
          :default-props="defaultProps"
          :query-data="queryData"
        />
      </div>
    </el-main>
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    KeAside: () => import('./keAside.vue'),
    query: () => import('./query.vue'),
    car: () => import('./car.vue'),
    MapView: () => import('./map.vue'),
    EnforcementView: () => import('./enforcement.vue')
  }
})
export default class extends Vue {
  // private activeName: string = 'first'
  private treeData: Array<any> = []
  private input1: string = ''
  private params: any = {}
  private popup:boolean=false
  private popupTitle: string = ''
  private serial:Number=0
  private selectData:Array<any>=[
    {
      title: '查询',
      name: 'query',
      color: 'queryColor',
      code: 1
    },
    {
      title: '行政区域',
      name: 'zoning',
      color: 'administrationColor',
      code: 2
    },
    {
      title: '执法人员',
      name: 'enforcement',
      color: 'enforcementColor',
      code: 3
    },
    {
      title: '车辆',
      name: 'vehicle',
      color: 'vehicleColor',
      code: 4
    }
  ]
  private queryData: Array<any> = []
  private defaultProps: any = {
    children: 'children',
    label: 'text',
    data: null
  }
  created() {
    // this.initTreeData()
  }
  mounted() {
    // this.initMap()
  }
  private initTreeData(): void {
    this.$http
      .request({
        url: '/privilege/findPrivilegeTree',
        method: 'post',
        data: {}
      })
      .then((res: any) => {
        this.treeData = res.data
      })
  }
  private handleNodeClick(data: any): void {
    let array
    if (data.id === 62){
      array = [[[108.301533,21.600347],[108.354233,21.595878],[108.373974,21.619818], [108.338955,21.643753],[108.314064,21.619658]],[[108.413628,21.628595],[108.415001,21.603379],[108.43869,21.621254]]]
    } else {
      array = [[[108.28059,21.623807],[108.306683,21.606412],[108.311489,21.619818]]]
    }
    this.defaultProps.data = array
  }
  private showPopup(data: any): void {
    this.popup = true
    this.serial = data.code
    this.popupTitle = data.title
  }
  private queryResults(data: any): void {
    this.queryData = data
  } 
  @Watch('popup')
  private onRouteChange(val: boolean, oldVal: boolean) {
    if (val === false){
      this.serial = 0
    }
  }
  
}
</script>
<style lang="scss">
 
</style>
<style lang="scss" scoped>
  .ka-asidel{
    background: #fff;
    margin: 10px 1px 10px 10px;
    padding: 10px 5px;
    .ka-legend{
      li{
        background: #F7F7F9;
        font-size: 18px;
        padding: 6px;
        text-align: center;
        border-radius: 3px;
        margin: 0 5px 5px;
        line-height: 18px;
      }
      li:hover{
        background: #E9E6E6;
      }
      .ka-legend-hover{
        background: #E9E6E6;
      }
    }
  }
  .ka-aside{
    background: #fff;
    margin: 10px 0px;
    padding: 10px;
    position: absolute;
    z-index: 999;
    height: calc(100% - 20px);
    left: 61px;
  }
  .ka-map{
    position: relative;
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  .ka-body{
    padding: 10px;
  }
  .queryColor{
    color:#FF3300
  }
  .vehicleColor{
    color:#3F87F1
  }
  .administrationColor{
    color:#2CC427
  }
  .enforcementColor{
    color:#FB8B34
  }
</style>
