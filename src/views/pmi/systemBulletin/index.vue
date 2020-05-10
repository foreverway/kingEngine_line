<template>
  <div class="page">
    <el-container>
      <el-main class="ke-body">
        <el-form
          :model="params"
          class="ke-search form-container"
          label-width="77px"
        >
          <el-row class="ke-search">
            <el-col :span="6">
              <el-form-item
                label="标题"
                prop="msgTitle"
              >
                <el-input
                  v-model="params.msgTitle"
                  placeholder="请输入标题"
                  class="el-input-rank"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发送时间">
                <el-date-picker
                  v-model="params.startTime"
                  type="datetime"
                  placeholder="请选择日期时间"
                  :picker-options="beginTimeOption"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="至"
                label-width="35px"
                class="ke-center"
              >
                <el-date-picker
                  v-model="params.endTime"
                  type="datetime"
                  placeholder="请选择日期时间"
                  :picker-options="endTimeOption"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col
              :span="5"
              class="buttons"
            >
              <el-button
                v-power  
                code="search"
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
              >
                查询
              </el-button>
              <el-button
                v-power  
                code="reset"
                type="warning"
                @click="handleReset"
              >
                <svg-icon name="reset" />重置
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="ke-clear">
          <div class="ke-buttons ke-float-left">
            <el-button
              v-power  
              code="add" 
              @click="handleAdd"
            >
              <svg-icon name="add" />新增
            </el-button>
            <el-button 
              v-power  
              code="edit"
              @click="handleEdit"
            >
              <svg-icon name="edit" />修改
            </el-button>
            <el-button 
              v-power  
              code="release"
              @click="releases"
            >
              <svg-icon name="release" />发布
            </el-button>
            <el-button 
              v-power  
              code="del"
              @click="handleDelete"
            >
              <svg-icon name="remove" />删除
            </el-button>
            <el-button 
              v-power  
              code="refresh"
              @click="handleReload"
            >
              <svg-icon name="reset" />刷新
            </el-button>
          </div>
        </div>
        <el-table
          ref="eltableCurrentRow"
          v-loading="listLoading"
          :data="tableData"
          stripe
          height="100%"
          style="width: 100%"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
          @row-dblclick="handleDbclick"
        >
          <el-table-column
            type="index"
            align="center"
          />
          <el-table-column
            type="selection"
            align="center"
          />
          <el-table-column
            prop="msgTitle"
            label="标题"
            align="center"
          />
          <el-table-column
            label="附件"
            align="center"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.annexeNum > 0"
                class="download"
              >[查看]</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="enclosure"
            label="附件"
            align="center"
          /> -->
          <el-table-column
            prop="pubTime"
            label="发布时间"
            align="center"
          />
          <!-- <el-table-column
            prop="company"
            label="发布单位"
            align="center"
          /> -->
          <el-table-column
            prop="createUser"
            label="发布人"
            align="center"
          />
          <el-table-column
            prop="statusName"
            label="发布状态"
            align="center"
          />
          <!-- <el-table-column
            label="发布状态"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.reStatus === -1">{{ this.$base.dict.dictByItem('ggfbzt',scope.row.reStatus) }}</span>
              <span v-if="scope.row.reStatus === 1">已发布</span>
              <span v-if="scope.row.reStatus === -1">未发布</span>
            </template>
          </el-table-column> -->
        </el-table>
        <el-footer height="auto">
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev, pager, next,total,jumper, sizes"
            :page-size.sync="params.rows"
            :total="params.total"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="handleSizeChange"
          />
        </el-footer>
      </el-main>
    </el-container>
    <add-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
    />
    <add-details
      v-if="dialogdes.visible"
      :id="id"
      :dialog.sync="dialogdes"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue,Watch } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { Form as ElForm } from 'element-ui'
