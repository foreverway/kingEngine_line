<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <el-form
            class="ke-search"
            label-width="80px"
          >
            <el-row class="ke-search">
              <el-col :span="5">
                <el-form-item label="统计类型">
                  <el-select
                    v-model="classes"
                  >
                    <el-option
                      v-for="item in classesOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="统计时间">
                  <el-select
                    v-model="year"
                  >
                    <el-option
                      v-for="item in yearOptions"
                      :key="item.value"   
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="1"
                class="label"
              >
                年 <span v-if="classes===1 || classes===2">第</span>
              </el-col>
              <el-col
                v-if="classes === 1"
                :span="3"
              >
                <el-select
                  v-model="month"
                  placeholder="请选择月份"
                >
                  <el-option
                    v-for="item in monthOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col
                v-if="classes === 2"
                :span="3"
              >
                <el-select
                  v-model="quarter"
                  placeholder="请选择季度"
                >
                  <el-option
                    v-for="item in quarterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col
                v-if="classes === 3"
                :span="3"
              >
                <el-select
                  v-if="classes === 3"
                  v-model="halfYear"
                  placeholder="请选择半年度"
                >
                  <el-option
                    v-for="item in halfYearOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-col>
              <el-col
                v-if="classes === 1"
                :span="1"
                class="label"
              >
                月
              </el-col>
              <el-col
                v-if="classes === 2"
                :span="1"
                class="label"
              >
                季度
              </el-col>
              <el-col
                :span="4"
                class="buttons"
              >
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="handleSearch"
                >
                  查询
                </el-button>
                <el-button>
                  <svg-icon name="export" />导出
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <el-table
            ref="eltableCurrentRow"
            v-loading="listLoading"
            :data="tableData"
            stripe
            height="100%"
            style="width: 100%"
            @row-click="handleClickRow"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              label="数字化城市管理系统受理员统计表（2018-12-04 至 2018-12-04）"
              align="center"
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
                prop="roleName"
                label="姓名"
                align="center"
              />
              <el-table-column
                label="质的评价"
                align="center"
              >
                <el-table-column
                  prop="roleName"
                  label="操作数"
                  align="center"
                />
                <el-table-column
                  prop="roleName"
                  label="错误操作数"
                  align="center"
                />
                <el-table-column
                  prop="roleName"
                  label="办理准确率"
                  align="center"
                />
                <el-table-column
                  prop="roleName"
                  label="准确率得分"
                  align="center"
                />
              </el-table-column>
              <el-table-column
                label="量的评价"
                align="center"
              >
                <el-table-column
                  prop="roleName"
                  label="工作量得分"
                  align="center"
                />
              </el-table-column>
              <el-table-column
                label="效率的评价"
                align="center"
              >
                <el-table-column
                  prop="roleName"
                  label="超时操作次数"
                  align="center"
                />
                <el-table-column
                  prop="roleName"
                  label="办理效率评价"
                  align="center"
                />
                <el-table-column
                  prop="roleName"
                  label="办理效率得分"
                  align="center"
                />
              </el-table-column>
              <el-table-column
                label=""
                align="center"
              >
                <el-table-column
                  prop="roleName"
                  label="受理员/接线员总分"
                  align="center"
                />
              </el-table-column>
            </el-table-column>
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
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'Acceptor',
  components: {
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
  private total: number = 0
  private value: string = ''
  private year: string = ''
  private month: string = ''
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private date: string = ''
  private classes: string = ''
  private area: string = ''
  private quarter: string = ''
  private halfYear: string = ''
  private classesOptions: Array<any> = [
    {
      value: 1,
      label: '月'
    },
    {
      value: 2,
      label: '季'
    },
    {
      value: 3,
      label: '半年'
    },
    {
      value: 4,
      label: '年'
    }
  ]
  private yearOptions: Array<any> = [
    {
      value: 2020,
      label: '2020'
    },
    {
      value: 2019,
      label: '2019'
    }
  ]
  private monthOptions: Array<any> = [
    {
      value: 1,
      label: '1'
    },
    {
      value: 2,
      label: '2'
    }
  ]
  private areaOptions: Array<any> = [
    {
      value: 1,
      label: '南山区'
    },
    {
      value: 2,
      label: '福田区'
    }
  ]
  private quarterOptions: Array<any> = [
    {
      value: 1,
      label: '一'
    },
    {
      value: 2,
      label: '二'
    },
    {
      value: 1,
      label: '三'
    },
    {
      value: 2,
      label: '四'
    }
  ]
  private halfYearOptions: Array<any> = [
    {
      value: 1,
      label: '上半年'
    },
    {
      value: 2,
      label: '下半年'
    }
  ]
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
        url: '/role/findRolesByPage',
        method: 'post',
        data: this.params
      })
      .then((res: any) => {
        this.total = res.total
        this.tableData = res.rows
      })
      .finally(() => {
        this.listLoading = false
      })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleAdd(): void {
    this.dialog.title = '新增'
    this.dialog.visible = true
    this.dialog.isAdd = false
    this.selectionItem = {
      areaId: '',
      roleName: '',
      roleCode: '',
      orderNo: 0,
      dbStatus: '',
      note: '',
      createTime: '',
      createUserId: '',
      privileges: [],
      users: []
    }
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
            this.initTableData()
          })
      })
      .catch(() => {})
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

<style lang="scss" scoped>
.left-border {
  margin-left: 0;
}
.name-inp {
  width: 150px;
}
</style>
