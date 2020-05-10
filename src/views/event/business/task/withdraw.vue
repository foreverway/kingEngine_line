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
                    placeholder="请输入所属区域"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="7">
                <el-form-item label="办理时间">
                  <el-date-picker
                    v-model="search.receiveTimeStart "
                    type="datetime"
                    placeholder="请选择开始时间"
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
                    v-model="search.receiveTimeEnd "
                    type="datetime"
                    placeholder="请选择结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
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
              <el-col :span="7">
                <el-form-item label="案件等级">
                  <ke-dict
                    v-model="search.evtLevel"
                    placeholder="请选择案件等级"
                    code="evtLevel"
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
              icon="el-icon-s-flag"
              @click="handleCJ"
            >
              撤件
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
              fixed
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
              align="center"
              width="220"
              show-overflow-tooltip
            />
            <el-table-column
              prop="evtClassName"
              label="案件类别"
              width="200"
              align="center"
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
              prop="evtLocation"
              label="案件位置"
              min-width="220"
              align="center"
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
      v-dialog-drag
      :title="dialog.title"
      width="410px"
      :visible.sync="dialog.visible"
    >
      <el-form
        ref="ruleForm"
        :model="recall"
        :rules="rules"
      >
        <el-form-item
          prop="applyReason"
          label="撤件理由"
        >
          <el-input
            v-model="recall.applyReason"
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
          @click="handleSubmit()"
        >
          <svg-icon name="save" />确 定
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import KeSet from '@/components/set/keSet.vue'
const colors = ['mediumaquamarine','orangered','olivedrab','mediumpurple','mediumseagreen','mediumblue','mediumspringgreen','mediumturquoise','midnightblue','navy','olive','olivedrab','orange','orangered','orchid','palevioletred','peru','plum','powderblue','purple','red','rosybrown','royalblue','salmon','sandybrown','seagreen','silver','skyblue','slateblue','slategray','steelblue','tan','teal','thistle','tomato','violet','violetred','yellowgreen']
@Component({
  components: {
    keCommonly: () => import('@/components/keCommonly.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    private row: any = {}
    private selections: Array<any> = []
    private items: Array<any> = []
    private search = {
      codeNum: '',
      codeYear: '',
      evtAreaId: '',
      evtClassId: '',
      evtLevel: '',
      evtLocation: '',
      evtResource: '',
      page: 1,
      receiveTimeEnd: '',
      receiveTimeStart: '',
      rows: this.$base.grid.page,
      total: 0
    }
    private dialog: any = {
      title: '',
      visible: false
    }
    private loading:boolean = false
    private recall:any = {
      applyReason: '',
      curTache: '',
      evtId: 0
    }
    private ajlxArray:Array<any>=[]
    private waitArray:Array<any>=[]
    private eventYearArray:Array<any>=[]
    private rules:any = {
      applyReason: [
        { required: true, pattern: '[^ \x22]+',message: '请输入撤件理由', trigger: 'blur' }
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
    private load(page?:any): void {
      if (page){
        this.search.page = 1
        this.search.total = 0
      }
      this.listLoading = true
      this.$http.request({
        url: 'evt/recall/findRecallEvtPage',
        method: 'post',
        data: this.search
      }).then((res:any) => {
        this.items = res.rows
        this.search.total = res.total
        this.listLoading = false
      })
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
    private handleReload():void{
      this.handleReset()
      this.load()
    }
    private handleReset(): void {
      this.search = {
        codeNum: '',
        codeYear: '',
        evtAreaId: '',
        evtClassId: '',
        evtLevel: '',
        evtLocation: '',
        evtResource: '',
        page: 1,
        receiveTimeEnd: '',
        receiveTimeStart: '',
        rows: this.$base.grid.page,
        total: 0
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
    private handleSearch():void{
      this.load(1)
    }
    private handleCJ(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.dialog.title = '撤件'
        this.dialog.visible = true
        this.recall.applyReason = ''
        this.recall.curTache = row.workTache
        this.recall.evtId = row.id
      }).catch(() => { })
    }
    private handleSubmit() {
      this.loading = true
      let form = (this.$refs.ruleForm as any)
      form.validate((valid) => {
        if (valid) {
          this.$http.post('evt/recall/revocationEvt',this.recall).then((res: any) => {
            if (res.code === 200){
              this.loading = false
              this.$base.win.msg('成功','success')
              this.handleCancel()
              this.load()
            }
        
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
    private handleCancel(): void {
      this.dialog.visible = false
    }
}
</script>
 
<style lang="scss" scoped>
</style>