import IDict from '@/interface/dict'
import dateFormatFilter from '@/utils/filters/dateFormat'
@Component({
  name: '',
  components: {
    AddForm: () => import('./add.vue'),
    AddDetails: () => import('./addDetails.vue')
  }
})
export default class extends Vue {
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private tableData: Array<any> = []
  private activeName: string = 'first'
  private input: string = ''
  private dialogdes: any = {
    title: '',
    visible: false
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    msgTitle: '',
    startTime: '',
    endTime: '',
    total: 0
  }
  // 选中要修改的数据
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private beginTimeOption = {
    disabledDate: (time) => {
      let endDateVal = this.params.endTime
      if (endDateVal) {
        return time.getTime() > (new Date(endDateVal).getTime() - 60000 * 60)
      }
    }
  }
  private endTimeOption = {
    disabledDate: (time) => {
      let beginDateVal = this.params.startTime
      if (beginDateVal) {
        return (
          time.getTime() < (new Date(beginDateVal).getTime() + 60000 * 60)
        )
      }
    }
  }
  created() {
    this.initTableData()
  }
  private initTableData(): void {
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http
      .request({
        url: '/sys/notice/findSysNoticePage',
        method: 'post',
        data: this.params
      })
      .then( (res: any) => {
        if (res.code === 200){
          this.tableData = []
          this.params.total = res.total
          let array:any = []
          res.rows.forEach(async (item: any,i) => {
            // let str = await this.$base.dict.dictByCode('ggfbzt',item.reStatus) 
            let str = await this.setDate(item.reStatus)
            res.rows[i].statusName = str
            this.tableData.push(res.rows[i])
          })
        }
      })
      .finally(() => {
        this.listLoading = false
      })
  }
  private async setDate(reStatus) {
    let val = await this.$base.dict.dictByCode('ggfbzt',reStatus)
    return val.dictName
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSizeChange(currentPage: number): void {
    this.params.page = 1
    this.params.rows = currentPage
    this.initTableData()
  }
  private handleReset(): void {
    this.params.msgTitle = ''
    this.params.startTime = ''
    this.params.endTime = ''
    this.params.page = 1
  }
  private handleSearch(): void {
    if (this.params.startTime) {
      this.params.startTime = dateFormatFilter(new Date(this.params.startTime), 'yyyy-MM-dd HH:mm:ss')
    }
    if (this.params.endTime) {
      this.params.endTime = dateFormatFilter(new Date(this.params.endTime), 'yyyy-MM-dd HH:mm:ss')
    }
    this.params.page = 1
    this.initTableData()
  }
  private handleDbclick(row: any): void {
    this.dialogdes.title = '详情'
    this.dialogdes.visible = true
    this.id = row.id
  }
  private handleAdd(): void {
    this.id = 0
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
  }
  private handleEdit(): void {
    this.$base.grid
      .row(this.selections)
      .then((row: any) => {
        // this.selectionItem = this.selections[0]
        this.id = this.selections[0].id
        this.dialog.title = '修改'
        this.dialog.visible = true
        this.dialog.isAdd = false
      })
      .catch(() => {})
  }
  private releases(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: '/sys/notice/releaseSysNotice',
            method: 'post',
            data: {
              ids: ids,
              reStatus: 1
            }
          })
          .then((res: any) => {
            if (res.code === 200){
              this.initTableData()
            }
            this.$base.win.msgJson(res)
          })
      })
      .catch(() => {})
  }
  private handleDelete(): void {
    this.$base.grid
      .remove(this.selections)
      .then((ids: string) => {
        this.$http
          .request({
            url: '/sys/notice/deleteSysNotice',
            method: 'post',
            data: {
              ids: ids
            }
          })
          .then((res: any) => {
            if (res.code === 200){
              this.initTableData()
            }
            this.$base.win.msgJson(res)
          })
      })
      .catch(() => {})
  }
  private handleReload(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
}
</script>
<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.el-container {
  height: 100%;
}
.el-footer {
  height: auto !important;
}
.ke-body {
  display: flex;
  flex-flow: column;
  height: 100%;
}
.page{
  height: 100%;
}
.form-container{
  margin-bottom: 0!important;
}
.download{
  color: #1890ff;
  cursor: pointer;
}
</style>
