<template>
  <div class="ke-layout">
    <el-container class="ke-layout-container">
      <ke-aside
        class="ke-body"
        width="229px"
        title="导航"
      >
        <template>
          <el-scrollbar class="tree-container">
            <el-tree
              ref="tree"
              node-key="id"
              :data="treeData"
              :props="defaultProps"
              highlight-current
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </template>
      </ke-aside>
      <el-main class="ke-body">
        <p>责任单位评价指标参数</p>
        <ul class="list">
          <li>
            <span>按期结案量权重</span>
            <el-input v-model="tableData.onTimeClosedNumWeight" />
            %
          </li>
          <li>
            <span>按期结案率权重</span>
            <el-input v-model="tableData.onTimeClosedPercentWeight" />
            %
          </li>
          <li>
            <span>结案率得分权重</span>
            <el-input v-model="tableData.closedPercentWeight" />
            %
          </li>
          <li>
            <span>效率评价得分权重</span>
            <el-input v-model="tableData.overtimeClosedAndLegacyWeight" />
            %
          </li>
          <li>
            <span>基准分权重</span>
            <el-input v-model="tableData.basicStandardWeight" />
            %
          </li>
        </ul>
        <div class="ke-buttons">
          <el-button
            class="save"
            type="primary"
            @click="handleSave"
          >
            保存
          </el-button>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import IDict from '@/interface/dict'
import { UserModule } from '@/store/modules/user'
@Component({
  name: 'Weight',
  components: {
    KeAside: () => import('@/components/keAside.vue')
  }
})
export default class extends Vue {
  public $refs: any = { quickEntry: HTMLFormElement }
  // 表格数据是否正在加载
  private listLoading: boolean = true
  // 点击行数据
  private row: any = {}
  private selections: Array<any> = []
  private ids: Array<any> = []
  // 获取选择项数据id(修改时用)
  private id: number = 0
  private sonId: number = 0
  private tableData: Array<any> = []
  private treeData: Array<any> = [
    {
      text: '评价类型',
      children: [
        {
          text: '责任单位评价'
        },
        {
          text: '受理员评价'
        },
        {
          text: '值班长评价'
        },
        {
          text: '派遣员评价'
        }
      ]
    }
  ]
  private defaultProps: any = {
    children: 'children',
    label: 'text'
  }
  private value: string = ''
  // 选中要修改的数据
  private selectionItem: any = {}
  private total: number = 0
  private baseURL: any = sessionStorage.getItem('baseURL')
  private statusOptions: Array<any> = [
    {
      value: 0,
      label: '全部'
    },
    {
      value: 1,
      label: '正常'
    },
    {
      value: -1,
      label: '删除'
    }
  ]
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    page: 1,
    rows: this.$base.grid.page,
    deptId: 0,
    userName: '',
    loginName: ''
  }
  created() {
    this.initTableData()
    // this.initTreeData()
  }
  private initTreeData(): void {
    this.$http.request({
      url: '/dept/getDepartTreeData',
      method: 'post',
      data: {}
    }).then((res: any) => {
      // console.log(res)
      this.treeData = res.data
    })
  }
  private initTableData(): void {
    this.$http.request({
      url: '/eva/evaSet/queryEvaDeptWeight',
      method: 'post',
      data: this.params
    }).then((res: any) => {
      this.listLoading = false
      this.tableData = res.data
    })
  }
  private handleNodeClick(data: any): void {
    // console.log(Number(data.id))
    // this.params.deptId = Number(data.id)
    // this.initTableData()
  }
  private handleSave(): void {
    this.$http.request({
      url: '/eva/evaSet/addEvaDeptWeight',
      method: 'post',
      data: this.tableData
    }).then((res: any) => {
      this.$base.win.msg('成功', 'success')
      this.initTableData()
    })
  }
}
</script>
<style scoped>
.tree-container >>> .el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
<style lang="scss" scoped>
.ke-body {
  padding: 15px !important;
  flex-direction: column;
  display: flex;
}
.el-container {
  height: 100%;
}
.el-footer {
  height: auto !important;
}
.tree-container {
  height: calc(100% - 22px);
}
.form-container{
  margin-bottom: 0 !important;
}
.el-main{
  p{
    line-height: 40px;
  }
  .list{
    margin-bottom: 20px;
    li{
      line-height: 36px;
      margin: 20px;
      span{
        display: inline-block;
        width: 140px;
        text-align: left;
      }
      .el-input{
        width: 150px;
        margin: 0 10px;
      }
    }
  }
}
.save{
  padding: 10px 50px!important;
}
</style>
