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
                <el-col :span="5">
                  <el-form-item label="车牌号">
                    <el-input />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="车辆类型">
                    <el-select v-model="search.bb">
                      <el-option 
                        label="全部" 
                        value="1" 
                      />
                      <el-option 
                        label="执法车辆" 
                        value="2" 
                      />
                      <el-option 
                        label="渣土车辆" 
                        value="3"
                      />
                      <el-option 
                        label="环卫车辆" 
                        value="4"
                      />
                      <el-option 
                        label="其他" 
                        value="5"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="GPS卡号">
                    <el-input />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="车辆编码">
                    <el-input />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5">
                  <el-form-item label="所属部门">
                    <el-select v-model="search.cc">
                      <el-option 
                        label="在线" 
                        value="1" 
                      />
                      <el-option 
                        label="离线" 
                        value="2" 
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="是否在线">
                    <el-select v-model="search.cc">
                      <el-option 
                        label="全部"
                        value="0"
                      />
                      <el-option 
                        label="在线" 
                        value="1"
                      />
                      <el-option 
                        label="离线" 
                        value="2"
                      />
                    </el-select>
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
                id="add"
                @click="vehicleCreate" 
              >
                <svg-icon name="add" />新增
              </el-button>
              <el-button @click="handleEdit">
                <svg-icon name="edit" />修改
              </el-button>
              <el-button @click="handleDelete">
                <svg-icon name="remove" />删除
              </el-button>
              <el-button>
                <i class="el-icon-location-outline" />定位
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
                fixed
              />
              <el-table-column
                type="selection"
                fixed
              />
              <el-table-column
                prop="eventCodeStr"
                label="车牌号"
                fixed
              >
                <template slot-scope="scope">
                  {{ scope.row.eventCodeStr }}
                </template>
              </el-table-column>
              <el-table-column
                prop="receiveTime"
                label="是否在线"
              />
              <el-table-column
                prop="tacheName"
                label="车辆编号"
              />
              <el-table-column
                prop="evtClassName"
                label="GPS卡号"
                align="left"
                header-align="left"
              />
              <el-table-column
                prop="location"
                label="车辆类型"
                align="left"
                header-align="left"
                show-overflow-tooltip
              />
              <el-table-column
                prop="content"
                label="所属部门"
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
    private search = {
      page: 1,
      rows: this.$base.grid.page,
      total: 0
    }
    // 选中要修改的数据
    private selectionItem: any = {}
    private items: Array<any> = []
    private dialog: any = {
      title: '',
      visible: false
    }
    created() {
      this.load()
    }
    private load(reTotal?:boolean): void {
      this.listLoading = false
      debugger
      if (reTotal === true){
        this.search.total = 0
        this.search.page = 1
      }
      // this.listLoading = true
      // this.$http.request({
      //   url: '/event/findEventsByPage',
      //   method: 'post',
      //   data: this.search
      // }).then((res: any) => {
      //   this.items = res.rows
      //   this.search.total = res.total
      //   this.listLoading = false
      //   if (res.total > 0){
      //     setTimeout(() => {
      //       this.handleClickRow(res.rows[0])
      //     },100)
      //   }
      // })
    }
    private detailLoad(){
      
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
    private vehicleCreate(): void {
      this.dialog.title = '新增车辆'
      this.dialog.visible = true
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
    private handleEdit(): void {
      this.$base.grid
        .row(this.selections)
        .then((row: any) => {
          this.selectionItem = this.selections[0]
          this.dialog.title = '修改'
          this.dialog.visible = true
          this.dialog.isAdd = false
        })
        .catch(() => {})
    }
    private handleDelete(): void {
      this.$base.grid
        .remove(this.selections)
        .then((ids: string) => {
          this.$http
            .request({
              url: '/role/deleteRole',
              method: 'post',
              data: {
                ids: ids
              }
            })
            .then((res: any) => {
              this.$base.win.msg('成功', 'success')
              this.load()
            })
        })
        .catch(() => {})
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
