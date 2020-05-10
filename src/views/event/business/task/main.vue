<template>
  <el-container class="ke-layout">
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <el-container class="ke-layout-body">
          <el-header height="auto">
            <el-form
              :model="search"
              class="ke-search"
              label-width="77px"
            >
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label-width="73px"
                    label="待办环节"
                  >
                    <el-select v-model="search.tacheCode">
                      <el-option
                        v-for="(val,key) in dbhjData"
                        :key="key"
                        :value="val.activityId"
                        :label="val.activityName"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label-width="92px"
                    label="防城港城管"
                  >
                    <el-select v-model="search.codeYear">
                      <el-option
                        v-for="(val,key) in yearData"
                        :key="key"
                        :value="val"
                        :label="val"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col
                  :span="3"
                  style="width: 13.5%;"
                >
                  <el-form-item
                    label-width="48px"
                    label="字第"
                  >
                    <el-input v-model="search.codeNum" />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="9"
                  class="buttons"
                  style="width: 36.5%;"
                >
                  号&nbsp;&nbsp;
                  <el-button
                    class="button"
                    type="primary"
                    icon="el-icon-search"
                    @click="handleSearch"
                  >
                    查询
                  </el-button>
                  <event-search
                    :search="search"
                    @search="handleSearch"
                  />
                  <el-button
                    class="button"
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
                v-power
                code="add"
                @click="handleCreate"
              >
                <svg-icon name="add" />新增 
              </el-button>
              <el-button
                icon="el-icon-location"
                @click="handlePoint"
              >
                定位
              </el-button>
              <el-button
                icon="el-icon-printer"
                @click="handlePrint"
              >
                打印
              </el-button>
              <el-button
                v-power
                code="print"
                icon="el-icon-printer"
                @click="handlePrintCz"
              >
                打印处置表
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
              <el-button @click="handleExport">
                <svg-icon name="export" />导出
              </el-button>
              <el-button @click="handleRefresh">
                <svg-icon name="reset" />刷新
              </el-button>
            </div>
          </el-header>
          <el-main>
            <el-table
              ref="table"
              v-loading="listLoading"
              :data="items"
              stripe
              height="100%"
              style="width: 100%"
              @row-click="handleClickRow"
              @selection-change="handleSelectionChange"
              @row-dblclick="handleDbclick"
            >
              <el-table-column
                type="index"
                width="40"
                fixed
              />
              <el-table-column
                type="selection"
                width="45"
                fixed
              />
              <el-table-column
                prop="eventCodeStr"
                label=""
                align="center"
                width="35"
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
                prop="eventCodeStr"
                label="案件号"
                show-overflow-tooltip
                width="270"
                fixed
              >
                <template slot-scope="scope">
                  <svg-icon
                    :class="[scope.row.codeYear%2===1?'red':'green','icon-svg']"
                    name="callPolice"
                  />
                  {{ scope.row.evtCodeStr }}
                  <span
                    v-for="(row,key) in scope.row.statusList"
                    :key="key"
                    :class="['',getColor(key)]"
                  >{{ row["value"] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="receiveTime"
                label="来件时间"
                width="160"
              />
              <el-table-column
                prop="evtClassName"
                label="案件类别"
                width="150"
                show-overflow-tooltip
                align="left"
                header-align="left"
              />
              <el-table-column
                prop="curTacheName"
                label="待办环节"
                width="130"
                show-overflow-tooltip
              />
              <el-table-column
                prop="evtLocation"
                label="案发位置"
                width="160"
                align="left"
                header-align="left"
                show-overflow-tooltip
              />
              <el-table-column
                prop="content"
                label="问题描述"
                header-align="left"
                align="left"
                min-width="180"
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
        <el-aside
          width="316px"
          class="ke-body right"
        >
          <right
            ref="right"
            @reLoad="load"
          />
        </el-aside>
      </el-container>
      <event-form
        v-if="dialog.visible"
        :dialog.sync="dialog"
        @reLoad="load"
      />
      <print-des
        v-if="dialogPrintDes.visible"
        :dialog.sync="dialogPrintDes"
      />
      <print-cz
        v-if="dialogPrintCz.visible"
        :dialog.sync="dialogPrintCz"
      />
      <EventSC
        v-if="dialogSC.visible"
        :dialog.sync="dialogSC" 
      />
      <EventCKSC
        v-if="dialogCKSC.visible"
        :dialog.sync="dialogCKSC"
      />
      <event-details
        v-if="dialogDes.visible"
        :dialog.sync="dialogDes"
        :select-items.sync="selectItems"
      />
    </el-main>
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
const colors = ['mediumaquamarine','orangered','olivedrab','mediumpurple','mediumseagreen','mediumblue','mediumspringgreen','mediumturquoise','midnightblue','navy','olive','olivedrab','orange','orangered','orchid','palevioletred','peru','plum','powderblue','purple','red','rosybrown','royalblue','salmon','sandybrown','seagreen','silver','skyblue','slateblue','slategray','steelblue','tan','teal','thistle','tomato','violet','violetred','yellowgreen']
@Component({
  components: {
    EventForm: () => import('./form.vue'),
    EventSearch: () => import('./components/search.vue'),
    right: () => import('./right.vue'),
    EventImage: () => import('./components/image.vue'),
    PrintDes: () => import('./components/print.vue'),
    PrintCz: () => import('./components/printCZ.vue'),
    EventSC: () => import('../components/collect.vue'),
    EventCKSC: () => import('../businessSetting/languageMaintain/commonLanguage.vue'),
    EventDetails: () => import('../task/details.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    private row: any = {}
    private selections: Array<any> = []
    private search = {
      page: 1,
      rows: this.$base.grid.page,
      total: 0
    }
    private items: Array<any> = []
    private dialog: any = {
      title: '',
      visible: false
    }

    private dialogPrintDes: any = {
      title: '',
      visible: false
    }

    private dialogPrintCz: any = {
      title: '',
      visible: false
    }

    private dialogSC: any = {
      title: '',
      visible: false
    }
    private dialogDes: any = {
      title: '',
      visible: false
    }
    private dialogCKSC: any = {
      title: '',
      visible: false
    }
    private dbhjData:Array<any>=[]
    private yearData:Array<any>=[]
    created() {
      this.load()
      this.getdbhj()
      this.getyear()
    }
    getdbhj(){
      this.$http.post('evt/event/queryAllFlowTache').then((res) => {
        this.dbhjData = res.rows
      })
    }
    getyear(){
      this.$http.post('evt/eventQuery/findEvtYearNum').then((res) => {
        this.yearData = res.rows
      })
    }
    getColor(index){
      return colors[index]
    }
    private load(reTotal?:boolean): void {
      if (reTotal === true){
        this.search.total = 0
        this.search.page = 1
      }
      this.listLoading = true
      this.$http.post('evt/event/findTodoEventsByPage',this.search).then((res) => {
        this.items = res.rows
        this.search.total = res.total
        this.listLoading = false
        if (res.total > 0){
          this.$nextTick(() => {
            this.handleClickRow(this.items[0])
          })
        } else {
          (this.$refs.right as any).detailLoad(null)
        }
      })
    }
    private detailLoad(){
      (this.$refs.right as any).detailLoad(this.row)
    }
    handleClickRow(row: any) {
      this.row = row
      this.$base.grid.rowClcik(this.$refs.table, this.items, row)
      if (this.row.flag === true){
        if (row.id === this.row.id) {
          this.detailLoad()
        }
      }
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleCreate(): void {
      this.dialog.title = '新增案件'
      this.dialog.visible = true
    }
    private handlePrint(){
      this.$base.grid.rows(this.selections).then((rows: any) => {
        this.dialogPrintDes.title = '打印预览'
        this.dialogPrintDes.visible = true
        this.dialogPrintDes.data = rows.map((node) => {
          return node.id 
        }).join(',')
      }).catch(() => { })
    }
    private handlePrintCz(){
      this.$base.grid.rows(this.selections).then((row: any) => {
        this.dialogPrintCz.title = '打印处置表预览'
        this.dialogPrintCz.visible = true
        this.dialogPrintCz.data = row

      }).catch(() => { })
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
    handlePoint(){
      
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
    private handleRefresh() {
      this.handleReset()
      this.load()
    }
    handleSearch(){
      this.search.page = 1
      this.search.total = 0
      this.load()
    }
    private handleReset(): void {
      this.search = {page: 1,rows: this.$base.grid.page,total: 0}
    }
    private handlePage(currentPage: number): void {
      this.search.page = currentPage
      this.load()
    }
    private handleDbclick(row: any): void {
      this.dialogDes.title = row.evtCodeStr + '[详情]'
      this.dialogDes.visible = true
      this.dialogDes.data = row
    }
}
</script>
 
<style lang="scss" scoped>
  .button{
    padding: 10px!important;
  }
  .right{
    padding: 12px 10px;
    overflow: hidden;
  }
  .other{
    margin-left: 3px;
  }
  .icon-svg{
    margin-right: 5px;
    width:1.1em;
    height:1.1em;
  }
  .ke-popover-button{
    margin: 0 5px;
  }
</style>
