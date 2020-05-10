<template>
  <div class="page">
    <el-tabs
      v-model="tabs.activeName"
      class="tabs"
      :before-leave="handleTabs"
    >
      <el-tab-pane
        label="基础信息"
        name="base"
      >
        <el-row class="header">
          <el-col :span="3">
            <span class="tip">●</span>案卷编号：
          </el-col>
          <el-col :span="9">
            {{ row.evtCodeStr }}
          </el-col>
          <el-col :span="3">
            <span class="tip">●</span>受理时间：
          </el-col>
          <el-col :span="9">
            {{ row.receiveTime }}
          </el-col>
          <el-col :span="3">
            <span class="tip">●</span>监督员：
          </el-col>
          <el-col :span="9">
            {{ row.receiveTime }}
          </el-col>
          <el-col :span="3">
            <span class="tip">●</span>案件来源：
          </el-col>
          <el-col :span="9">
            {{ row.evtResource }}
          </el-col>
          <el-col :span="3">
            <span class="tip">●</span>案件类别：
          </el-col>
          <el-col :span="9">
            {{ row.evtClassName }}
          </el-col>
          <el-col :span="3">
            <span class="tip">●</span>案件等级：
          </el-col>
          <el-col :span="9">
            {{ row.eventLevelStr }}
          </el-col>
        </el-row>
        <table
          class="kd-table table"
          cellspacing="0"
          cellpadding="0"
          border="0"
        >
          <colgroup>
            <col style="width:13%;">
            <col style="width:40%;">
            <col style="width:47%;">
          </colgroup>
          <tbody>
            <tr>
              <th>所属区域：</th>
              <td> {{ row.areaNameStr }}</td>
              <td
                rowspan="5"
                style="height:217px;"
              >
                <event-map
                  v-if="row.id>0&&row.absX&&row.absY"
                  :row="row"
                />
                <div
                  v-else
                  class="ke-no-data"
                >
                  当前案件无位置信息
                </div>
              </td>
            </tr>
            <tr>
              <th>案件坐标：</th>
              <td class="tab-width">
                X：{{ row.absX }}  Y：{{ row.absY }}
              </td>
            </tr>
            <tr>
              <th>案发位置：</th>
              <td class="tab-width">
                {{ row.evtLocation }}
              </td>
            </tr>
            <tr>
              <th>问题描述：</th>
              <td class="tab-width">
                {{ row.content }}
              </td>
            </tr>
            <tr>
              <th>备注：</th>
              <td class="tab-width">
                {{ row.note }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <div class="title">
            附件信息：
          </div>
          <div>
            图片 {{ row.statisticsVO.picNum }} 张，
            音频 <a class="ke-a">{{ row.statisticsVO.recordingNum }}</a> 份，
            视频 <a class="ke-a">{{ row.statisticsVO.videoNum }}</a> 份
          </div>
          <el-row class="images">
            <el-col :span="12">
              <div class="horn qian" />
              <ke-images
                ref="qianImages"
                height="190px"
                class="phone"
              />
            </el-col>
            <el-col :span="12">
              <div class="horn hou" />
              <ke-images
                ref="houImages"
                height="190px"
                class="phone"
              />
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="案件流程"
        name="flow"
      >
        <event-flow
          v-if="tabs.isFlow"
          :id="row.id"
        />
      </el-tab-pane>
      <el-tab-pane
        label="修改记录"
        name="update"
      >
        <update-rows
          v-if="tabs.isUpdate"
          :id="row.id"
        />
      </el-tab-pane>
      <el-tab-pane
        label="知识库"
        name="dge"
      >
        <knowle-dge
          v-if="tabs.isDge"
          :id="row.id"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="isCase"
        :id="row.id" 
        label="案件查重"
        name="case"
      >
        <event-case v-if="tabs.isCase" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import KeImages from '@/components/keImages.vue'
import EventMap from './map.vue'
@Component({
  components: {
    KeImages,
    EventMap,
    EventFlow: () => import('./flow.vue'),
    UpdateRows: () => import('../updateRows.vue'),
    knowleDge: () => import('../knowledge.vue'),
    EventCase: () => import('../case.vue')
  }
})
export default class extends Vue {
    @Prop({ default: false }) private isCase!:boolean
    @Prop() private row:any
    private tabs:any = {
      activeName: 'base',
      isFlow: false,
      isUpdate: false,
      isDge: false,
      isCase: false
    }
    created(){
    }
    handleTabs(name:string){
      if (name === 'flow' && this.tabs.isFlow === false){
        this.tabs.isFlow = true
      } else if (name === 'update' && this.tabs.isUpdate === false){
        this.tabs.isUpdate = true
      } else if (name === 'dge' && this.tabs.isDge === false){
        this.tabs.isDge = true
      } else if (name === 'case' && this.tabs.isCase === false){
        this.tabs.isCase = true
      }
    }
    @Watch('row')
    private onRowChanged(): void {
      const qian = (this.$refs.qianImages as any)
      qian.setData(this.resImgs(this.row.annexeBeforeList))
      const hou = (this.$refs.houImages as any)
      hou.setData(this.resImgs(this.row.annexeAfterList))
    }
    private resImgs(data:Array<any>):Array<string>{
      let imgs:Array<string> = []
      data.forEach((element:any) => {
        if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(element.annexeType)) {
          imgs.push(element.filePath)
        }
      })
      return imgs
    }
}
</script>
 
<style lang="scss" scoped>
.page{
    .tabs{
        .el-tab-pane{
            overflow: auto;
            height:480px;
        }
    }
    .header{
        .tip{
            color: #028CFF;
            margin-right: 8px;
            font-size: 18px;
        }
        > div{
            height:32px;
            line-height: 32px;
        }
        .el-col-9{
            padding-left: 6px;
        }
    }
    .table{
        margin-top: 15px;
        width:calc(100% -  20px);
        .tab-width{
          border-right-width: 1px!important ;
        }
    }
    .footer{
        .title {
            color: #028CFF;
            font-size: 16px;
            margin: 25px 0 8px 0;
        }
        .images{
            margin-top: 15px;
            .el-col-12{
                position: relative;
                height:190px;
                .phone{
                    width:calc(100% - 60px);
                }
                .horn {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-position: center center;
                    width: 60px;
                    height: 60px;
                    z-index: 999;
                }
                .qian{
                    background: url(~@/assets/business/task/qian.png) no-repeat left top;
                }
                .hou{
                    background: url(~@/assets/business/task/hou.png) no-repeat left top;
                }
            }
        }
    }
}
.details{
  .tabs{
    .el-tab-pane{
        overflow: auto;
        height:440px!important;
    }
  }
}
@media (min-width: 1400px) { 
  .page{
    .tabs{
        .el-tab-pane{
            height:730px;
        }
    }
  }
  .details{
    .tabs{
        .el-tab-pane{
            height:690px;
        }
    }
  }
}
</style>
