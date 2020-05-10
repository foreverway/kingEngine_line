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
                <el-form-item
                  label-width="85px"
                  label="防城港城管"
                >
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
              <el-col :span="7">
                <el-form-item label="案件类别">
                  <ke-dict code="cccc" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="待办环节">
                  <ke-dict code="cccc" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="督办时间">
                  <el-date-picker
                    v-model="search.xx"
                    type="datetime"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="7">
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
                :span="6"
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
                <el-button @click="handleReload">
                  <svg-icon name="reset" />刷新
                </el-button>
              </el-col>
            </el-row>
          </el-form>
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
              prop="evtClassName"
              label="案件类别"
              width="130"
              align="left"
              header-align="left"
            />
            <el-table-column
              prop="receiveTime"
              label="督办时间"
              width="180"
            />
            <el-table-column
              prop="content"
              label="待办环节"
              header-align="center"
              align="center"
              min-width="120px"
            />
            <el-table-column
              prop="content"
              label="督办意见"
              header-align="left"
              align="left"
              min-width="220px"
              show-overflow-tooltip
            />
            <el-table-column
              prop="location"
              label="操作人员"
              width="80"
              align="center"
              header-align="center"
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
    <el-dialog
      :title="dialog.title"
      width="410px"
      :visible.sync="dialog.visible"
    >
      <el-form
        ref="ruleForm"
        :model="form"
        :rules="rules"
      >
        <el-form-item
          prop="node"
          label="撤件理由"
        >
          <ke-commonly
            v-if="dialog.visible"
            ref="node"
            v-model="form.node"
            class="commonly"
            :is-top="true"
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
      page: 1,
      rows: this.$base.grid.page,
      total: 0
    }
    private dialog: any = {
      title: '',
      visible: false
    }
    private loading:boolean = false
    private form:any = {
      node: ''
    }
    private rules:any = {
      node: [
        { required: true, message: '请输入撤件理由', trigger: 'blur' }
      ]
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
    private handleSelectionChange(val: Array<any>) {
      this.selections = val
    }
    private handleCJ(): void {
      this.$base.grid.row(this.selections).then((row: any) => {
        this.dialog.title = '数字城管2018字第233号[撤件]'
        this.dialog.visible = true
        this.form.node = ''
      }).catch(() => { })
    }
    private handleSubmit() {
      this.loading = true
      let form = (this.$refs.ruleForm as any)
      form.validate((valid) => {
        if (valid) {
          this.$http.post('...',this.form).then((res: any) => {
            if (res.type === 'success'){
              this.$emit('reLoad',this.dialog.type === 'create')
              if (this.dialog.type === 'create'){
                form.resetFields()
              } else {
                this.handleCancel()
              }
            }
            this.loading = false
            this.$base.win.msgJson(res)
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
