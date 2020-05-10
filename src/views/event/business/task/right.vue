<template>
  <div
    v-loading="rightLoading"
    class="auto"
  >
    <div class="buttons">
      <el-button @click="handleHandle">
        办 理
      </el-button>
      <el-button @click="handleEdit">
        修 改
      </el-button>
      <el-button @click="handleFlow">
        流 程
      </el-button>
      <el-button @click="handleHT">
        回 退
      </el-button>
      <el-button @click="handleSQ">
        申 请
      </el-button>
      <el-button @click="handleCL">
        处 理
      </el-button>
      <el-button @click="handleJS">
        {{ row.islock===2?'解 锁':'加 锁' }}
      </el-button>
      <el-button @click="handleDB">
        对 比
      </el-button>
    </div>
    <div class="body">
      <div class="title">
        案件信息
      </div>
      <div class="form">
        <ul>
          <li><label>案件号： </label><span>{{ row.evtCodeStr }}</span></li>
          <li><label>剩余时间：</label><span style="color:#ff0000;">{{ row.remainTimeStr }}</span></li>
          <li>
            <label>案件类别：</label>
            <span>
              <el-tooltip
                :disabled="row.evtClassName.length<12"
                placement="bottom-start"
              >
                <div slot="content">
                  {{ row.evtClassName }}
                </div>
                <span class="str">{{ row.evtClassName }}</span>
              </el-tooltip>
            </span>
          </li>
          <li><label>案件来源：</label><span>{{ row.resourceStr }}</span></li>
          <li><label>所属区域：</label><span>{{ row.areaNameStr }}</span></li>
          <li>
            <label>案件位置：</label>
            <span>
              <el-tooltip
                :disabled="row.evtLocation.length<12"
                placement="bottom-start"
              >
                <div slot="content">
                  {{ row.evtLocation }}
                </div>
                <span class="str">{{ row.evtLocation }}</span>
              </el-tooltip>
            </span>
          </li>
          <li>
            <label>问题描述：</label><span>
              <el-tooltip
                :disabled="row.content.length<12"
                placement="bottom-start"
              >
                <div slot="content">
                  {{ row.content }}
                </div>
                <span class="str">{{ row.content }}</span>
              </el-tooltip>
            </span>
          </li>
          <li><label>办理期限：</label><span>{{ row.limitTimeStr }}</span></li>
          <li>
            <label>附件数量：</label><span>
              音频 {{ row.statisticsVO.recordingNum }} 份，
              视频 {{ row.statisticsVO.videoNum }} 份
              <a
                v-if="(row.statisticsVO.recordingNum+row.statisticsVO.videoNum+row.picNum)>0"
                class="ke-a"
              >详情</a>
            </span>
          </li>
        </ul>
      </div>
      <event-image ref="refImage" />
    </div>
    <handle-form
      v-if="dialog.visible"
      :dialog.sync="dialog"
      @reLoad="parentLoad"
    />
    <apply-form
      v-if="dialogSQ.visible"
      :dialog.sync="dialogSQ"
      @reLoad="parentLoad"
    />
    <el-dialog
      v-loading="loadingHT"
      :title="dialogHT.title"
      :append-to-body="true"
      :visible.sync="dialogHT.visible"
      width="450px"
    >
      <span>
        <ke-commonly
          v-if="dialogHT.visible"
          ref="wordHT"
          v-model="valHT"
          :params="handleIdeaObj"
          :is-top="false"
        />
      </span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogHT.visible=false">取 消</el-button>
        <el-button
          type="primary"
          @click="handleHTSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
    <event-db
      v-if="dialogDB.visible"
      :dialog.sync="dialogDB"
    />
    <event-flow
      v-if="dialogFlow.visible"
      :dialog.sync="dialogFlow"
    />
    <event-edit
      v-if="dialogEdit.visible"
      :dialog.sync="dialogEdit"
    />
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  components: {
    EventFlow: () => import('./components/flowDialog.vue'),
    EventEdit: () => import('./form.vue'),
    EventDb: () => import('./components/db.vue'),
    EventImage: () => import('./components/image.vue'),
    handleForm: () => import('./handle.vue'),
    keCommonly: () => import('@/components/keCommonly.vue'),
    ApplyForm: () => import('./apply.vue')
  }
})
export default class extends Vue {
    private row: any = {
      evtClassName: '',
      evtLocation: '',
      content: '',
      statisticsVO: {
        recordingNum: 0,
        videoNum: 0,
        picNum: 0
      }
    }
    private loadingHT:boolean=false
    private rightLoading: boolean = true
    private dialog: any = {
      title: '',
      visible: false
    }
    private dialogHT: any = {
      title: '',
      visible: false
    }
    private valHT:string=''

    private dialogSQ: any = {
      title: '',
      visible: false
    }

    private dialogDB: any = {
      title: '',
      visible: false
    }

