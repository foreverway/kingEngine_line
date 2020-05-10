<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <el-form
            :model="params"
            class="ke-search"
            label-width="80px"
          >
            <el-row>
              <el-col :span="7">
                <el-form-item label="数字城管">
                  <el-row>
                    <el-col :span="11">
                      <el-select v-model="params.codeYear">
                        <el-option
                          v-for="(val,key) in eventYearArray"
                          :key="key"
                          :value="val"
                          :label="val"
                        />
                      </el-select>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item
                        label-width="51px"
                        label="字第"
                      >
                        <el-input v-model="params.codeNum" />
                      </el-form-item>
                    </el-col>
                    <el-col
                      :span="2"
                      style="color: #606266;"
                    >
                      &nbsp;号
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="受理号">
                  <el-input v-model="params.Accepted" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="案件类别">
                  <el-cascader
                    v-model="params.evtClassId"
                    :show-all-levels="false"
                    :options="ajlxArray"
                    :props="{value:'id',label:'text',emitPath:false}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="问题来源">
                  <ke-dict
                    v-model="params.evtResource"
                    code="evtSource"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="所属区域">
                  <ke-tree v-model="params.evtAreaId" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="案件环节">
                  <el-select v-model="params.workTache">
                    <el-option
                      v-for="(val,key) in waitArray"
                      :key="key"
                      :value="val.activityId"
                      :label="val.activityName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="案件状态">
                  <ke-dict
                    v-model="params.evtStatus"
                    code="evt_statu"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="6"
                class="buttons"
              >
                <el-button
                  class="button"
                  type="primary"
                  icon="el-icon-search"
                  @click="handleSearch"
                >
                  查 询
                </el-button>
                <!-- <el-button
                  class="button"
                  icon="el-icon-search"
                >
                  案件号查询
                </el-button>
                <el-button
                  class="button"
                  icon="el-icon-search"
                >
                  受理号查询
                </el-button> -->
                <event-search
                  type="default"
                  :search="params"
                  @search="handleSearch"
                />
                <el-button
                  type="warning"
                  @click="handleReset"
                >
                  <svg-icon name="reset" />重置
                </el-button>
              </el-col>
            </el-row>
          </el-form>
          <div class="ke-buttons">
            <el-button
              icon="el-icon-printer"
            >
              打印
            </el-button>
            <el-button
              icon="el-icon-printer"
            >
              打印处置表
            </el-button>
            <el-button
              icon="el-icon-location-information"
            >
              定位
            </el-button>
            <el-button
              icon="el-icon-first-aid-kit"
              @click="handleSc"
            >
              收藏
            </el-button>
            <el-button
              icon="el-icon-reading"
              @click="handleCkSc"
            >
              查看收藏
            </el-button>
            <el-button>
              <svg-icon name="export" />导出
            </el-button>
            <el-button @click="handleReload">
              <svg-icon name="reset" />刷新
            </el-button>
          </div>
        </el-header>
        <el-main>
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="items"
            stripe
            height="100%"
            style="width: 100%"
            @row-click="handleClickRow"
            @row-dblclick="handleDbclick"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
              fixed
            />
            <!-- <el-table-column
              type="index"
              label="来源"
              width="60"
              align="left"
              header-align="left"
              fixed
            >
              <template slot-scope="scope">
                <svg-icon
                  :class="[getColor(scope.$index)]"
                  name="12345"
                  class="icon-svg"
                />
              </template>
            </el-table-column> -->
            <el-table-column
              prop="evtCodeStr"
              label="案件编号"
              width="220"
              align="left"
              header-align="left"
              show-overflow-tooltip
              fixed
            >
              <template slot-scope="scope">
                {{ scope.row.evtCodeStr }}
              </template>
            </el-table-column>
            <el-table-column
              prop="reportTime"
              label="上报时间"
              align="left"
              header-align="left"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              prop="curTacheName"
              label="待办环节"
              align="left"
              header-align="left"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="evtClassName"
              label="案件类别"
              width="180"
              align="left"
              header-align="left"
              show-overflow-tooltip
            />
            <el-table-column
              prop="evtLocation"
              label="所属区域"
              width="220"
              align="left"
              header-align="left"
              show-overflow-tooltip
            />
            <el-table-column
              prop="content"
              label="问题描述"
              align="left"
              header-align="left"
              min-width="220px"
              show-overflow-tooltip
            />
          </el-table>
        </el-main>
        <el-footer height="auto">
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev,pager,next,total,jumper,sizes"
            :total="params.total"
            :page-size.sync="params.rows"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="load(1)"
          />
        </el-footer>
      </el-container>
      <event-details
        v-if="dialog.visible"
        :id="id"
        :dialog.sync="dialog"
        :select-items.sync="selectItems"
      />
      <EventSC
        v-if="dialogSC.visible"
        :dialog.sync="dialogSC" 
        :selection-item="dialogCKSC.data"
      />
      <EventCKSC
        v-if="dialogCKSC.visible"
        :dialog.sync="dialogCKSC"
      />
    </el-main>
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
const colors = ['mediumaquamarine','orangered','olivedrab','mediumpurple','mediumseagreen','mediumblue','mediumspringgreen','mediumturquoise','midnightblue','navy','olive','olivedrab','orange','orangered','orchid','palevioletred','peru','plum','powderblue','purple','red','rosybrown','royalblue','salmon','sandybrown','seagreen','silver','skyblue','slateblue','slategray','steelblue','tan','teal','thistle','tomato','violet','violetred','yellowgreen']
@Component({
  components: {
    EventDetails: () => import('../task/details.vue'),
    EventSearch: () => import('../task/components/search.vue'),
    EventSC: () => import('../components/collect.vue'),
    EventCKSC: () => import('../components/collectList.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    private row: any = {}
    private selections: Array<any> = []
    private items:Array<any>=[]
    private ajlxArray:Array<any>=[]
    private waitArray:Array<any>=[]
    private eventYearArray:Array<any>=[]
    private id:number=0
    private dialogSC: any = {
      title: '',
      visible: false
    }
    private dialog:any={
      title: '',
      visible: false
    }
    private dialogCKSC: any = {
      title: '',
      visible: false
    }
    private params = {
      page: 1,
      rows: this.$base.grid.page,
      total: 0,
      codeNum: '',// 案件号-序号
      codeYear: '',// 案件号-年号
      content: '',// 问题描述
      evtAreaId: '',// 行政区域
      evtClassId: '',// 案件类型
      evtLevel: '',// 案件等级
      evtLocation: '',// 案发位置
      evtResource: '',// 案件来源
      evtStatus: '',// 案件办理过程中的各类状态
      note: '',// 备注
      observerUserId: '',// 巡查员用户ID
      receiveTimeEnd: '',// 来件时间结束
      receiveTimeStart: '',// 来件时间开始
      reportTimeEnd: '',// 上报时间结束
      reportTimeStart: '',// 上报时间开始
      reporterName: '',// 举报人姓名
      reporterTel: '',// 举报人电话
      sendMan: '',// 办理人
      workTache: '',// 案件环节
      Accepted: ''// 受理号
    }
     private selectItems: any = {}
     created() {
       this.load()
       this.initEventClass()
       this.initWaitDone()
       this.initEventYear()
     }
     getColor(index){
       return colors[index]
     }
     // 案件类别
     private initEventClass():void{
       this.$http.post('evt/class/findEventClassTree',{
         nextTacheStr: 'InitialState'
       }).then((res: any) => {
         this.ajlxArray = res.data
       })
     }
     // 待办环节
     private initWaitDone():void{
       this.$http.post('/evt/event/queryAllFlowTache').then((res: any) => {
         this.waitArray = res.rows
       })
     }
     // 案件年号
     private initEventYear():void{
       this.$http.post('/evt/eventQuery/findEvtYearNum').then((res: any) => {
         this.eventYearArray = res.rows
       })
     }
     private load(page?:any): void {
       if (page){
         this.params.page = 1
         this.params.total = 0
       }
       this.$base.grid.resizePage({len: this.items.length,search: this.params})
       this.$http.request({
         url: '/evt/event/findEventsByNormalPage',
         method: 'post',
         data: this.params
       }).then((res: any) => {
         if (res.code === 200){
           this.items = res.rows
           this.params.total = res.total
           this.listLoading = false
         }
       })
     }
     private handleReload():void{
       this.$base.common.reload(this)
     }
     private handleReset(): void {
       this.params = {
         page: 1,
         rows: this.$base.grid.page,
         total: 0,
         codeNum: '',
         codeYear: '',
         content: '',
         evtAreaId: '',
         evtClassId: '',
         evtLevel: '',
         evtLocation: '',
         evtResource: '',
         evtStatus: '',
         note: '',
         observerUserId: '',
         receiveTimeEnd: '',
         receiveTimeStart: '',
         reportTimeEnd: '',
         reportTimeStart: '',
         reporterName: '',
         reporterTel: '',
         sendMan: '',
         workTache: '',
         Accepted: ''
       }
     }
     private handlePage(currentPage: number): void {
       this.params.page = currentPage
       this.load()
     }
     private handleSearch():void{
       this.load(1)
     }
     handleClickRow(row: any) {
       this.row = row
       this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.items, row)
     }
     private handleSc(){
       this.$base.grid.rows(this.selections).then((rows: any) => {
         this.dialogSC.title = '案件收藏'
         this.dialogSC.visible = true
         this.dialogCKSC.data = rows
       }).catch(() => { })
     }
     private handleCkSc(){
       this.dialogCKSC.title = '查看收藏'
       this.dialogCKSC.visible = true
     }
     private handleSelectionChange(val: Array<any>) {
       this.selections = val
     }
     private handleDbclick(row: any): void {
       this.dialog.title = row.evtCodeStr
       this.dialog.visible = true
       this.dialog.data = row
       this.selectItems = row
     }
}
</script>
 
<style lang="scss" scoped>
.buttons{
    .el-button{
        padding: 10px 13px !important;
    }
}
</style>
