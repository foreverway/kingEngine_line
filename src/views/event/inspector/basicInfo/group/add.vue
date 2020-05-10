<!-- eslint-disable no-irregular-whitespace -->
<template>
  <div>
    <el-dialog
      v-dialog-drag
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="700px"
    >
      <div
        v-loading="loading"
        class="add-department"
      >
        <el-form
          ref="basicForm"
          :model="params"
          :rules="rules"
          label-width="120px"
        >
          <el-tabs
            v-model="activeName"
          >
            <el-tab-pane
              label="基本信息"
              name="first"
            >
              <div class="basic-container">
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      label="工作组名称"
                      prop="workGroupName"
                    >
                      <el-input
                        v-model="params.workGroupName"
                        placeholder="请输入工作组名称"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      label="所属区域 "
                      prop="areaId"
                    >
                      <ke-tree
                        v-model="params.areaId"
                        :clearable="true"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item
                      label="排序号"
                      prop="orderNum"
                    >
                      <el-input
                        v-model="params.orderNum"
                        placeholder="请输入排序号"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item
                  label="备注"
                  prop="note"
                >
                  <el-input
                    v-model="params.note"
                    type="textarea"
                    placeholder="请输入备注"
                    :rows="4"
                    resize="none"
                    maxlength="250"
                    show-word-limit
                  />
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="工作网格"
              name="second"
            >
              <div class="group-container">
                <el-transfer
                  v-model="transferValue"
                  filterable
                  style="text-align: left; display: block;"
                  :titles="['可选择工作网格', '已选择工作网格']"
                  :props="{
                    key: 'id',
                    label: 'gridName'
                  }"
                  :data="gridList"
                  @change="handleTransferChange"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="工作人员"
              name="third"
              class="pane-item"
            >
              <div class="person-container">
                <div class="buttons">
                  <el-button @click="handleSetIn">
                    调入
                  </el-button>
                  <el-button @click="handleSetOut">
                    调出
                  </el-button>
                  <el-button @click="handleSetLeader">
                    设为组长
                  </el-button>
                  <!-- <el-button
                    v-power
                    code="refresh"
                    @click="handleRefresh"
                  >
                    <svg-icon name="reset" />刷新
                  </el-button> -->
                </div>
                <div class="table-container">
                  <el-scrollbar
                    class="ke-scrollbar"
                    style="height:100%"
                  >
                    <el-table
                      ref="eltableCurrentRow"
                      v-loading="listLoading"
                      :data="sonSelections"
                      stripe
                      style="width: 100%"
                      height="100%"
                      @row-click="handleClickRow"
                      @selection-change="handleSelectionChange"
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
                        prop="userName"
                        label="姓名"
                        align="center"
                      >
                        <template slot-scope="scope">
                          <p
                            v-if="scope.row.id === params.captainId"
                            class="captain-text"
                          >
                            队长
                          </p>
                          <p>{{ scope.row.userName }}</p>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="sex"
                        label="性别"
                        align="center"
                      >
                        <template slot-scope="scope">
                          {{ scope.row.sex === 1?"男":"女" }}
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="workerNo"
                        label="编号"
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
                      <el-table-column
                        prop="address"
                        label="所属区域"
                        align="center"
                      />
                    </el-table>
                  </el-scrollbar>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
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
      </div>
    </el-dialog>
    <observer
      v-if="sonDialog.visible"
      :dialog.sync="sonDialog"
      :select-users.sync="sonSelections"
    />
    <!-- <person
      v-if="sonDialog.visible"
      :dialog.sync="sonDialog"
      :son-selections.sync="sonSelections"
    /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop,Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'
