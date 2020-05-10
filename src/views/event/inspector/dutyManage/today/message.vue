<template>
  <el-dialog
    v-dialog-drag
    title="群发消息"
    :visible.sync="dialog.visible"
    width="1100px"
  >
    <el-form
      label-width="75px"
      label-position="right"
    >
      <el-row>
        <el-col
          class="search-item"
          :span="6"
        >
          <el-form-item
            label="姓名"
          >
            <el-input v-model="params.userName" />
          </el-form-item>
        </el-col>
        <el-col
          class="search-item"
          :span="6"
        >
          <el-form-item label="登录状态">
            <el-select
              v-model="params.isOnline"
              placeholder="全部"
            >
              <el-option
                v-for="item in onlineOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          class="search-item"
          :span="6"
        >
          <el-form-item label="所属区域">
            <ke-tree
              v-model="params.areaId"
              :clearable="true"
            />
          </el-form-item>
        </el-col>
        <el-col
          class="search-item margin-left"
          :span="6"
        >
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >
            查询
          </el-button>
          <el-button
            type="warning"
            @click="handleReset"
          >
            <svg-icon name="reset" />重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="scroll-container">
      <el-scrollbar
        class="ke-scrollbar"
        style="height:100%"
      >
        <el-table
          ref="eltableCurrentRow"
          v-loading="loading"
          class="table-container"
          :data="tableData"
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
          />
          <el-table-column
            prop="pdaNum"
            label="城管通号"
            align="center"
          />
          <el-table-column
            prop="workerNo"
            label="编号"
            align="center"
          />
          <el-table-column
            prop="userStatus"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.isOnline === 1? "在线":"离线" }}
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
            prop="area"
            label="所属区域"
            align="center"
          />
          <el-table-column
            prop="type"
            label="人员类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.userType }}
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    <el-footer>
      <el-pagination
        background
        class="ke-page"
        layout="prev, pager, next,total,jumper"
        :total="total"
        :current-page.sync="params.page"
        @current-change="handlePage"
      />
    </el-footer>
    <div>
      <el-form ref="ruleForm">
        <el-form-item
          label="消息内容："
          name="content"
        >
          <el-input
            v-model="msgParams.content"
            type="textarea"
            :rows="4"
            height="50px"
            resize="none"
            maxlength="250"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-radio-group
            v-model="msgParams.msgNum"
            name="msgNum"
          >
            <el-radio :label="1">
              同时发送通讯消息与移动短信
            </el-radio>
            <el-radio :label="2">
              在岗发送通讯消息，不在岗发送移动短信
            </el-radio>
            <el-radio :label="3">
              通讯消息形式
            </el-radio>
            <el-radio :label="4">
              短信消息形式
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="opeate-buttons">
        <el-button @click="handleCancel">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="handleSave"
        >
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'TaskForm'
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private total: any = 1
  private selections: Array<any> = []
  private row: any = {}
  private loading: boolean = true
  private msgParams: any = {
    content: '',
    msgNum: '',
    ids: ''
  }
  private params = {
    userName: '',
    isOnline: '',
    areaId: '',
    page: 1
  }
  private tableData: Array<any> = []
  private onlineOptions = [{
    label: '全部',
    value: ''
  },{
    label: '在线',
    value: 1
  },{
    label: '离线',
    value: 2
  }]
  mounted(){
    this.initTableData()
  }
  private initTableData():void{
    this.loading = true
    this.$http({
      url: '/obs/observer/findObserverByPage',
      method: 'post',
      data: this.params
    }).then((res) => {
      this.tableData = res.rows
      this.total = res.total
      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  private handleSearch():void{
    this.params.page = 1
    this.initTableData()
  }
  private handleClickRow(row: any) {
    this.row = row
    this.$base.grid.rowClcik(this.$refs.eltableCurrentRow, this.tableData, row)
  }
  private handlePage(val){
    this.params.page = val
    this.initTableData()
  }
  private handleReset(){
    this.$base.common.reset(this)
  }
  private handleSelectionChange(val: Array<any>) {
    this.selections = val
  }
  private handleCancel(){
    let dialog = {
      visible: false
    }
    this.$emit('update:dialog',dialog)
  }
  private handleSave(){
    if (this.selections.length < 1){
      this.$base.win.msg('未选择监督员')
      return
    }
    if (this.msgParams.content.trim() === ''){
      this.$base.win.msg('未填写消息内容')
      return
    }
    if (this.msgParams.msgType === ''){
      this.$base.win.msg('未选择消息类型')
      return
    }
    let ids: any = []
    this.selections.forEach((item) => {
      ids.push(item.id)
    })
    this.msgParams.ids = ids.join(',')
    this.$http({
      url: '/obs/msg/addObserverMessage',
      method: 'post',
      data: this.msgParams
    }).then((res) => {
      this.$base.win.msg('成功','success')
    })
  }
}
</script>
<style scoped>
.search-item >>> .el-form-item{
  margin-bottom: 0px !important;
}
</style>
<style lang="scss" scoped>
.scroll-container{
  margin-top: 15px;
  max-height: 200px;
  overflow: scroll;
}
.opeate-buttons {
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
}
.margin-left {
  padding-left: 10px;
}
.table-container {
  margin-top: 15px;
}
.search-item {
  display: flex;
  flex-flow: row;
  align-items: center;
  label {
    width: 120px;
    text-align: right;
  }
}
</style>
