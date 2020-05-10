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
                      <ke-dict code="cccc" />
                    </el-col>
                    <el-col :span="11">
                      <el-form-item
                        label-width="51px"
                        label="字第"
                      >
                        <el-input />
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
              <el-col :span="6">
                <el-form-item label="申请时间">
                  <el-date-picker
                    v-model="search.xx"
                    type="datetime"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="至"
                  class="ke-center"
                >
                  <el-date-picker
                    v-model="search.bb"
                    type="datetime"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="5"
                class="buttons"
              >
                <el-button
                  class="button"
                  type="primary"
                  icon="el-icon-search"
                >
                  查询
                </el-button>
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
              id="add"
              icon="el-icon-back"
              @click="handleApplay"
            >
              审批
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
            @row-dblclick="handleRowOpen"
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
              width="200"
              fixed
            >
              <template slot-scope="scope">
                {{ scope.row.eventCodeStr }}
              </template>
            </el-table-column>
            <el-table-column
              prop="receiveTime"
              label="申请人"
              width="100"
            />
            <el-table-column
              prop="tacheName"
              label="申请单位"
              width="160"
            />
            <el-table-column
              prop="evtClassName"
              label="申请理由"
              width="180"
              align="left"
              header-align="left"
            />
            <el-table-column
              prop="location"
              label="申请类型"
              width="130"
              align="left"
              header-align="left"
              show-overflow-tooltip
            />
            <el-table-column
              prop="content"
              label="申请时间"
              header-align="left"
              align="left"
              min-width="150px"
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
    </el-main>
    <event-details
      v-if="dialog.visible"
      :dialog.sync="dialog"
    />
    <event-form
      v-if="dialogForm.visible"
      :dialog.sync="dialogForm"
    />
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {
    EventForm: () => import('./components/applay.vue'),
    EventDetails: () => import('./details.vue')
  }
})
export default class extends Vue {
    private listLoading: boolean = true
    private row: any = {}
    private selections: Array<any> = []
    private items: Array<any> = []
    private search = {
      page: 1,
      rows: this.$base.grid.page,
      total: 0
    }
    private dialog: any = {
      title: '',
      visible: false
    }
    private dialogForm: any = {
      title: '',
      visible: false
    }
    created() {
      this.load()
    }
    private load(): void {
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
      // this.items = res.rows
      // this.search.total = res.total
      this.listLoading = false
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
    private handleRowOpen(row: any){
      this.row = row
      this.dialog.visible = true
      this.dialog.title = '数字城管2018字第233号[详情]'
    }
    private handleApplay(){
      this.$base.grid.row(this.selections).then((row: any) => {
        this.row = row
        this.dialogForm.visible = true
        this.dialogForm.title = '数字城管2018字第233号[审批]'
      }).catch(() => { })
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
}
</script>
 
<style lang="scss" scoped>
</style>
