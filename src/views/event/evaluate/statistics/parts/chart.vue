<template>
  <el-container class="ke-layout statistics-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <p>数字化城市管理系统事部件统计表（2018-12-04 至 2018-12-04）</p>
        <el-header
          height="auto"
          class="chart-header"
        >
          <div class="ke-float-left ke-search-right">
            <label>统计条件</label>
            <ke-dict code="cccc" />
          </div>
          <div class="ke-buttons ke-float-right">
            <el-button
              :type="type1"
              size="mini"
              round
              @click="handleBar()"
            >
              柱状图
            </el-button>
            <el-button
              :type="type2"
              size="mini"
              round
              @click="handleLine()"
            >
              折线图
            </el-button>
            <el-button
              size="mini"
              round
            >
              打印
            </el-button>
          </div>
        </el-header>
        <el-main>
          <div
            v-if="type === 1"
            ref="echartsBar"
            v-loading="listenLoading"
            class="chart"
          />
          <div
            v-if="type === 2"
            ref="echartsLine"
            v-loading="listenLoading"
            class="chart"
          />
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import echarts from 'echarts'
@Component({
})
export default class extends Vue {
  // 1折线图  2柱状图
  private type: number = 1
  private type1: string = 'primary'
  private type2: string = 'normal'
  private listenLoading: boolean = true
  private params: any = {
    time1: '',
    time2: '',
    page: 1,
    rows: this.$base.grid.page,
    name: '',
    total: 0
  }
  private handleBar(): void {
    this.type = 1
    this.type1 = 'primary'
    this.type2 = 'normal'
    this.listenLoading = true
    this.$nextTick(() => {
      let rows = [
        {
          deptName: '报警类型1',
          deptPoints: 10
        },{
          deptName: '报警类型2',
          deptPoints: 20
        },{
          deptName: '报警类型3',
          deptPoints: 30
        },{
          deptName: '报警类型4',
          deptPoints: 40
        }
      ]
      this.initChartEcharts(rows)
      this.listenLoading = false
    })
  }
  private handleLine(): void {
    this.type = 2
    this.type1 = 'normal'
    this.type2 = 'primary'
    this.listenLoading = true
    this.$nextTick(() => {
      let rows = [
        {
          deptName: '报警类型1',
          deptPoints: 10
        },{
          deptName: '报警类型2',
          deptPoints: 20
        },{
          deptName: '报警类型3',
          deptPoints: 30
        },{
          deptName: '报警类型4',
          deptPoints: 40
        }
      ]
      this.initLineEcharts(rows)
      this.listenLoading = false
    })
  }
  mounted() {
    this.$nextTick(() => {
      let rows = [
        {
          deptName: '报警类型1',
          deptPoints: 10
        },{
          deptName: '报警类型2',
          deptPoints: 20
        },{
          deptName: '报警类型3',
          deptPoints: 30
        },{
          deptName: '报警类型4',
          deptPoints: 40
        }
      ]
      this.initChartEcharts(rows)
      this.listenLoading = false
    })
    // this.initTableData()
    console.log('这是图标了吗')
  }
  // 初始化图表
  private initChartEcharts(data){
    let nameStr:any = []
    let numStr:any = []
    data.forEach((item) => {
      nameStr.push(item.deptName)
      numStr.push(item.deptPoints)
    })
    let chartBox:any = echarts.init(this.$refs.echartsBar as HTMLDivElement)
    let option:object = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '4%',
        right: '10%',
        bottom: '1%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: nameStr,
        name: '设施缺损'
      },
      yAxis: {
        type: 'value',
        name: '上报数'
      },
      series: [{
        data: numStr,
        type: 'bar',
        itemStyle: {
          normal: {
            color: ['#409EFF'],
            label: {
              show: true,
              position: 'top',
              formatter: '{b}\n{c}'
            }
          }
        },
        name: '部门扣分',
        barMaxWidth: 40
      }]
    }
    chartBox.setOption(option)
  }
  // 初始化图表
  private initLineEcharts(data){
    let nameStr:any = []
    let numStr:any = []
    data.forEach((item) => {
      nameStr.push(item.deptName)
      numStr.push(item.deptPoints)
    })
    let chartBox:any = echarts.init(this.$refs.echartsLine as HTMLDivElement)
    let option:object = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'line' // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        left: '4%',
        right: '10%',
        bottom: '1%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: nameStr,
        name: '设施缺损'
      },
      yAxis: {
        type: 'value',
        name: '上报数'
      },
      series: [{
        data: numStr,
        type: 'line',
        itemStyle: {
          normal: {
            color: ['#409EFF'],
            label: {
              show: true,
              position: 'top',
              formatter: '{b}\n{c}'
            }
          }
        },
        name: '部门扣分',
        barMaxWidth: 50
      }]
    }
    chartBox.setOption(option)
  }
}
</script>

<style lang="scss">
.statistics-layout{
  .ke-body{
    padding: 0!important;
    margin: 0!important;
  }
  .el-main{
    padding: 0!important;
  }
}
.chart-header{
  .ke-search-right, .ke-buttons{
    margin-bottom: 0!important;
  }
}
</style>

<style lang="scss" scoped>
.chart{
  width:100%;
  height: 100%;
  margin: 0 auto;
}
p{
  text-align: center;
  // line-height: 30px;
  margin-bottom: 16px;
  font-weight: 600;
}
.loadingBox{
  height: 100%;
  width: 100%;
  background: pink;
}
</style>
