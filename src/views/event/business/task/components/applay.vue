<template>
  <el-dialog
    :title="dialog.title"
    width="1350px"
    :visible.sync="dialog.visible"
  >
    <el-row>
      <el-col
        :span="15"
        style="width:60%;"
      >
        <event-details />
      </el-col>  
      <el-col
        :span="9"
        style="width:40%;"
      >
        <div class="form">
          <el-divider
            content-position="left"
            class="title"
          >
            基础信息
          </el-divider>
          <table
            class="kd-table table"
            cellspacing="0"
            cellpadding="0"
            border="0"
          >
            <colgroup>
              <col style="width:20%;">
              <col style="width:80%;">
            </colgroup>
            <tbody>
              <tr>
                <th>申请人：</th>
                <td>系统管理员</td>
              </tr>
              <tr>
                <th>申请日期：</th>
                <td>2018-07-20 10:00:24</td>
              </tr>
              <tr>
                <th>申请理由：</th>
                <td>案件信息错误</td>
              </tr>
            </tbody>
          </table>
          <el-divider
            content-position="left"
            class="title"
          >
            操作记录
          </el-divider>
          <div class="time">
            <el-timeline>
              <el-timeline-item
                timestamp="2018/4/12"
                placement="top"
              >
                <el-card>
                  <div class="body">
                    <div class="str">
                      待责任单位处理
                    </div>
                    <ul>
                      <li>类型：申请<span>|</span></li>
                      <li>申请人：系统管理员<span>|</span></li>
                      <li>申请时间：06-29 14:29:42</li>
                    </ul>
                  </div>
                </el-card>
              </el-timeline-item>
              <el-timeline-item
                timestamp="2018/4/12"
                placement="top"
                color="#0bbd87"
              >
                <el-card>
                  <div class="body">
                    <div class="str">
                      待责任单位处理
                    </div>
                    <ul>
                      <li>类型：审批<span>|</span></li>
                      <li>审批人：管理员<span>|</span></li>
                      <li>审批时间：06-29 14:29:42<span>|</span></li>
                      <li>审批结果：不通过</li>
                    </ul>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
          <el-divider
            content-position="left"
            class="title"
          >
            审批意见
          </el-divider>
          <el-input
            v-model="form.word"
            type="textarea"
            placeholder="请输入审批意见"
            maxlength="200"
            show-word-limit
            resize="none"
          />
          <div
            class="ke-dialog-footer"
          >
            <el-button @click="handleCancel">
              <svg-icon name="close" />取 消
            </el-button>
            <el-button
              type="success"
              @click="handleTG"
            >
              <svg-icon name="save" />通 过
            </el-button>
            <el-button
              :loading="loading"
              type="danger"
              @click="handleBTG()"
            >
              <svg-icon name="close" />不通过
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'

@Component({
  components: {
    EventDetails: () => import('./details.vue')
  }
})
export default class extends Vue {
    @Prop()private dialog:any
    private loading:boolean = false
    private form:any={
      word: ''
    }
    setForm(){
      if (this.form.word.trim().length === 0){
        (this.$refs.word as any).handleFocus()
        this.$base.win.msg('请输入审批意见！')
        return false
      }
      return true
    }
    handleBTG() {
      this.setForm()

      this.$base.win.msg('审批成功！','success')
      this.handleCancel()
    }
    handleTG(){
      this.setForm()
      this.$base.win.msg('审批成功！','success')
      this.handleCancel()
    }
    handleCancel(){
      this.$emit('update:dialog', {
        visible: false
      })
    }
}
</script>
 
<style lang="scss" scoped>
.form{
    .ke-dialog-footer{
        padding: 15px 0;
    }
    margin-top: 38px;
    height:510px;
    overflow: auto;
    padding: 0 15px;
    border-top:2px solid #E4E7ED;
    .time{
        .body{
            .str{
                font-weight: 600;
            }
            ul{
                margin-top: 10px;
                li{
                    float: left;
                    color: #909399;
                    span{
                        display: inline-block;
                        position: relative;
                        top: -2px;
                        padding: 0 8px;
                    }
                    margin-bottom: 5px;
                }
                margin-bottom: 20px;
            }
        }
    }
    .el-divider{
      margin: 25px 0 20px 0;
      > div{
        font-size: 16px;
        font-size: 600;
      }
    }
}
</style>
