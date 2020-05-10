<template>
  <div class="flow">
    <ul class="title">
      <li />
      <li>当前环节：责任单位处理</li>
      <li>登记操作员：张小美</li>
      <li>
        <div class="hj">
          环节：<el-select v-model="value">
            <el-option value="1">
              无
            </el-option>
          </el-select>
        </div>
      </li>
      <!-- <li>* 黄色环节超时</li> -->
    </ul>
    <ul class="grid">
      <li
        v-for="(node,key) in items"
        :key="key"
      >
        <span
          class="pic"
          style="background:#418df7"
        >{{ key+1 }}</span>            
        <div class="block" />            
        <span
          class="_title"
          style="background:#418df7"
        >
          {{ node.tacheName }}
        </span>            
        <table class="kd-table kd-table-grid">
          <thead>                    
            <tr>                      
              <th>经办人</th>                        
              <th>来件时间</th>                        
              <th>办结时间</th>                        
              <th style="width:100px">
                环节用时
              </th>                        
              <th>办理时限</th>                        
              <th style="width:136px">
                办理意见
              </th>                        
              <th style="width:55px">
                附件
              </th>                    
            </tr>                
          </thead>                
          <tbody>                    
            <tr>                      
              <td>{{ node.sendUser||'--' }}</td>                        
              <td>
                <div class="tdDiv">
                  <el-tooltip
                    v-if="node.startTime"
                    placement="bottom-start"
                  >
                    <div slot="content">
                      {{ node.startTime }}
                    </div>
                    <div class="tdDiv">
                      {{ node.startTime||'--' }}
                    </div>
                  </el-tooltip>
                </div>
              </td>                        
              <td>
                <div class="tdDiv">
                  <el-tooltip
                    v-if="node.endTime"
                    placement="bottom-start"
                  >
                    <div slot="content">
                      {{ node.endTime }}
                    </div>
                    <div class="tdDiv">
                      {{ !node.endTime?'---':node.endTime }}
                    </div>
                  </el-tooltip>
                </div>
              </td>                        
              <td aling="left">
                <el-tooltip
                  v-if="node.tacheUseTime"
                  placement="bottom-start"
                >
                  <div slot="content">
                    {{ node.tacheUseTime }}
                  </div>
                  <div class="tdDiv">
                    {{ !node.tacheUseTime?'---':node.tacheUseTime }}
                  </div>
                </el-tooltip>
              </td>                        
              <td>{{ node.tacheLimitTime||'--' }}</td>                        
              <td a>
                <el-tooltip
                  v-if="node.handleIdea"
                  :disabled="node.handleIdea.length<8"
                  placement="bottom-start"
                >
                  <div slot="content">
                    {{ node.handleIdea }}
                  </div>
                  <div
                    class="tdDiv"
                    style="width:130px"
                  >
                    {{ !node.handleIdea?'---':node.handleIdea }}
                  </div>
                </el-tooltip>
              </td>                        
              <td>
                <el-button
                  v-if="node.annexes&&node.annexes.length>0"
                  type="text"
                  @click="handleClick(node.annexes)"
                >
                  {{ node.annexes.length }}
                </el-button>
                <span v-else>0</span>
              </td>                    
            </tr>                
          </tbody>
        </table>
      </li>
    </ul>
    <ke-view-files
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :files="files"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch,Prop } from 'vue-property-decorator'

@Component({
  components: {
    KeViewFiles: () => import('@/components/keViewFiles.vue')
  }
})
export default class extends Vue {
    @Prop({default: 0}) private id!:number
    private dialog: any = {
      title: '',
      visible: false
    }
    private files:Array<any>=[]
    private items:Array<any>=[]
    private value:string=''
    private created(){
      this.load()
    }
    private load(){
      this.$http.post('evt/event/findEventFlowList',{id: this.id}).then((res:any) => {
        this.items = res.rows
      })
    }
    private handleClick(files:any){
      this.files = files
      this.dialog = {
        title: '查看附件列表',
        visible: true
      }
    }
}
</script>
 
<style lang="scss" scoped>
 .flow{
   height:100%;
  overflow: hidden;
   .tdDiv{
     white-space: nowrap;
    text-overflow: ellipsis;
    width: 97px;
    overflow: hidden;
    text-align: left;
   }
     width:calc(100% - 15px);
   .title {
      height: 48px;
      line-height: 46px;
      background: #efefef;
      border-top: 2px solid #fab21e;
      li {
          padding:0 6px;
          float:left;
          .hj{
            .el-select{
              width:150px!important;
            }
          }
          &:nth-child(1) {
              color:#f61e1e;
          }
          &:nth-child(5) { 
              color: #f61e1e;
              float:right;
          }
      }
    }
    .grid 
    {
      height: calc(100% - 63px);
      overflow: auto;
      margin-top: 15px;
      li {
          position:relative;
          min-height:80px;
          padding:40px 0px 10px 50px;
          th{
            color:#012F55;
            font-weight: 600;
          }
          td{
            color: #333333
          }
          .pic {
              display: inline-block;
              width: 30px;
              height: 30px;
              line-height: 30px;
              border-radius: 50%;
              background: #418df7;
              color: #fff;
              text-align: center;
              position: absolute;
              top: 0;
              left: 0;
              z-index:98;
          }
          .block {
              height: calc(100% - 17.5px);
              width: 60px;
              position: absolute;
              top: 15px;
              left: 15px;
              z-index: 98;
              border: 1px solid #dfdfdf;
              border-width: 1px 0 0 1px;
              z-index:97;
          }
          span._title {
                height: 24px;
                line-height: 24px;
                border-radius: 10px;
                padding: 0 17px;
                color: #fff;
                background: #418df7;
                width: auto;
                display: inline-block;
                position: absolute;
                top: 3px;
                left: 50px;
                z-index: 98;
            }
      }
    }
 }
</style>
