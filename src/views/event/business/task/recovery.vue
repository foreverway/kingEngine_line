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
                  <el-form-item label="待办环节">
                    <ke-dict
                      code="sex"
                      type="combo"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="智慧城管">
                    <ke-dict
                      code="sex"
                      type="combo"
                    />
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
                    <el-input />
                  </el-form-item>
                </el-col>
                <el-col
                  :span="10"
                  class="buttons"
                  style="width:40.66667%;"
                >
                  号&nbsp;&nbsp;
                  <el-button
                    class="button"
                    type="primary"
                    icon="el-icon-search"
                  >
                    查询
                  </el-button>
                  <event-search :search="search" />
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
                icon="el-icon-printer"
                @click="handlePrint"
              >
                打印
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
                type="index"
                width="40"
                fixed
              />
              <el-table-column
                type="selection"
                width="40"
                fixed
              />
              <el-table-column
                prop="eventCodeStr"
                label="案件号"
                width="180"
                fixed
              >
                <template slot-scope="scope">
                  {{ scope.row.eventCodeStr }}
                </template>
              </el-table-column>
              <el-table-column
                prop="receiveTime"
                label="来件时间"
                width="180"
              />
              <el-table-column
                prop="tacheName"
                label="待办环节"
                width="140"
              />
              <el-table-column
                prop="evtClassName"
                label="案件类别"
                width="130"
                align="left"
                header-align="left"
              />
              <el-table-column
                prop="location"
                label="案件位置"
                width="200"
                align="left"
                header-align="left"
                show-overflow-tooltip
              />
              <el-table-column
                prop="content"
                label="问题描述"
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
              layout="prev, pager, next,total,jumper"
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
          <right ref="right" />
        </el-aside>
      </el-container>
      <event-form
        v-if="dialog.visible"
        :dialog.sync="dialog"
        @reLoad="load"
      />
    </el-main>
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  components: {
    EventForm: () => import('./form.vue'),
    right: () => import('./right.vue'),
    EventSearch: () => import('./components/search.vue'),
    EventImage: () => import('./components/image.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    private row: any = {}
    private selections: Array<any> = []
    private search = {
      page: 1,
      rows: this.$base.grid.page,
      total: 0,
      visible: false
    }
    private items: Array<any> = []
    private dialog: any = {
      title: '',
      visible: false
    }
    created() {
      this.load()
    }
    private load(reTotal?:boolean): void {
      if (reTotal === true){
        this.search.total = 0
        this.search.page = 1
      }
      this.listLoading = true
      this.items = [
        {
          eventCodeStr: '数字城管2020字第1号',
          receiveTime: '2020-01-01 11:11:11',
          tacheName: '责任单位处置',
          evtClassName: '一般性案件',
          location: '高新南2道5号',
          content: '乱摆摊'
        }
      ]
      // this.search.total = res.total
      this.listLoading = false
      //  if (res.total > 0){
      //    setTimeout(() => {
      this.handleClickRow( this.items[0])
      //   },100)
      //   }
    }
    private detailLoad(){
      (this.$refs.right as any).detailLoad(this.row)
    }
    handleClickRow(row: any) {
      this.row = row
      this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.items, row)
      if (this.row.flag === true){
        this.detailLoad()
      }
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handlePrint(){
      this.$base.grid.rows(this.selections).then((rows: any) => {
        
      }).catch(() => { })
    }
    private handleReload() {
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

}
</script>
 
<style lang="scss" scoped>
  .button{
    padding: 10px 13px!important;
  }
  .right{
    padding: 12px 10px;
    overflow: hidden;
  }
</style>
