<template>
  <el-container class="ke-layout">
    <el-main class="ke-layout-main">
      <el-container class="ke-layout-container">
        <el-container class="ke-layout-body">
          <el-header height="auto">
            <el-row class="ke-search">
              <el-col
                :span="2"
                class="label"
              >
                待办环节
              </el-col>
              <el-col :span="4">
                <ke-dict
                  code="sex"
                  type="combo"
                />
              </el-col>
              <el-col
                :span="2"
                class="label"
              >
                智慧城管
              </el-col>
              <el-col :span="3">
                <ke-dict
                  code="year"
                  type="combo"
                />
              </el-col>
              <el-col
                :span="1"
                class="label"
              >
                字第
              </el-col>
              <el-col :span="2">
                <el-input />
              </el-col>
              <el-col
                :span="1"
                class="label"
              >
                号
              </el-col>
              <el-col
                :span="9"
                class="buttons"
              >
                <el-button
                  class="button"
                  type="primary"
                  icon="el-icon-search"
                >
                  查询
                </el-button>
                <el-popover
                  v-model="params.visible"
                  placement="bottom-end"
                  width="400"
                  class="ke-popover-button"
                  trigger="click"
                >
                  <div class="ke-popover-center">
                    高级查询表单内容
                    <div
                      slot="footer"
                      class="ke-search-buttons"
                    >
                      <el-button @click="params.visible = false">
                        取 消
                      </el-button>
                      <el-button
                        type="primary"
                        @click="params.visible = false"
                      >
                        查 询
                      </el-button>
                    </div>
                  </div>
                  <el-button
                    slot="reference"
                    class="button"
                    type="success"
                  >
                    <svg-icon name="moveSearch" />高级查询
                  </el-button>
                </el-popover>
                <el-button
                  class="button"
                  type="warning"
                >
                  <svg-icon name="reset" />重置
                </el-button>
              </el-col>
            </el-row>
            <div class="ke-buttons">
              <el-button
                id="add"
                v-power
                @click="handleCreate"
              >
                <svg-icon name="add" />新增
              </el-button>
              <el-button
                icon="el-icon-printer"
                @click="handlePrint"
              >
                打印
              </el-button>
              <el-button
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
              >
              <!--<template slot-scope="scope">-->
              <!--{{scope.row.tacheName }}-->
              <!--</template>-->
              </el-table-column>
              <el-table-column
                prop="evtClassName"
                label="案件类别"
                width="130"
              />
              <el-table-column
                prop="location"
                label="案件位置"
                width="200"
              />
              <el-table-column
                prop="content"
                label="问题描述"
              />
            </el-table>
          </el-main>
          <el-footer height="auto">
            <el-pagination
              background
              class="ke-page"
              layout="prev, pager, next,total,jumper"
              :total="params.total"
              :page-size.sync="params.rows"
              :current-page.sync="params.page"
              @current-change="handlePage"
            />
          </el-footer>
        </el-container>
        <el-aside
          width="316px"
          class="ke-body right"
        >
          <div class="buttons">
            <el-button>
              办 理
            </el-button>
            <el-button>
              修 改
            </el-button>
            <el-button>
              流 程
            </el-button>
            <el-button>
              回 退
            </el-button>
            <el-button>
              申 请
            </el-button>
            <el-button>
              处 理
            </el-button>
            <el-button>
              定 位
            </el-button>
          </div>
          <div class="body">
            <div class="title">
              案件信息
            </div>
            <div class="form">
              <ul>
                <li><label>案卷编号： </label><span>数字城管2018字第233号</span></li>
                <li><label>剩余时间：</label><span style="color:#ff0000;">超时1天2时36分12秒</span></li>
                <li><label>案卷编号：</label><span>数字城管2018字第233号</span></li>
                <li><label>案卷编号：</label><span>数字城管2018字第233号</span></li>
                <li><label>案卷编号：</label><span>数字城管2018字第233号</span></li>
                <li><label>案卷编号：</label><span>数字城管2018字第233号</span></li>
                <li><label>案卷编号：</label><span>数字城管2018字第233号</span></li>
              </ul>
            </div>
          </div>
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
      EventForm: () => import('./form.vue')
    }
  })
export default class extends Vue {
    private listLoading: boolean = true
    private row: any = {}
    private selections: Array<any> = []
    private id: number = 0
    private params = {
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
        this.params.total = 0
        this.params.page = 1
      }
      this.listLoading = true
      this.$http.request({
        url: '/event/findEventsByPage',
        method: 'post',
        data: this.params
      }).then((res: any) => {
        this.items = res.rows
        this.params.total = res.total
        this.listLoading = false
      })
    }
    handleClickRow(row: any) {
      this.row = row
      this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.items, row)
    }
    private handleCreate(): void {
      this.dialog.title = '新增案件'
      this.dialog.visible = true
    }
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleEdit(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.id = row.id
        this.dialog.title = '修改事件'
        this.dialog.visible = true
      }).catch(() => { })
    }
    private handleDelete(): void {
      this.$base.grid.remove(this.selections)
        .then((ids: string) => {
          this.$base.win.msg(ids)
        }).catch(() => { })
    }
    private handlePrint(){
      this.$base.grid.rows(this.selections).then((rows: any) => {
        
      }).catch(() => { })
    }
    private handlePrintCz(){
      this.$base.grid.row(this.selections).then((row: any) => {
        
      }).catch(() => { })
    }
    private handleSc(){
      this.$base.grid.rows(this.selections).then((rows: any) => {
        
      }).catch(() => { })
    }
    private handleCkSc(){
      
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
    private handleReset(): void {
      this.params = {
        total: 0,
        page: 1,
        rows: this.$base.grid.page,
        visible: false
      }
      this.load()
    }
    private handlePage(currentPage: number): void {
      this.params.page = currentPage
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
    .el-button{
      margin: 5px;
    }
    .title{
      border-bottom: 1px #C0C0C0 solid;
      height:36px;
      line-height: 36px;
      font-size: 15px;
      color: #333333;
    }
    .body{
      padding: 0px 5px;
      height:calc(100% - 93px);
      overflow: auto;
      .form{
        padding: 5px 0;
        ul{
          li{
            height:26px;
            line-height: 26px;
            display: flex;
            span,label
            {
              display: inline-block;
            }
            label{
              margin-right: 5px;
              color: #666666;
            }
            span{
              color: #333333;
            }
          }
        }
      }
    }
  }
</style>
