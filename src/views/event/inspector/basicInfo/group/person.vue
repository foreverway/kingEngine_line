<!-- eslint-disable no-irregular-whitespace -->
<template>
  <el-dialog
    v-dialog-drag
    title="监督员选择"
    :visible.sync="dialog.visible"
    width="1000px"
  >
    <el-header height="auto">
      <el-form
        :model="params"
        class="ke-search"
        label-width="75px"
      >
        <el-row>
          <el-col
            :span="6"
            class="form-item"
          >
            <el-form-item
              label="姓名"
            >
              <el-input
                ref="params"
                v-model="params.userName"
                placeholder="请输入姓名"
                class="page-inp"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            class="form-item"
          >
            <el-form-item
              label="城管通号"
            >
              <el-input
                ref="params"
                v-model="params.pdaNum"
                placeholder="请输入城管通号"
                class="page-inp"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="6"
            class="form-item"
          >
            <el-form-item
              label="GPS状态"
            >
              <el-select
                v-model="params.gpsSignal"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in onlineOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col
            :span="5"
            class="form-item"
          >
            <el-form-item
              label="状态"
              label-width="55px"
            >
              <el-select
                v-model="params.isOnline"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in onlineOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="ke-buttons">
        <el-button
          v-power
          type="primary"
          icon="el-icon-search"
          code="search"
          @click="handleSearch"
        >
          查询
        </el-button>
        <el-button
          v-power
          type="warning"
          code="reset"
          @click="handleReset"
        >
          <svg-icon name="reset" />重置
        </el-button>
      </div>
    </el-header>
    <div style="height:400px">
      <el-scrollbar
        class="ke-scrollbar"
        style="height:100%"
      >
        <el-table
          ref="sonTable"
          v-loading="listLoading"
          :data="tableData"
          stripe
          style="width: 100%"
          height="100%"
          @row-click="handleClickRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="index"
            align="center"
            fixed="left"
          />
          <el-table-column
            type="selection"
            align="center"
            fixed="left"
          />
          <el-table-column
            prop="userName"
            label="姓名"
            align="center"
            width="120"
            fixed="left"
          />
          <el-table-column
            prop="workerNo"
            label="编号"
            align="center"
          />
          <el-table-column
            prop="isOnjob"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.isOnline === 1?"在线":"离线" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sex"
            label="性别"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.sex === 1 ? "男":"女" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话号码"
            align="center"
          />
          <el-table-column
            prop="address"
            label="所属区域"
            align="center"
          />
          <el-table-column
            prop="userType"
            label="人员类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.userType | userTypeFilter(userTypeDict) }}
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <el-footer
      class="footer"
      height="auto"
    >
      <el-pagination
        background
        class="ke-page"
        layout="prev, pager, next,total,jumper"
        :total="total"
        :current-page.sync="params.page"
        @current-change="handlePage"
      />
    </el-footer>
    <div class="opeate-buttons">
      <el-button @click="handleClose">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        v-power
        type="primary"
        code="save"
        @click="handleSubmit"
      >
        <svg-icon name="save" />保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ElTable } from 'element-ui/types/table'
@Component({
  name: 'TaskForm',
  components: {

  },
  filters: {
    userTypeFilter: function(val,dict){
      for (let i of dict){
        if (i.dictValue === val){
          return i.dictName
        }
      }
    }
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  @Prop({ default: [] }) sonSelections!: Array<any>
  private listLoading: boolean = true
  private params: any = {
    userName: '',
    pdaNum: '',
    isOnline: '',
    gpsSignal: '',
    page: 1
  }
  private userTypeDict: Array<any> = []
  private total: number = 0
  private tableData: Array<any> = []
  private selections:any = {}
  private row: any = {}
  private onlineOptions:any = [
    {
      label: '在线',
      value: 1
    },{
      label: '离线',
      value: 2
    }
  ]
  private mounted() {
    this.handleGetUserType()
    this.initTableData().then(() => {
      this.handleShowSelections()
    })
  }
  async handleGetUserType(){
    let res = await this.$base.dict.getItems('observer_type')
    this.userTypeDict = res
  }
  private initTableData() {
    return new Promise((resolve,reject) => {
      this.listLoading = true
      this.$http({
        url: '/obs/observer/findObserverByPage',
        method: 'post',
        data: this.params
      }).then((res) => {
        this.tableData = res.rows
        this.total = res.total
        resolve()
        this.$nextTick(() => {
          this.listLoading = false
        })
      })
    })
  }
  private handleShowSelections(){
    if (this.sonSelections.length <= 0){
      return
    }
    this.$nextTick(() => {
      let table = this.$refs.sonTable as ElTable
      for (let i of this.tableData){
        for (let j of this.sonSelections){
          if (i.id === j.id){
            table.toggleRowSelection(i,true)
            break
          }
        }
      }
    })
  }
  private handleSearch(){
    this.params.page = 1
    this.initTableData().then(() => {
      this.handleShowSelections()
    })
  }
  private handleReset(){
    this.$base.common.reset(this)
  }
  private handlePage(val){
    this.params.page = val
    this.initTableData().then(() => {
      this.handleShowSelections()
    })
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.sonTable, this.tableData, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections[this.params.page] = val
  }
  private handleClose(){
    let dialog = {
      visible: false
    }
    this.$emit('update:dialog',dialog)
  }
  private handleSubmit(){
    let sonSelections = []
    for (let i in this.selections){
      if (this.selections[i]){
        sonSelections = sonSelections.concat(this.selections[i])
      }
    }
    if (sonSelections.length <= 0){
      this.$base.win.msg('请至少选择一位监督员')
      return
    }
    this.$emit('update:sonSelections',sonSelections)
    this.handleClose()
  }
}

</script>

<style lang="scss" scoped>
.pane-item {
  height: 100%;
}

.opeate-buttons {
  text-align: right;
  margin-top: 15px;
}
.tips {
  color: #ff4949;
}
// .el-input,.el-select{
//   width: 210px;
// }
.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
.item-panel{
  margin-left: 30px;
  height: 35px;
  display: flex;
  flex-flow: row;
  align-items: center;
}
.footer{
  height: 42px !important
}
</style>
