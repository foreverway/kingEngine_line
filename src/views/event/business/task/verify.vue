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
                    <el-col :span="9">
                      <el-select
                        v-model="search.codeYear"
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
                          v-model="search.codeNum"
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
                    v-model="search.evtResource"
                    placeholder="请选择案件来源"
                    code="evtSource"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="所属区域">
                  <ke-tree
                    v-model="search.evtAreaId"
                    placeholder="请选择所属区域"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="案发位置">
                  <el-input
                    v-model="search.evtLocation"
                    placeholder="请输入案发位置"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="7">
                <el-form-item label="来件时间">
                  <el-date-picker
                    v-model="search.receiveTimeStart "
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择开始时间"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item
                  label="至"
                  class="ke-center"
                >
                  <el-date-picker
                    v-model="search.receiveTimeEnd "
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="请选择结束时间"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="监督员">
                  <ke-set
                    ref="keSet"
                    v-model="search.observerUserId"
                    placeholder="请选择监督员"
                    path="observer"
                    title="选择监督员"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="案件类别">
                  <el-cascader
                    v-model="search.evtClassId"
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
          <div class="ke-buttons">
            <el-button
              id="add"
              icon="el-icon-refresh-left"
              @click="handleCP"
            >
              重派
            </el-button>
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
              prop="reportTime"
              label="来件时间"
              header-align="left"
              align="left"
              width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop="remainTimeStr"
              label="剩余时间"
              header-align="left"
              align="left"
              width="180"
              show-overflow-tooltip
            />
            <el-table-column
              prop="observerName"
              label="监督员"
              width="120"
              header-align="left"
              align="left"
              show-overflow-tooltip
            >
              <template
                slot-scope="scope"
              >
                <span
                  style="color: #66b1ff;cursor:pointer"
                  @click="handleLook(scope.row.observerId)"
                >{{ scope.row.observerName }} </span>  
              </template> 
            </el-table-column>
            <el-table-column
              prop="evtClassName"
              label="案件类别"
              width="200"
              header-align="left"
              align="left"
              show-overflow-tooltip
            />
            <el-table-column
              prop="workTacheName"
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
            :total="search.total"
            :page-size.sync="search.rows"
            :current-page.sync="search.page"
            @current-change="handlePage"
            @size-change="load(1)"
          />
        </el-footer>
      </el-container>
    </el-main>
    <el-dialog
      :title="dialog.title"
      width="430px"
      :visible.sync="dialog.visible"
    >
      <el-form
        ref="ruleForm"
        :model="regain"
        :rules="rules"
      >
        <el-form-item
          label="监督员"
          prop="handleUser"
        >
          <ke-set
            v-model="regain.handleUser"
            placeholder="请选择监督员"
            path="user"
            title="选择监督员"
          />
        </el-form-item>
        <el-form-item
          label="重派内容"
          prop="handleIdea"
        >
          <el-input
            v-model="regain.handleIdea"
            type="textarea"
            :rows="8"
            resize="none"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dr-dialog-footer"
      >
        <el-button @click="handleCancel">
          <svg-icon name="close" />取 消
        </el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="handleSubmit('ruleForm')"
        >
          <svg-icon name="save" />确 定
        </el-button>
      </div>
    </el-dialog>
    <check-form
      v-if="checkDialog.visible"
      :id="personId"
      :type="checkDialog.type"
      :dialog.sync="checkDialog"
    />
    <event-details
      v-if="dialogDes.visible"
      :id="id"
      :dialog.sync="dialogDes"
      :select-items.sync="selectItems"
    />
    <EventUrge
      v-if="dialogUrge.visible"
      :dialog.sync="dialogUrge"
      :form="form"
    />
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import KeSet from '@/components/set/keSet.vue'
const colors = ['mediumaquamarine','orangered','olivedrab','mediumpurple','mediumseagreen','mediumblue','mediumspringgreen','mediumturquoise','midnightblue','navy','olive','olivedrab','orange','orangered','orchid','palevioletred','peru','plum','powderblue','purple','red','rosybrown','royalblue','salmon','sandybrown','seagreen','silver','skyblue','slateblue','slategray','steelblue','tan','teal','thistle','tomato','violet','violetred','yellowgreen']
@Component({
  components: {   
    KeSet,
    CheckForm: () => import('@/views/event/inspector/basicInfo/person/add.vue'),
    EventUrge: () => import('./components/urge.vue'),
    EventDetails: () => import('../task/details.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    private row: any = {}
    private selections: Array<any> = []
    private ajlxArray:Array<any>=[]
    private waitArray:Array<any>=[]
    private eventYearArray:Array<any>=[]
    private search:any = {
      page: 1,
      rows: this.$base.grid.page,
      total: 0,
      codeNum: '',
      codeYear: '',
      evtAreaId: '',
      evtClassId: '',
      evtLevel: '',
      evtLocation: '',
      evtResource: '',
      observerUserId: '',
      receiveTimeEnd: '',
      receiveTimeStart: '',
      reporterName: '',
      reporterTel: ''
    }
    private personId:number=0
    private dialog: any = {
      title: '',
      visible: false
    }
    private dialogUrge: any = {
      title: '',
      visible: false
    }
    private form:any = {
      curTache: '',
      evtId: '',
      handleIdea: '',
      urgType: 1
    }
     private regain:any = {
       evtFlowId: '',
       evtId: '',
       handleIdea: '',
       handleUser: ''
     }
    private loading:boolean=false
    private items: Array<any> = []
    private checkDialog: any = {
      title: '',
      visible: false
    }
    private dialogDes: any = {
      title: '',
      visible: false
    }
    private selectItems: any = {}
    private rules:any = {
      handleUser: [
        { required: true, message: '请选择监督员', trigger: 'blur' }
      ],
      handleIdea: [
        { required: true, pattern: '[^ \x22]+',message: '请输入重派内容', trigger: 'blur' }
      ]
    }
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
        this.search.page = 1
        this.search.total = 0
      }
      this.listLoading = true
      this.$http.request({
        url: 'evt/verify/findVerifyEvtPage',
        method: 'post',
        data: this.search
      }).then((res:any) => {
        this.items = res.rows
        this.search.total = res.total
        this.listLoading = false
      })
    }
    private handleReload():void{
      this.handleReset()
      this.load()
    }
    private handleReset(): void {
      let keSet = (this.$refs.keSet as any)
      keSet.handleClear()
      this.search = {
        page: 1,
        rows: this.$base.grid.page,
        total: 0,
        codeNum: '',
        codeYear: '',
        evtAreaId: '',
        evtClassId: '',
        evtLevel: '',
        evtLocation: '',
        evtResource: '',
        observerUserId: '',
        receiveTimeEnd: '',
        receiveTimeStart: '',
        reporterName: '',
        reporterTel: ''
      }
    }
    private handlePage(currentPage: number): void {
      this.search.page = currentPage
      this.load()
    }
    handleClickRow(row: any) {
      this.row = row
      this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.items, row)
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleCP(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.dialog.title = '重派'
        this.dialog.visible = true
        this.regain.evtId = row.id
        this.regain.evtFlowId = row.evtFlowId
      }).catch(() => { })
    }
    private handleSubmit() {
      this.loading = true
      let form = (this.$refs.ruleForm as any)
      form.validate((valid) => {
        if (valid) {
          this.$http.post('evt/verify/reassign',this.regain).then((res: any) => {
            console.log(res)
            this.loading = false
            this.$base.win.msg('成功','success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
    private handleSearch():void{
      this.load(1)
    }
    private handleCancel(): void {
      this.dialog.visible = false
    }
    private handleExport(): any {
    // 导出
      let str = ''
      if (this.selections.length) {
        let ids: Array<any> = []
        this.selections.forEach((el) => {
          ids.push(el.id)
        })
        str = ids.join(',')
        let url = `dept/exportDept?ids=${str}`
        window.open(url, '_blank')
        this.$base.win.msg('导出成功', 'success')
      } else {
        let url =
        'dept/exportDept'
        window.open(url, '_blank')
        this.$base.win.msg('导出成功', 'success')
      }
    }
    private handleLook(id){
      this.checkDialog = {
        visible: true,
        title: '监督员详情',
        type: 'check',
        item: {id}
      }
    }
    private handleUrge(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.dialogUrge.title = '催办'
        this.dialogUrge.visible = true
        this.form.evtId = row.id
        this.form.curTache = row.tacheId
      }).catch(() => { })
    }
    private handleDbclick(row: any): void {
      this.dialogDes.title = row.evtCodeStr
      this.dialogDes.visible = true
      this.dialogDes.data = row
      this.selectItems = row
    }
}
</script>
 
<style lang="scss" scoped>
</style>
