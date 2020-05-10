<template>
  <el-dialog
    :title="dialog.title"
    width="1150px"
    :append-to-body="true"
    :visible.sync="dialog.visible"
  >
    <el-row v-loading="loading">
      <el-col :span="12">
        <div class="ke-title">
          修改前
        </div>
        <el-form
          ref="ruleForm"
          v-loading="loading"
          label-width="85px"
          class="ke-form left"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="案件来源"
                prop="evtResource"
              >
                <div class="des">
                  {{ item.beforeEvent.evtResource }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="案件类别"
                prop="evtClassId"
              >
                <div class="des">
                  {{ item.beforeEvent.evtClassId }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="案件等级"
                prop="evtLevel"
              >
                <div class="des">
                  {{ item.beforeEvent.evtLevel }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属区域"
                prop="evtAreaId"
              >
                <div class="des">
                  {{ item.beforeEvent.evtAreaId }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="事发位置"
                prop="evtLocation"
              >
                <div class="des">
                  {{ item.beforeEvent.evtLocation }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="案件坐标"
                prop="point"
              >
                <div class="des">
                  {{ item.beforeEvent.point }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="工作网格"
                prop="workGridCode"
              >
                <div class="des">
                  {{ item.beforeEvent.workGridCode }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="单元网格"
                prop="cellGridCode"
              >
                <div class="des">
                  {{ item.beforeEvent.cellGridCode }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="问题描述"
                prop="content"
              >
                <div class="des">
                  {{ item.beforeEvent.content }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="接收角色"
                prop="receiveRole"
              >
                <div class="des">
                  {{ item.beforeEvent.receiveRole }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="举报人"
                prop="reporterName"
              >
                <div class="des">
                  {{ item.beforeEvent.reporterName }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="举报时间"
                prop="reportTime"
              >
                <div class="des">
                  {{ item.beforeEvent.reportTime }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="需要回复"
                prop="needReply"
              >
                <div class="des">
                  {{ item.beforeEvent.needReply }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="回复方式"
                prop="replyParam.replyMode"
              >
                <div class="des">
                  {{ item.beforeEvent.replyMode }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="回复号码"
                prop="replyParam.replyPho"
              >
                <div class="des">
                  {{ item.beforeEvent.needReply }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="回复姓名"
                prop="replyParam.replyUserName"
              >
                <div class="des">
                  {{ item.beforeEvent.replyUserName }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="附件"
                prop="note"
              >
                <div class="des">
                  {{ item.beforeEvent.files }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="note"
              >
                <div class="des">
                  {{ item.beforeEvent.note }}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="ke-title">
          修改后
        </div>
        <el-form
          ref="ruleForm"
          v-loading="loading"
          label-width="85px"
          class="ke-form right"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="案件来源"
                prop="evtResource"
              >
                <div class="des">
                  {{ item.afterEvent.evtResource }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="案件类别"
                prop="evtClassId"
              >
                <div class="des">
                  {{ item.afterEvent.evtClassId }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="案件等级"
                prop="evtLevel"
              >
                <div class="des">
                  {{ item.afterEvent.evtLevel }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="所属区域"
                prop="evtAreaId"
              >
                <div class="des">
                  {{ item.afterEvent.evtAreaId }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="事发位置"
                prop="evtLocation"
              >
                <div class="des">
                  {{ item.afterEvent.evtLocation }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="案件坐标"
                prop="point"
              >
                <div class="des">
                  {{ item.afterEvent.point }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="工作网格"
                prop="workGridCode"
              >
                <div class="des">
                  {{ item.afterEvent.workGridCode }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="单元网格"
                prop="cellGridCode"
              >
                <div class="des">
                  {{ item.afterEvent.cellGridCode }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="问题描述"
                prop="content"
              >
                <div class="des">
                  {{ item.afterEvent.content }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="接收角色"
                prop="receiveRole"
              >
                <div class="des">
                  {{ item.afterEvent.receiveRole }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="举报人"
                prop="reporterName"
              >
                <div class="des">
                  {{ item.afterEvent.reporterName }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="举报时间"
                prop="reportTime"
              >
                <div class="des">
                  {{ item.afterEvent.reportTime }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="需要回复"
                prop="needReply"
              >
                <div class="des">
                  {{ item.afterEvent.needReply }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="回复方式"
                prop="replyParam.replyMode"
              >
                <div class="des">
                  {{ item.afterEvent.replyMode }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="回复号码"
                prop="replyParam.replyPho"
              >
                <div class="des">
                  {{ item.afterEvent.needReply }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="回复姓名"
                prop="replyParam.replyUserName"
              >
                <div class="des">
                  {{ item.afterEvent.replyUserName }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="附件"
                prop="note"
              >
                <div class="des">
                  {{ item.afterEvent.files }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="备注"
                prop="note"
              >
                <div class="des">
                  {{ item.afterEvent.note }}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class extends Vue {
    @Prop() private dialog:any
    private item:any={
      afterEvent: {
        replyParam: {},
        evtAnnexes: []
      },
      beforeEvent: {
        replyParam: {},
        evtAnnexes: []
      }
    }
    private loading:boolean=true
    private created(){
      this.load()
    }
    private load(){
      this.$http.post('evt/modifyLog/findModifyLogById',{id: this.dialog.data}).then((res:any) => {
        this.item = res.data
        this.loading = false
        setTimeout(() => {
          this.scroll()
        }, 2000) 
      })
    }
    private scroll(){
      let l:any = document.querySelector('.left' )
      let r:any = document.querySelector('.right' )
      let flag:boolean = true
      l.addEventListener('mouseover' ,function(e){
        flag = false
        l.addEventListener('scroll',function(ev){
          if (!flag){
            r.scrollTop = 111
          }
        })
      })
      r.addEventListener('mouseover' ,function(e){ 
        flag = false
        r.addEventListener('scroll',function(ev){
          if (!flag){
            l.scrollTop = 111
          }
        })
      })
    }
}
</script> 
<style lang="scss" scoped>
.ke-form{
  max-height: 80vh;
  overflow: auto;
}
.des{
    border-bottom: 1px dotted #dddddd;
    height:35px;
    line-height: 35px;
}
</style>
