<template>
  <el-container class="ke-layout ka-perfor">
    <el-main>
      <el-row class="pe-top">
        <el-col
          :span="8"
          class="pe-top-left"
        >
          <el-row>
            <el-col
              :span="24"
            >
              <div class="pe-top-title">
                <img
                  class="pic-404__child left"
                  :src="`${require('@/assets/performance/cpu.png')}`"
                >
                cpu
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
              class="grid-coent-line"
            >
              <div class="grid-content bg-purple">
                <div class="grid-content-title">
                  核心数
                </div>
                <div class="pe-numb pe-red mb32">
                  {{ selections.serverCpuVO.cpuNum || 0 }}
                </div>
              </div>
            </el-col>
            <el-col
              :span="12"
              class="grid-coent-line noliner"
            >
              <div class="grid-content bg-purple-light">
                <div class="grid-content-title">
                  用户使用率
                </div>
                <div class="pe-numb pe-red mb32">
                  {{ selections.serverCpuVO.usedRate || 0 }}%
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="12"
              class="grid-coent-line nolineb"
            >
              <div class="grid-content bg-purple">
                <div class="grid-content-title">
                  系统使用率
                </div>
                <div class="pe-numb pe-red mb32">
                  {{ selections.serverCpuVO.sysRate || 0 }}%
                </div>
              </div>
            </el-col>
            <el-col
              :span="12"
              class="grid-coent-line nolinerb"
            >
              <div class="grid-content bg-purple-light">
                <div class="grid-content-title">
                  当前空闲率
                </div>
                <div class="pe-numb pe-red mb32">
                  {{ selections.serverCpuVO.freeRate || 0 }}%
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col
          :span="16"
          class="pe-top-right"
        >
          <el-row>
            <el-col
              :span="24"
            >
              <div class="pe-top-title">
                <img
                  class="pic-404__child left"
                  :src="`${require('@/assets/performance/neicun.png')}`"
                >
                内存
              </div>
            </el-col>
          </el-row>
          <el-row class="pe-top-contentImg">
            <el-col
              :span="6"
            >
              <img
                class="pic-404__child left"
                :src="`${require('@/assets/performance/zongneicun.png')}`"
              >
              <el-row>
                <el-col :span="10">
                  内存<br>
                  <span class="pe-top-contentImg-fonts pe-top-contentImg-red">
                    {{ selections.serverMemVO.totalNum }}M
                  </span>
                </el-col>
                <el-col :span="2">
                  <br>|
                </el-col>
                <el-col :span="10">
                  JVM<br>
                  <span class="pe-top-contentImg-fonts pe-top-contentImg-red">
                    {{ selections.serverJvmVO.totalNum }}M
                  </span>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :span="6"
            >
              <img
                class="pic-404__child left"
                :src="`${require('@/assets/performance/yiyong.png')}`"
              >
              <el-row>
                <el-col :span="10">
                  内存<br>
                  <span class="pe-top-contentImg-fonts pe-top-contentImg-yellow">
                    {{ selections.serverMemVO.usedNum }}M
                  </span>
                </el-col>
                <el-col :span="2">
                  <br>|
                </el-col>
                <el-col :span="10">
                  JVM<br>
                  <span class="pe-top-contentImg-fonts pe-top-contentImg-yellow">
                    {{ selections.serverJvmVO.usedNum }}M
                  </span>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :span="6"
            >
              <img
                class="pic-404__child left"
                :src="`${require('@/assets/performance/shengyu.png')}`"
              >
              <el-row>
                <el-col :span="10">
                  内存<br>
                  <span class="pe-top-contentImg-fonts pe-top-contentImg-green">
                    {{ selections.serverMemVO.freeNum }}M
                  </span>
                </el-col>
                <el-col :span="2">
                  <br>|
                </el-col>
                <el-col :span="10">
                  JVM<br>
                  <span class="pe-top-contentImg-fonts pe-top-contentImg-green">
                    {{ selections.serverJvmVO.freeNum }}M
                  </span>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              :span="6"
            >
              <img
                class="pic-404__child left"
                :src="`${require('@/assets/performance/shiyonglv.png')}`"
              >
              <el-row>
                <el-col :span="10">
                  内存<br>
                  <span class="pe-top-contentImg-fonts pe-top-contentImg-blue">
                    {{ selections.serverMemVO.usedRate }}%
                  </span>
                </el-col>
                <el-col :span="2">
                  <br>|
                </el-col>
                <el-col :span="10">
                  JVM<br>
                  <span class="pe-top-contentImg-fonts pe-top-contentImg-blue">
                    {{ selections.serverJvmVO.usedRate }}%
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row class="pe-center1">
        <el-row>
          <el-col
            :span="24"
          >
            <div class="pe-top-title">
              <img
                class="pic-404__child left"
                :src="`${require('@/assets/performance/fuwuqi.png')}`"
              >
              服务器信息
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            :span="6"
          >
            <div class="pe-server">
              <img
                :src="`${require('@/assets/performance/mingcheng.png')}`"
              >
              <span>
                服务器名称<br>
                <span class="server-blue">
                  {{ selections.serverSysVO.computerName }}
                </span>
              </span>
            </div>
          </el-col>
          <el-col
            :span="6"
          >
            <div class="pe-server">
              <img
                :src="`${require('@/assets/performance/IP.png')}`"
              >
              <span>
                服务器IP<br>
                <span class="server-green">
                  {{ selections.serverSysVO.computerIp }}
                </span>
              </span>
            </div>
          </el-col>
          <el-col
            :span="6"
          >
            <div class="pe-server">
              <img
                :src="`${require('@/assets/performance/xitong.png')}`"
              >
              <span>
                操作系统<br>
                <span class="server-violet">
                  {{ selections.serverSysVO.osName }}
                </span>
              </span>
            </div>
          </el-col>
          <el-col
            :span="6"
          >
            <div class="pe-server">
              <img
                :src="`${require('@/assets/performance/jiagou.png')}`"
              >
              <span>
                系统架构<br>
                <span class="server-yellow">
                  {{ selections.serverSysVO.osArch }}
                </span>
              </span>
            </div>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="pe-center2">
        <el-row>
          <el-col
            :span="24"
          >
            <div class="pe-top-title">
              <img
                class="pic-404__child left"
                :src="`${require('@/assets/performance/java.png')}`"
              >
              Jave虚拟机信息
            </div>
          </el-col>
        </el-row>
        <el-row class="pe-center2-content">
          <el-col
            :span="2"
          >
            <el-row>
              <el-col class="pe-center2-content-t">
                Jave名称
              </el-col>
            </el-row> 
            <el-row>
              <el-col class="pe-center2-content-t">
                启动时间
              </el-col>
            </el-row> 
            <el-row>
              <el-col class="pe-center2-content-t">
                安装路径
              </el-col>
            </el-row> 
          </el-col>
          <el-col
            :span="10"
          >
            <el-row>
              <el-col class="pe-center2-content-t2">
                {{ selections.serverJvmVO.javaName }}
              </el-col>
            </el-row> 
            <el-row>
              <el-col class="pe-center2-content-t2">
                {{ selections.serverJvmVO.startTime }}
              </el-col>
            </el-row> 
            <el-row>
              <el-col class="pe-center2-content-t2 botline">
                {{ selections.serverJvmVO.javaHome }}
              </el-col>
            </el-row> 
          </el-col>
          <el-col
            :span="2"
          >
            <el-row>
              <el-col class="pe-center2-content-t">
                Jave版本
              </el-col>
            </el-row> 
            <el-row>
              <el-col class="pe-center2-content-t">
                运行时长
              </el-col>
            </el-row> 
            <el-row>
              <el-col class="pe-center2-content-t">
                项目路径
              </el-col>
            </el-row> 
          </el-col>
          <el-col
            :span="10"
          >
            <el-row>
              <el-col class="pe-center2-content-t2">
                {{ selections.serverJvmVO.javaVersion }}
              </el-col>
            </el-row> 
            <el-row>
              <el-col class="pe-center2-content-t2">
                {{ selections.serverJvmVO.runTime }}
              </el-col>
            </el-row> 
            <el-row>
              <el-col class="pe-center2-content-t2 botline">
                {{ selections.serverJvmVO.projectDir }}
              </el-col>
            </el-row> 
          </el-col>
        </el-row>
      </el-row>
      <el-row class="pe-center3">
        <el-row>
          <el-col
            :span="24"
          >
            <div class="pe-top-title">
              <img
                class="pic-404__child left"
                :src="`${require('@/assets/performance/neicun.png')}`"
              >
              磁盘状态
            </div>
          </el-col>
        </el-row>
        <el-row class="pe-center3-content">
          <el-table
            :data="selections.listServerSysFileVO"
            border
            style="width: 100%;height:100%;"
          >
            <el-table-column
              prop="dirName"
              label="盘符路径"
            >
              <template scope="scope">
                <span class="taleft">{{ scope.row.dirName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="typeName"
              label="文件系统"
            >
              <template scope="scope">
                <span class="taleft">{{ scope.row.typeName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="sysTypeName"
              label="盘符类型"
            />
            <el-table-column
              prop="totalNum"
              label="总大小"
              width="150"
            > 
              <template scope="scope">
                <span class="blue3">{{ scope.row.totalNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="freeNum"
              label="可用大小"
              width="150"
            >
              <template scope="scope">
                <span class="blue3">{{ scope.row.freeNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="usedNum"
              label="已用大小"
              width="150"
            >
              <template scope="scope">
                <span class="blue3">{{ scope.row.usedNum }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="usedRate"
              label="已用百分比"
              width="150"
            >
              <template scope="scope">
                <span class="blue3">{{ scope.row.usedRate }}%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  components: {}
})
export default class extends Vue {
  private selections: Object = {
    serverCpuVO: {
      cpuNum: '',
      freeRate: '',
      sysRate: '',
      usedRate: ''
    },
    serverSysVO: {
      computerIp: '',
      computerName: '',
      osArch: '',
      osName: ''
    },
    serverMemVO: {
      freeNum: '',
      totalNum: '',
      usedNum: '',
      usedRate: ''
    },
    serverJvmVO: {
      freeNum: '',
      totalNum: '',
      usedNum: '',
      usedRate: '',
      javaHome: '',
      javaName: '',
      javaVersion: 'string',
      projectDir: 'string',
      runTime: 'string',
      startTime: 'string'
    },
    listServerSysFileVO: []
  }
  private date: string = ''
  private percentage: number = 10
  private colors: Array<any> = [
    {color: '#1890ff', percentage: 25},
    {color: '#13ce66', percentage: 50},
    {color: '#FFBA00', percentage: 75},
    {color: '#ff4949', percentage: 100}
  ]
  created() {
    this.load()
  }
  private load(): void {
    this.$http.request({
      url: '/sys/momitorlog/now',
      method: 'get',
      data: {}
    }).then((res: any) => {
      this.selections = res.data
      console.log(res.data)
    })
  }
  // @Watch('selectionItem')
  // private onDialogVisibleChanged(val: boolean, oldVal: boolean): void {
  //   this.selections = val
  // }
}
</script>
<style lang="scss">
  .pe-center3{
    .el-table thead tr th{
      background: #F5F7F9!important;
    }
    .cell{
      text-align: center!important;
      color:#666!important;
    }
    .el-table_1_column_4,.el-table_1_column_5,.el-table_1_column_6,.el-table_1_column_7{
      .cell{
        color: #2192D9!important;
      }
    }
    .taleft{
      text-align:left!important;
      display: block;
    }
  }
</style>
<style lang="scss" scoped>
@function vh($px) {
  @return ($px / 1080) * 100vh;
}
.ka-perfor{
  font-size: vh(16);
  font-family: 'NotoSansHans-Regular';
  .pe-top-title{
    font-size: vh(18);
    img {
      vertical-align: middle;
      width: vh(30);
      height: vh(30);
    }
  }
  .noliner{
    border-right:none!important;
  }
  .nolineb{
    border-bottom:none!important;
  }
  .nolinerb{
    border-bottom:none!important;
    border-right:none!important;
  }
  .grid-coent-line{
    border-right: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
    .grid-content{
      text-align: center;
      font-size: vh(16);
      color: #666;
      margin-top: vh(13);
      .pe-numb{
        font-size: vh(22);
        font-family: 'NotoSansHans-Bold';
      }
      .grid-content-title{
        margin-top: vh(26);
        margin-bottom: vh(20);
      }
    }
    .mb32{
      margin-bottom: vh(32);
    }
  }
  .pe-top{
    height: vh(321);
    margin-bottom: 15px;
    .pe-top-left,.pe-top-right{
      background: #fff;
      border-radius: 5px;
      padding: 10px;
      height: 100%;
    }
    .pe-top-right{
      width: calc(66.66667% - 15px)!important;
      margin-left: 15px;
      .pe-top-contentImg{
        font-size: vh(16);
        margin-top: vh(19);
        img{
          width: vh(122);
          height: vh(122);
        }
        .el-col-6 {
          text-align: center;
        }
        .pe-top-contentImg-fonts{
          font-size: vh(22);
          margin-top: vh(31);
          display: block;
          font-family: 'NotoSansHans-Bold';
        }
        .pe-top-contentImg-red{
          color: #FF4347;
        }
        .pe-top-contentImg-yellow{
          color:#FEC200;
        }
        .pe-top-contentImg-green{
          color:#14CF68;
        }
        .pe-top-contentImg-blue{
          color:#20A1FF;
        }
      }
    }
  }
  .pe-center1{
    background: #fff;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;
    height: vh(202);
    .el-col-6 {
      text-align: center;
      .pe-server{
        margin-top: vh(44);
        img{
          width: vh(63);
          height: vh(63);
          margin-right: vh(18);
        }
        span{
          display: inline-block;
          text-align: left;
          line-height: vh(38);
        }
        .server-blue{
          color: #027ACD;
        }
        .server-yellow{
          color: #F8B71E;
        }
        .server-violet{
          color: #775CDE
        }
        .server-green{
          color: #5EB72F
        }
      }
    }
  }
  .pe-center2{
    background: #fff;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;
    height: vh(297);
    .pe-center2-content{
      margin-top:vh(29);
      margin-left:vh(26);
      margin-right:vh(26)
    }
    .pe-center2-content-t{
      color:#666666;
      text-align: center;
      background: #F5F7F9;
      line-height: vh(46);
      padding-top:1px;
    }
    .pe-center2-content-t2{
      color:#666666;
      text-align: left;
      line-height: vh(46);
      padding-left: 30px;
      border-top: 1px solid #F5F7F9;
    }
    .botline{
      border-bottom: 1px solid #F5F7F9;
    }
  }
  .pe-center3{
    background: #fff;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 15px;
    height: vh(596);
    .pe-center3-content{
      margin-top:vh(29);
      margin-left:vh(26);
      margin-right:vh(26)
    }
    .blue3{
      color: #2192D9;
      text-align: center;
      display: block;
    }
  }
}

</style>
