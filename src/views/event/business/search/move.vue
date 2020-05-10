<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <el-form
            :model="search"
            class="ke-search"
            label-width="80px"
          >
            <el-row>
              <el-col :span="7">
                <el-form-item label="数字城管">
                  <el-row>
                    <el-col :span="11">
                      <el-select v-model="search.codeYear">
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
                        <el-input v-model="search.codeNum" />
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
                  <el-input v-model="search.Accepted" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="案件类别">
                  <el-cascader
                    v-model="search.evtClassId"
                    :show-all-levels="false"
                    :options="ajlxArray"
                    :props="{value:'id',label:'text',emitPath:false}"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="问题来源">
                  <ke-dict
                    v-model="search.evtResource"
                    code="evtSource"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="所属区域">
                  <ke-tree v-model="search.evtAreaId" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="案件环节">
                  <el-select v-model="search.workTache">
                    <el-option
                      v-for="(val,key) in waitArray"
                      :key="key"
                      :value="val.activityId"
                      :label="val.activityName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
                class="buttons"
              >
                <el-button
                  class="button"
                  type="primary"
                  icon="el-icon-search"
                >
                  查 询
                </el-button>
                <!-- <el-button
                  class="button"
                  icon="el-icon-search"
                >
                  案件号查询
                </el-button> -->
                <event-search
                  type="default"
                />
                <event-move 
                  :select-fields="selectFields"
                />
                <el-button
                  type="warning"
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              align="center"
            />
            <el-table-column
              type="index"
              label="来源"
              width="60"
              align="center"
            >
              <template slot-scope="scope">
                <svg-icon
                  :class="[getColor(scope.$index)]"
                  name="12345"
                  class="icon-svg"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="evtCodeStr"
              label="案卷编号"
              width="220"
              align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.evtCodeStr }}
              </template>
            </el-table-column>
            <el-table-column
              prop="reportTime"
              label="上报时间"
              align="center"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              prop="curTacheName"
              label="待办环节"
              align="center"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="evtClassName"
              label="案件类别"
              width="180"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="evtLocation"
              label="所属区域"
              width="220"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="content"
              label="问题描述"
              align="center"
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
            layout="prev, pager, next,total,jumper, sizes"
            :total="search.total"
            :page-size.sync="search.rows"
            :current-page.sync="search.page"
            @current-change="handlePage"
          />
        </el-footer>
      </el-container>
    </el-main>
    <event-details
      v-if="dialog.visible"
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
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    EventSearch: () => import('../task/components/search.vue'),
    EventMove: () => import('@/components/keSearch.vue'),
    EventDetails: () => import('../task/details.vue'),
    EventSC: () => import('../components/collect.vue'),
    EventCKSC: () => import('../components/collectList.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    private row: any = {}
    private selections: Array<any> = []
    private items: Array<any> = []
    private selectItems: any = {}
    private ajlxArray:any={}
    private waitArray:any={}
    private eventYearArray:any={}
    private search = {
      page: 1,
      rows: this.$base.grid.page,
      total: 0,
      codeNum: '',
      codeYear: '',
      dynamicQuery: {
        dynamicTacheCodes: '',
        dynamicTimeEnd: '',
        dynamicTimeStart: '',
        dynamicUser: ''
      },// 动态查询条件
      evtAreaId: '',
      evtClassId: '',
      evtLevel: '',
      evtLocation: '',
      evtResource: '',
      evtStatus: '',
      recallStateTacheCode: '',// 撤件环节
      receiveTimeEnd: '',
      receiveTimeStart: '',
      reporterName: '',
      reporterTel: '',
      untreadStateTacheCode: '',// 退件环节
      workTache: '',
      Accepted: ''// 受理号
    }
    private dialog: any = {
      title: '',
      visible: false
    }
    private dialogSC: any = {
      title: '',
      visible: false
    }
    private dialogCKSC: any = {
      title: '',
      visible: false
    }
    private selectFields:Array<any> = [
      {name: '问题来源',value: '11',type: 'select',data: []},
      {name: '采集员',value: '22',type: 'dialog',data: null},
      {name: '来件时间',value: '33',type: 'datetime',data: null},
      {name: '举报人',value: '44',type: 'input',data: null}
    ]
    created() {
      this.load()
      this.initEventClass()
      this.initWaitDone()
      this.initEventYear()
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
        this.search.page = 1
        this.search.total = 0
      }
      this.$base.grid.resizePage({len: this.items.length,search: this.search})
      this.listLoading = true
      this.$http.request({
        url: '/evt/event/findEventsByAdvancePage',
        method: 'post',
        data: this.search
      }).then((res: any) => {
        if (res.code === 200){
          this.items = res.rows
          this.search.total = res.total
          this.listLoading = false
        }
       
      })
    }
    private handleReload():void{
      this.handleReset()
      this.load()
    }
    private handleReset(): void {
      this.search.total = 0
      this.search.page = 1
      this.search.rows = this.$base.grid.page
    }
    private handlePage(currentPage: number): void {
      this.search.page = currentPage
      this.load()
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
