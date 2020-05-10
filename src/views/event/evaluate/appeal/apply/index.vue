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
                <el-form-item label="申诉时间">
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
              icon="el-icon-s-check"
              @click="handleApproval"
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
              label="来源"
              width="200"
              fixed
            >
              <template slot-scope="scope">
                {{ scope.row.eventCodeStr }}
              </template>
            </el-table-column>
            <el-table-column
              prop="eventCodeStr"
              label="案卷编号"
              width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column
              prop="receiveTime"
              label="申诉人员"
              width="180"
            />
            <el-table-column
              prop="tacheName"
              label="申诉部门"
              width="140"
            />
            <el-table-column
              prop="evtClassName"
              label="申诉类型"
              width="130"
              align="left"
              header-align="left"
            />
            <el-table-column
              prop="location"
              label="申诉时间"
              width="200"
              align="left"
              header-align="left"
              show-overflow-tooltip
            />
            <el-table-column
              prop="content"
              label="申诉理由"
              header-align="left"
              align="left"
              min-width="180px"
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
      <event-form
        v-if="dialog.visible"
        :dialog.sync="dialog"
      />
    </el-main>
  </el-container>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import KeSet from '@/components/set/keSet.vue'

@Component({
  components: {   
    KeSet,
    EventForm: () => import('./form.vue')
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
    private dialog: any = {
      title: '',
      visible: false
    }
    private loading: boolean = true
    private items: Array<any> = []
    created() {
      this.load()
    }
    private load(): void {
      this.$base.grid.resizePage({len: this.items.length,search: this.search})
      this.$http.request({
        url: 'evt/event/findTodoEventsByPage',
        method: 'post',
        data: this.search
      }).then((res: any) => {
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
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleApproval() { // 审批
      // to do
      this.$base.grid.row(this.selections).then((row: any) => {
        this.dialog.data = this.selections[0]
        this.dialog.visible = true
        this.dialog.title = '数字城管2018字第223号'
      }).catch(() => { })
    }
}
</script>
 
<style lang="scss" scoped>
</style>