@Component({
  name: 'TaskForm',
  components: {
    areaTree: () => import('../../components/areaTree.vue'),
    observer: () => import('@/components/set/observer.vue'),
    Person: () => import('./person.vue')
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
  private listLoading = false
  private activeName: string = 'first'
  private selections: Array<any> = []
  private sonSelections: Array<any> = []
  private row: any = {}
  private gridList: Array<any> = []
  private transferValue: Array<any> = []
  private loading: boolean = true
  private userTypeDict: Array<any> = []
  private sonDialog: any = {
    visible: false
  }
  private addressOptions: any = [
    {
      label: '宝安区',
      value: '宝安区'
    },{
      label: '南山区',
      value: '南山区'
    },{
      label: '罗湖区',
      value: '罗湖区'
    },{
      label: '福田区',
      value: '福田区'
    },{
      label: '龙岗区',
      value: '龙岗区'
    },{
      label: '盐田区',
      value: '盐田区'
    }
  ]
  private rules: object = {
    workGroupName: [
      { required: true,pattern: '[^ \x22]+', message: '请输入工作组名称', trigger: 'change' }
    ],
    orderNum: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      {
        pattern: /^[0-9]*(.[0-9]+)?$/,
        message: '请输入数字'
      }
    ],
    areaId: [
      { required: true, message: '请选择所属区域',trigger: 'change' }
    ]
  }
  private params: any = {
    workGroupName: '',
    areaId: undefined,
    orderNum: '',
    note: '',
    workGridIds: '',
    captainId: '',
    obsIds: ''
  }
  created() {
    this.handleGetUserType()
    this.initWorkGrid().then(() => {
      if (this.dialog.item){
        this.getGroupDetail()
      } else {
        this.loading = false
      }
    })
  }
  async handleGetUserType(){
    let res = await this.$base.dict.getItems('observer_type')
    this.userTypeDict = res
  }
  private getGroupDetail(){
    this.$http({
      url: '/obs/workGroup/getWorkGroupDetail',
      method: 'post',
      data: {
        id: this.dialog.item.id
      }
    }).then((res) => {
      this.params.areaId = res.data.areaId
      this.params.orderNum = res.data.orderNum
      this.params.workGroupName = res.data.workGroupName
      this.params.note = res.data.note
      let workGridIds:any = []
      res.data.workGrids.forEach((workGrid) => {
        workGridIds.push(workGrid.id)
      })
      this.transferValue = workGridIds
      this.sonSelections = res.data.observers
      this.params.captainId = res.data.captainId
      this.params.id = this.dialog.item.id
      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  private initWorkGrid() {
    return new Promise((resolve,reject) => {
      this.$http({
        url: '/obs/workGrid/findAllWorkGridList',
        method: 'post'
      }).then((res) => {
        this.gridList = res.data
        resolve()
      })
    })
  }
  private handleTransferChange(value, direction, movedKeys): void{
    this.params.workGroupIds = this.transferValue.join(',')
  }
  private handleSubmit() {
    let form = this.$refs.basicForm as ElForm
    form.validate(async(valid: boolean) => {
      if (valid) {
        this.formatData()
        if (this.dialog.item){
          this.handleEdit()
        } else {
          this.handleSave()
        }
      } else {
        this.$base.win.msg('必填项不能为空', 'error')
        return false
      }
    })
  }
  private formatData(){
    this.params.workGridIds = this.transferValue.join(',')
    let obsIds: any = []
    this.sonSelections.forEach((item) => {
      obsIds.push(item.id)
    })
    this.params.obsIds = obsIds.join(',')
  }
  private handleEdit(){
    this.$http({
      url: '/obs/workGroup/updateWorkGroup',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleInit')
      this.handleClose()
    })
  }
  private handleSave(){
    this.$http({
      url: '/obs/workGroup/addWorkGroup',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.$base.win.msg('操作成功','success')
      this.$emit('handleReload')
      this.handleClose()
    })
  }
  private handleClose(): void {
    let dialog = {
      title: '',
      visible: false,
      id: 0
    }
    this.$emit('update:dialog', dialog)
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.sonSelections, row)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleSetIn(){
    this.sonDialog = {
      visible: true
    }
  }
  private handleSetOut(){
    if (this.selections.length <= 0){
      this.$base.win.msg('请至少选择一位监督员')
      return
    }
    this.$confirm('确定调出选中的人员吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      for (let selection of this.selections){
        if (selection.userId === this.params.captainId){
          this.params.captainId = ''
        }
        for (let index in this.sonSelections){
          if (selection.id === this.sonSelections[index].id){
            this.sonSelections.splice(Number(index),1)
            break
          }
        }

      }
    })
  }
  private handleSetLeader(){
    if (this.selections.length !== 1){
      this.$base.win.msg('必须选择一位监督员')
      return
    }
    this.params.captainId = this.selections[0].id
    this.$base.win.msg('设置成功','success')
  }
  private handleRefresh(){

  }
}
</script>

<style lang="scss" scoped>
.table-container{
  height: 280px;
}
.buttons{
  margin-bottom: 10px;
}
.pane-item{
    height: 100%;
}
.add-department {
  height: 470px;
}
.opeate-buttons {
  text-align: right;
  margin-top: 10px;
}
.captain-text{
  color: #ff4949;
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
.basic-container,.group-container ,.person-container{
  height: 375px;
}
</style>
