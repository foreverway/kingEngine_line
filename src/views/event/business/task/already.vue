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
                    <el-col :span="9">
                      <el-select
                        v-model="params.codeYear"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(val,key) in eventYearArray"
                          :key="key"
                          :value="val"
                          :label="val"
                        />
                      </el-select>
                    </el-col>
                    <el-col :span="13">
                      <el-form-item
                        label-width="51px"
                        label="字第"
                      >
                        <el-input
                          v-model="params.codeNum"
                          placeholder="请输入"
                        />
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
              <el-col :span="7">
                <el-form-item label="案件来源">
                  <ke-dict
                    v-model="params.evtResource"
                    placeholder="请选择案件来源"
                    code="evtSource"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="所属区域">
                  <ke-tree
                    v-model="params.evtAreaId"
                    placeholder="请选择所属区域"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="案发位置">
                  <el-input
                    v-model="params.evtLocation"
                    placeholder="请输入案发位置"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="7">
                <el-form-item label="办理时间">
                  <el-date-picker
                    v-model="params.startTime "
                    placeholder="请选择开始时间"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label="至"
                  class="ke-center"
                >
                  <el-date-picker
                    v-model="params.endTime "
                    placeholder="请选择结束时间"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="待办环节">
                  <el-select
                    v-model="params.tacheCode"
                    placeholder="请选择待办环节"
                  >
                    <el-option
                      v-for="(val,key) in waitArray"
                      :key="key"
                      :value="val.activityId"
                      :label="val.activityName"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="案件类别">
                  <el-cascader
                    v-model="params.evtClassId"
                    placeholder="请选择案件类别"
                    :show-all-levels="false"
                    :options="ajlxArray"
                    :props="{value:'id',label:'text',emitPath:false}"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="7"
                class="buttons"
              >
                <div>
                  <el-button
                    class="button"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearch"
                  >
                    查询
                  </el-button>
                  <el-button
                    type="warning"
                    @click="handleReset"
                  >
                    <svg-icon name="reset" />重置
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <div
            class="ke-buttons"
          >
            <el-button
              id="add"
              icon="el-icon-s-flag"
              @click="handleUrge"
            >
              催办
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
              :selectable="selectable"
            />
            <!-- <el-table-column
              type="index"
              label="来源"
              width="60"
              align="center"
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
              width="200"
              header-align="left"
              align="left"
              fixed
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.evtCodeStr }}
              </template>
            </el-table-column>
            <el-table-column
              prop="urgList"
              header-align="left"
              align="left"
              fixed
            >
              <template slot-scope="scope">
                <span
                  class="urge"
                  @click="handleUrgeRecord(scope.row)"
                >{{ scope.row.urgList?'催办':'' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="receiveTime"
              label="来件时间"
              header-align="left"
              align="left"
              width="220"
              show-overflow-tooltip
            />
            <el-table-column
              prop="receiveTime"
              label="来件时间"
              header-align="left"
              align="left"
              width="220"
              show-overflow-tooltip
            />
            <el-table-column
              prop="evtClassName"
              label="案件类别"
              width="200"
              header-align="left"
              align="left"
              show-overflow-tooltip
            />
            <el-table-column
              prop="tacheName"
              label="待办环节"
              header-align="left"
              align="left"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="evtLocation"
              label="案件位置"
              min-width="220"
              header-align="left"
              align="left"
              show-overflow-tooltip
            />
            <el-table-column
              prop="content"
              label="问题描述"
              min-width="220"
              header-align="left"
              align="left"
              show-overflow-tooltip
            />
          </el-table>
        </el-main>
        <el-footer height="auto">
          <el-pagination
            background
            class="ke-page"
            layout="prev,pager,next,total,jumper,sizes"
            :page-sizes="[10,20,30,50,100]" 
            :total="params.total"
            :page-size.sync="params.rows"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="load(1)"
          />
        </el-footer>
      </el-container>
    </el-main>
    <event-details
      v-if="dialogDes.visible"
      :id="id"
      :dialog.sync="dialogDes"
      :select-items.sync="selectItems"
    />
    <EventUrge
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :form="form"
      @emitLoad="load"
    />
    <EventIdeaRecord
      v-if="dialogIdea.visible"
      :id="recordID"
      :dialog.sync="dialogIdea"
      :type="recordType"
    />
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'

const colors = ['mediumaquamarine','orangered','olivedrab','mediumpurple','mediumseagreen','mediumblue','mediumspringgreen','mediumturquoise','midnightblue','navy','olive','olivedrab','orange','orangered','orchid','palevioletred','peru','plum','powderblue','purple','red','rosybrown','royalblue','salmon','sandybrown','seagreen','silver','skyblue','slateblue','slategray','steelblue','tan','teal','thistle','tomato','violet','violetred','yellowgreen']
@Component({
  components: {
    EventUrge: () => import('./components/urge.vue'),
    EventDetails: () => import('../task/details.vue'),
    EventIdeaRecord: () => import('./components/ideaRecord.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    private params:any = {
      page: 1,
      rows: this.$base.grid.page,
      total: 0,
      codeNum: '',
      codeYear: '',
      endTime: '',
      evtAreaId: '',
      evtClassId: '',
      evtLocation: '',
      evtResource: '',
      startTime: '',
      tacheCode: ''
    }
    private row: any = {}
    private ajlxArray:Array<any>=[]
    private waitArray:Array<any>=[]
    private eventYearArray:Array<any>=[]
    private selections: Array<any> = []
    private loading:boolean = false
    private dialog: any = {
      title: '',
      visible: false
    }
    private form:any = {
      curTache: '',
      evtId: '',
      handleIdea: '',
      handleUser: '',
      urgType: 1
    }
    private rules:any = {
      handleIdea: [
        { required: true,pattern: '[^ \x22]+', message: '请输入催办意见', trigger: 'change' }
      ],
      handleUser: [
        { required: true,pattern: '[^ \x22]+', message: '请输入操作人员', trigger: 'change' }
      ]
    }
    private items: Array<any> = []
    private id:number=0
    private selectItems: any = {}
    private recordType: any = {}
    private recordID: any = {}
    private dialogDes: any = {
      title: '',
      visible: false
    }
    private dialogIdea: any = {
      title: '',
      visible: false
    }
    getColor(index){
      return colors[index]
    }
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
        this.params.page = 1
        this.params.total = 0
      }
      this.listLoading = true
      this.$http.request({
        url: 'evt/transfer/findDoneEvtByPage',
        method: 'post',
        data: this.params
      }).then((res:any) => {
        this.items = res.rows
        this.params.total = res.total
        this.listLoading = false
      })
    }
    private handleReset(): void {
      this.params = {
        page: 1,
        rows: this.$base.grid.page,
        total: 0,
        codeNum: '',
        codeYear: '',
        endTime: '',
        evtAreaId: '',
        evtClassId: '',
        evtLocation:
         '',
        evtResource: '',
        startTime: '',
        tacheCode: ''
      }
    }
    private handleReload():void{
      this.handleReset()
      this.load(1)
    }
    private handlePage(currentPage: number): void {
      this.params.page = currentPage
      this.load()
    }
    handleClickRow(row: any) {
      if (row.canUrge){
        this.row = row
        this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.items, row)
      }
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleUrge(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.dialog.title = '催办'
        this.dialog.visible = true
        this.form.evtId = row.id
        this.form.curTache = row.tacheId
        this.form.handleIdea = ''
      }).catch(() => { })
    }
    private handleSearch():void{
      this.load(1)
    }
    private handleDbclick(row: any): void {
      this.dialogDes.title = row.evtCodeStr
      this.dialogDes.visible = true
      this.dialogDes.data = row
      this.selectItems = row
    }
    private handleUrgeRecord(row: any):void{
      this.dialogIdea.visible = true
      this.dialogIdea.title = '催办详情'
      this.recordType = 3
      this.recordID = row.id
    }
    private selectable(row:any){
      if (row.canUrge){
        return true
      }
      return false
      
    }
}
</script>
 
<style lang="scss" scoped>
.urge{
  color: #409EFF;
  cursor:pointer
}
</style>