    private dialogFlow: any = {
      title: '',
      visible: false
    }

    private dialogEdit: any = {
      title: '',
      visible: false
    }
    private handleIdeaObj:any
    private load(){

    }
    private detailLoad(parentRow:any){
      if (parentRow !== null){
        this.rightLoading = true
        this.$http.request({
          url: 'evt/event/getToDoEventDetails',
          method: 'post',
          data: {id: parentRow.id}
        }).then((res: any) => {
          if (res.data.annexeBeforeList !== null){
            let imgs:Array<string> = []
            res.data.annexeBeforeList.forEach((element:any) => {
              if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(element.annexeType)) {
                imgs.push(element.filePath)
              }
            })
            const $res = (this.$refs.refImage as any)
            $res.setData({
              images: imgs
            })
          }
          this.row = res.data
          this.rightLoading = false
        }).catch((e:any) => { 
          this.rightLoading = false
        })
      } else {
        this.rightLoading = false
      }
    }
    private handleHandle(){
      this.dialog = {
        title: this.row.evtCodeStr + '[办理]',
        visible: true,
        data: this.row
      }
    }
    private handleHT(){
      this.valHT = ''
      this.handleIdeaObj = {
        flowId: this.row.workFlowId,
        type: 2,
        eworkFlowTache: this.row.lastTacheCode,
        sworkFlowTache: this.row.workTache
      }
      this.dialogHT = {
        title: this.row.evtCodeStr + '[回退]',
        visible: true
      }
    }
    private handleHTSubmit(){
      if (this.valHT.trim().length === 0){
        (this.$refs.wordHT as any).handleFocus()
        this.$base.win.msg('请输入回退意见！')
        return
      }
      this.loadingHT = true
      let form = (this.$refs.ruleForm as any)
      form.validate((valid) => {
        if (valid) {
          this.$http.post('evt/delay/addDelay',{
            curTache: this.row.workTache,
            evtId: this.row.id,
            applyReason: this.valHT
          }).then((res: any) => {
            this.loadingHT = false
            this.$base.win.msgJson(res)
          }).catch(() => {
            this.loadingHT = false
          })
        } else {
          this.loadingHT = false
        }
      })
      this.dialogHT.visible = false
      this.valHT = ''
    }
    
    private handleSQ(){
      this.dialogSQ = {
        title: this.row.evtCodeStr + '[申请]',
        visible: true,
        data: this.row
      }
    }
    private handleDB(){
      this.dialogDB = {
        title: this.row.evtCodeStr + '[对比]',
        visible: true,
        data: this.row
      }
    }
    private handleFlow(){
      this.dialogFlow = {
        title: this.row.evtCodeStr + '[流程]',
        visible: true,
        data: {id: this.row.id}
      }
    }
    private handleEdit(){
      this.dialogEdit = {
        title: this.row.evtCodeStr + '[修改]',
        visible: true,
        data: {id: this.row.id,type: 'modify'}
      }
    }
    private parentLoad(flag:boolean){
      this.$emit('reLoad',flag)
    }
    private handleCL(){
      this.$base.win.confirm('确定此操作？').then(() => {
        this.$http.post('evt/event/markProcess',{
          handleStatus: this.row.statusList.findIndex((node) => {
            return node.key === 'CHU_LI'
          }) > -1 ? 1 : 2,
          id: this.row.id
        }).then((res:any) => {
          if (res.code === 200){
            this.parentLoad(false)
          }
          this.$base.win.msgJson(res)
        })
      })
    }
    private handleJS(){
      this.$base.win.confirm('确定此操作？').then(() => {
        this.$http.post(this.row.islock === 2 ? 'evt/lockEvent/unlockEvent' : 'evt/lockEvent/lockEvent',{
          id: this.row.id
        }).then((res:any) => {
          if (res.code === 200){
            this.parentLoad(false)
          }
          this.$base.win.msgJson(res)
        })
      })
    }
}
</script>
 
<style lang="scss" scoped>
  .right{
    padding: 12px 10px;
    overflow: hidden;
    .auto{
      height: 100%;
    }
    .el-button{
      margin: 5px;
    }
    .title{
      border-bottom: 1px #C0C0C0 solid;
      height:34px;
      line-height: 34px;
      font-size: 15px;
      color: #333333;
    }
    .body{
      padding: 0px 5px;
      height:calc(100% - 93px);
      overflow: auto;
      .form{
        padding: 5px 0;
        ul{
          li{
            line-height: 30px;
            display: flex;
            span,label
            {
              display: inline-block;
            }
            label{
              margin-right: 5px;
              color: #666666;
              width: 75px;
            }
            span{
              color: #333333;
              white-space:nowrap;
              text-overflow: ellipsis;
              width:calc(100% - 75px);
              overflow: hidden;
              height:33px;
              .str{
                width:100%;
              }
            }
          }
        }
      }
    }
  }
</style>
