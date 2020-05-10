<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <el-form
            class="ke-search"
            label-width="80px"
          >
            <el-row>
              <el-col :span="6">
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
              <el-col
                v-if="classes===5"
                :span="6"
              >
                <el-form-item label="统计时间">
                  <el-date-picker
                    v-model="date"
                    type="datetime"
                  />
                </el-form-item>
              </el-col>
              <el-col
                v-else
                :span="6"
              >
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
                v-if="classes===5"
                :span="6"
              >
                <el-form-item
                  label="至"
                  class="ke-center"
                >
                  <el-date-picker
                    v-model="date"
                    type="datetime"
                  />
                </el-form-item>
              </el-col>
              <el-col
                v-else
                :span="1"
                class="label"
              >
                年 <span v-if="classes===1 || classes===2">第</span>
              </el-col>
              <el-col
                v-if="classes === 1"
                :span="4"
              >
                <el-select
                  v-model="month"
                  placeholder="请选择"
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
                :span="4"
              >
                <el-select
                  v-model="quarter"
                  placeholder="请选择"
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
                :span="4"
              >
                <el-select
                  v-if="classes === 3"
                  v-model="halfYear"
                  placeholder="请选择"
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
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="统计区域">
                  <el-select
                    v-model="area"
                  >
                    <el-option
                      v-for="item in areaOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                class="buttons"
              >
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="handleSearch"
                >
                  查询
                </el-button>
                <el-button
                  type="success"
                  icon="el-icon-s-promotion"
                >
                  发布
                </el-button>
                <el-button>
                  <svg-icon name="export" />导出
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <el-tabs
            v-model="tabs.activeName"
            class="ke-tab"
            :before-leave="handleTabs"
          >
            <el-tab-pane
              label="数据报表"
              name="first"
            >
              <my-form v-if="tabs.isFirst" />
            </el-tab-pane>
            <el-tab-pane
              label="图形报表"
              name="second"
            >
              <my-chart v-if="tabs.isSecond" />
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
@Component({
  name: 'Part',
  components: {
    MyForm: () => import('./form.vue'),
    MyChart: () => import('./chart.vue')
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
  private classes: number = 1
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
    },
    {
      value: 5,
      label: '任意'
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
  private tabs:any = {
    activeName: 'first',
    isFirst: true,
    isSecond: false
  }
  created() {
  }
  private handleSearch(): void {
    // to do
  }
  private handleTabs(name:string): void {
    if (name === 'first' && this.tabs.isFirst === false){
      this.tabs.isFirst = true
    } else if (name === 'second' && this.tabs.isSecond === false){
      this.tabs.isSecond = true
    }
  }
}
</script>

<style lang="scss">
.statistics-el-tab{
  .el-tabs__content{
    height: calc(100% - 158px);
    .el-tab-pane{
      height: 100%;
      .el-container{
        height: 100%;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.el-tabs{
  height: 100%;
}
</style>
