<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <div class="ke-clear">
            <div class="ke-buttons ke-float-left">
              <el-button
                type="primary"
                @click="handlePublish"
              >
                发表留言
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch"
              >
                留言查询
              </el-button>
              <el-button @click="handleReload">
                <svg-icon name="reset" />刷新
              </el-button>
            </div>
          </div>
        </el-header>
        <p class="title">
          留言板
        </p>
        <el-main>
          <div
            v-for="(item1, index) in tableData"
            :key="index"
            class="list"
          >
            <div class="list-item">
              <p> <span>{{ item1.msgUser }}</span><span>{{ item1.msgUserDept }}</span><span>{{ item1.createTime }}</span></p>
              <p>{{ item1.content }}</p>
              <div class="operate">
                <span
                  style="cursor:pointer"
                  class="reply"
                  @click="handleReply(item1)"
                >回复</span>
                <span
                  class="delete"
                  @click="deleteRecord(item1.id)"
                >删除</span>
              </div>
              <div
                v-if="item1.reply"
                class="replay-box"
              >
                <el-input
                  v-model="message"
                  type="textarea"
                  :rows="4"
                  resize="none"
                  maxlength="500"
                  placeholder="请输入您的回复"
                  show-word-limit
                />
                <el-button
                  type="primary"
                  size="small"
                  :loading="item1.loading"
                  @click="postReply(item1)"
                >
                  发表回复
                </el-button>
              </div>
              <div
                v-if="item1&&item1.replyMsg.length!==0"
                class="list"
              >
                <div
                  v-for="(item2, index2) in item1.replyMsg"
                  :key="index2"
                  class="list-item"
                >
                  <p> <span>{{ item2.msgUser }}</span><span>{{ item2.msgUserDept }}</span><span>{{ item2.createTime }}</span></p>
                  <p>{{ item2.content }}</p>
                  <div class="operate">
                    <span
                      v-if="userId===item1.createUserId"
                      class="delete"
                      @click="deleteRecord(item2.id)"
                    >删除</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
        <el-footer height="auto">
          <el-pagination
            background
            class="ke-page"
            :page-sizes="[10,20,30,50,100]" 
            layout="prev, pager, next,total,jumper, sizes"
            :total="params.total"
            :page-size.sync="params.rows"
            :current-page.sync="params.page"
            @current-change="handlePage"
            @size-change="initTableData(1)"
          />
        </el-footer>
      </el-container>
    </el-main>
    <search-form
      v-if="dialog.visible"
      :dialog.sync="dialog"
      :params.sync="params"
      @emitSetParams="setSearchParmas"
    />
    <publish-msg
      v-if="publishDialog.visible"
      :dialog.sync="publishDialog"
      @emitLoad="initTableData"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import ElementUI from 'element-ui'
import IDict from '@/interface/dict'
@Component({
  name: 'Record',
  components: {
    SearchForm: () => import('./search.vue'),
    PublishMsg: () => import('./publishMsg.vue')
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
  private message: string = ''
  private dialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private publishDialog: any = {
    title: '',
    visible: false,
    isAdd: false
  }
  private params: any = {
    total: 0,
    page: 1,
    rows: this.$base.grid.page,
    startTime: '',
    endTime: '',
    createUserName: '',
    replyUserName: '',
    content: ''
  }
  private userId:any=this.$store.state.user.userId
  created() {
    this.initTableData()
  }
  @Watch('dialog.isAdd')
  private handleAddChanged(val: boolean, oldVal: boolean): void {
    if (val === true) {
      this.dialog.visible = false
    }
  }
  private initTableData(data?:any): void {
    if (data){
      this.params.page = data
    }
    this.$base.grid.resizePage({len: this.tableData.length,search: this.params})
    this.$http.request({
      url: '/evt/messageboard/findMyMessageboardPage',
      method: 'post',
      data: this.params
    }).then((res: any) => {
      this.params.total = res.total
      this.tableData = res.rows
    }).finally(() => {
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
  private handleReload(): void {
    this.params = {
      total: 0,
      page: 1,
      rows: this.$base.grid.page,
      startTime: '',
      endTime: '',
      createUserName: '',
      replyUserName: '',
      content: ''
    }
    this.initTableData()
  }
  private handlePage(currentPage: number): void {
    this.params.page = currentPage
    this.initTableData()
  }
  private handleSearch(): void {
    this.dialog.title = '留言查询'
    this.dialog.visible = true
  }
  private setSearchParmas (params:any): void {
    this.params = Object.assign(this.params,params)
    this.initTableData(1)
  }
  private handlePublish(): void {
    this.publishDialog.title = '发表留言'
    this.publishDialog.visible = true
    this.publishDialog.isAdd = false
  }
  private handleReply(item): void {
    if (item.reply) {
      this.$set(item, 'reply', !item.reply)
    } else {
      this.$set(item, 'reply', true)
    }
  }
  private postReply(item): void {
    if (!this.message) {
      this.$message({
        message: '请输入回复',
        type: 'warning'
      })
    } else {
      this.$set(item, 'loading', true)
      let replyParams:any = {
        content: this.message,
        replyMsgId: item.id,
        title: '1',
        msgType: 0
      }
      this.$http.request({
        url: '/evt/messageboard/addMessageboard',
        method: 'post',
        data: replyParams
      }).then((res: any) => {
        if (res.code === 200){
          this.$base.win.msg('成功','success')
          this.message = ''
          this.$set(item, 'reply', false)
          this.$set(item, 'loading', false)
          this.initTableData()
        }
      })

    }
  }
  private deleteRecord(item:any): void {
    this.$confirm('确定删除该条留言记录吗？','删除提醒', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.$http.request({
        url: '/evt/messageboard/deleteMessageboard',
        method: 'post',
        data: {ids: item}
      }).then((res:any) => {
        if (res.code === 200){
          this.$base.win.msg('成功','success')
          this.initTableData()
        }
      })
    })
  }
  
}
</script>

<style lang="scss" scoped>
.main-header{
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
  .el-button{
    height: 36px;
    margin-left: 30px;
  }
}
.title{
  width: 100%;
  padding: 12px 18px;
  background:linear-gradient(0deg,rgba(242,242,242,1),rgba(245,246,248,1));
  color: #012F55;
  font-weight: 600;
  margin-bottom: 15px;
}
.list{
  padding: 0 15px;
  background:rgba(244,245,247,1);
  border:1px solid rgba(229,229,229,1);
  margin-bottom: 15px;
  .list-item{
    border-top: 1px solid #CCCCCC;
    p:nth-child(1){
      padding: 17px 0 10px 0;
      span{
        font-size: 14px;
        color: #012F55;
        margin-right: 30px;
      }
    }
    p:nth-child(2){
      color: #333333;
    }
    .operate{
      padding: 12px 0;
      font-size: 12px;
      color: #999999;
      span{
        margin-right: 20px;
      }
      .delete{
       color: #028CFF;
       cursor: pointer;
      }
      span:nth-child(3){
        color: #333333;
        cursor: pointer;
      }
    }
  }
  .list-item:first-child{
    border-top: 0;
    padding-left: 0;
  }
  // .list-item:last-child{
  //   border-bottom: 0;
  // }
  // // 待联调
  // .list-item:nth-child(2){
  //   margin-left: 30px;
  // }
  // .list-item:nth-child(3){
  //   margin-left: 60px;
  // }
}
.replay-box{
  text-align: right;
  .el-button{
    margin-top: 10px;
    margin-bottom: 15px;
  }
}
</style>
