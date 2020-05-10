<template>
  <div class="form">
    <div class="save">
      <el-divider
        content-position="left"
        class="title"
      >
        案件办理
      </el-divider>
      <table
        class="kd-table table"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <colgroup>
          <col style="width:18%;">
          <col style="width:82%;">
        </colgroup>
        <tbody>
          <tr>
            <th>当前环节：</th>
            <td>{{ row.curTacheName }} </td>
          </tr>
          <tr>
            <th>已用时间：</th>
            <td>{{ row.usedTimeStr }}</td>
          </tr>
          <tr>
            <th>上一环节：</th>
            <td>（{{ row.lastTacheNmae }}） </td>
          </tr>
          <tr>
            <th>办理意见：</th>
            <td>{{ row.lastHandleIdea }} </td>
          </tr>
          <tr v-if="mbFlow!=null">
            <th>目标环节：</th>
            <td>
              <el-radio-group
                v-model="form.nextTache"
                @change="handleNextFlow"
              >
                <el-radio
                  :label="mbFlow.activityId"
                >
                  {{ mbFlow.activityName }}
                </el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <th>调度环节：</th>
            <td>
              <el-radio-group
                v-model="form.nextTache"
                @change="handleNextFlow"
              >
                <el-radio
                  v-for="(item,key) in ddFlow"
                  :key="key"
                  :label="item.activityId"
                >
                  {{ item.activityName }}
                </el-radio>
              </el-radio-group>
            </td>
          </tr>
          <tr>
            <th>接收对象：</th>
            <td>
              <el-select
                v-model="form.receiveRole"
                class="select"
              >
                <el-option
                  v-for="(item,key) in nextFlow"
                  :key="key"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
            </td>
          </tr>
          <tr v-if="form.nextTacheStr === 'Pai_Qian'">
            <th>处理时限</th>
            <td>
              <el-select
                v-model="form.disposeType"
                class="select"
              >
                <el-option
                  v-for="(item,key) in sxFlow"
                  :key="key"
                  :value="item.disposeType"
                  :label="item.disposeTimeStr"
                />
              </el-select>
            </td>
          </tr>
        </tbody>
      </table>
      <el-divider
        content-position="left"
        class="title"
      >
        附件上传
      </el-divider>
      <div class="fileparent">
        <ke-files
          :data="form.files"
          tip="只允许上传图片和录音文件，小于900KB"
          class="files"
          :size="900"
          :ids.sync="form.eventAnnexeArray"
          :accept="['.jpg','.png','.jpeg','.gif','.mp3']"
        />
      </div>
      <el-divider
        content-position="left"
        class="title"
      >
        办理意见
      </el-divider>
      <ke-commonly
        ref="handleIdea"
        v-model="form.handleIdea"
        :params="handleIdeaObj"
        class="commonly"
      />
    </div>
    <div
      class="ke-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取 消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit()"
      >
        <svg-icon name="save" />确 定
      </el-button>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
@Component({
  components: {
    keCommonly: () => import('@/components/keCommonly.vue')
  }
})
export default class extends Vue {
  @Prop({default: { tacheList: [] }})private row:any
  private loading:boolean = false
  private form:any={
    handleIdea: '',
    eventAnnexeArray: []
  }
  private mbFlow:any=null
  private ddFlow:Array<any>=[]
  private nextFlow:Array<any>=[]
  private sxFlow:Array<any>=[]
  private handleIdeaObj:any={}
  handleCancel() {
    this.$emit('close')
  }
  handleSubmit(){
    this.form.curTache = this.row.workTache
    this.form.evtId = this.row.id
    this.form.eventAnnexeIds = this.form.eventAnnexeArray.join(',')
    if (this.form.handleIdea.trim().length === 0){
      (this.$refs.handleIdea as any).handleFocus()
      this.$base.win.msg('请输入办理意见！')
      return
    }
    this.$http.post('evt/event/processEvent',this.form)
      .then((res) => {
        if (res.code === 200){
          this.$emit('close')
        }
        this.$base.win.msgJson(res)
      })
  }

  private handleNextFlow(value:string){

    const url = 'evt/eventQuery/findEventReceiveRole'
    this.form.evtId = this.row.id
    this.form.nextTacheStr = this.form.nextTache
    this.handleIdeaObj = {
      flowId: this.row.workFlowId,
      type: 2,
      eworkFlowTache: this.form.nextTache,
      sworkFlowTache: this.row.workTache
    }
    this.$http.post(url,this.form).then((res:any) => {
      this.nextFlow = res.rows
    })
    if (this.form.nextTacheStr === 'Pai_Qian'){
      this.$http.post('evt/classSetting/findClassDisposeByEvtId',{id: this.row.id}).then((res:any) => {
        this.sxFlow = res.rows
      })
    }
  }
  @Watch('row')
  private onDialogVisibleChanged(): void {
    this.row.tacheList.forEach((element,i) => {
      if (i === 0 && this.row.tacheList.length > 1){
        this.mbFlow = element
      } else {
        this.ddFlow.push(element)
      }
    })
  }
}
</script>
 
<style lang="scss" scoped>
  .form{
    height:100%;
    position: relative;
    overflow: hidden;
    .ke-dialog-footer{
      height: 56px;
      line-height: 56px;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background: #fff;
       border-top:1px solid  #D3D3D3 ;
    }
  .save{
    padding: 10px 20px 0 20px;
    overflow: auto;
    height:calc(510px - 60px);
    .commonly{
      margin-bottom: 20px;
    }
    .files{
      background: #fff;
      padding: 20px;
      border:1px solid  #D3D3D3 ;
      overflow: auto;
      max-height: 192px;
    }
    table{
      border-color:  #e5e5e5;
      tr{
         border-color:  #e5e5e5;
      }
      th{
        background:  #ECECEC ;
      }
      td{
        background: #fff;
        .select,input{
          width: 50%!important;
        }
      }
    }
    .el-divider{
      margin: 25px 0 20px 0;
      > div{
        font-size: 16px;
        font-size: 600;
        background: #f5f5f5;
      }
    }
  }
  }
  @media (min-width: 1400px) { 
  .form{.save{
    height:calc(820px - 60px);
  }
  }
 }
</style>
