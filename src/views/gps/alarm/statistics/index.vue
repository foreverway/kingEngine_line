<template>
  <el-container class="ke-layout">
    <el-container class="ke-layout-body">
      <el-header
        height="auto"
        class="ka-text-align-left"
      >
        <el-form
          :model="params"
          class="ke-search"
          label-width="77px"
        >
          <el-row>
            <el-col :span="5">
              <el-form-item
                label="统计类型"
                prop="dictName"
              >
                <el-select v-model="tableData.maintenanceMode">
                  <el-option 
                    label="月" 
                    value="1"
                  />
                  <el-option 
                    label="季" 
                    value="2"
                  />
                  <el-option 
                    label="半年" 
                    value="3"
                  />
                  <el-option 
                    label="年" 
                    value="4"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item
                label="统计时间"
                prop="dictName"
              >
                <el-select v-model="tableData.maintenanceMode">
                  <el-option 
                    label="2018" 
                    value="1"
                  />
                  <el-option 
                    label="2019" 
                    value="2"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="年第"
                prop="dictName"
                label-width="40px"
                class="ka-label-center"
              >
                <el-select v-model="tableData.maintenanceMode">
                  <el-option 
                    label="1" 
                    value="1"
                  />
                  <el-option 
                    label="2" 
                    value="2"
                  />
                  <el-option 
                    label="3" 
                    value="3"
                  />
                  <el-option 
                    label="4" 
                    value="4"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :span="1"
            >
              <el-form-item
                label="月"
                class="ka-label-left"
              />
            </el-col>
            <el-col
              :span="4"
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
        <div class="ke-clear">
          <div class="ke-buttons ke-float-left">
            <el-button @click="handleReload">
              <svg-icon name="reset" />刷新
            </el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="tableData"
          style="width: 100%"
          row-key="id"
          border
          lazy
          :load="load"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column
            type="index"
            align="center"
          />
          <el-table-column
            prop="name"
            label="报警类型"
          />
          <el-table-column
            prop="address"
            label="报警次数"
            align="center"
          />
        </el-table>
      </el-main>
      <el-footer height="auto">
        <el-pagination
          background
          class="ke-page"
          layout="prev, pager, next,total,jumper"
          :total="total"
          :current-page.sync="params.page"
          :page-size.sync="params.rows"
          @current-change="handlePage"
        />
      </el-footer>
    </el-container>
    <!-- <details-form
      v-if="dialog.visible"
      :id="id"
      :dialog.sync="dialog"
      :selection-item="selectionItem"
    /> -->
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: '',
  components: {
    // detailsForm: () => import('./details.vue')
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
  // 弹窗新增或者删除
  private type: string = ''
  // 选中要修改的数据
  private selectionItem: any = {}
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private collectDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private total: number = 0
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    name: ''
  }
  private isUpload: boolean = false
  created() {
    this.initTableData()
    let reg = /^[0-9a-zA-Z]+$/
    let str = 'hhhhh556缉私局6'
    console.log(reg.test(str))
    console.log('test')
  }
  @Watch('isUpload')
  private handleUploadChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.initTableData()
    }
  }
  private initTableData(): void {
    this.$http
      .request({
        url: '/pmi/callPolice/setUpList',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.total = res.total
        this.tableData = [{
          id: 1,
          date: '2016-05-02',
          name: '报警类型1',
          address: '4'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '报警类型2',
          address: '2'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '报警类型3',
          address: '7',
          hasChildren: true
        }, {
          id: 4,
          date: '2016-05-03',
          name: '报警类型4',
          address: '2'
        }]
      })
      .finally(() => {
        this.listLoading = false
      })
  }
  private load(tree, treeNode, resolve): void {
    setTimeout(() => {
      resolve([
        {
          id: 31,
          date: '2016-05-01',
          name: '报警类型7',
          address: '76'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '报警类型8',
          address: '23'
        }
      ])
    }, 1000)
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
    // this.openDetails()
  }
  
  private openDetails(): void {
    this.selectionItem = this.row
    this.dialog.title = '详情'
    this.dialog.visible = true
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleReload(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    // this.params.name = ''
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.params.page = 1
    this.initTableData()
  }
  private handleReset(): void {
    this.params.name = ''
    this.params.page = 1
    this.initTableData()
  }
}
</script>
<style lang="scss">
  .ka-text-align-left{
    .ka-label-left{
      .el-form-item__label{
        text-align: left!important;
        margin-left: 10px;
      }
    }
    .ka-label-center{
      .el-form-item__label{
        text-align: center;
        padding: 0px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  
</style>
