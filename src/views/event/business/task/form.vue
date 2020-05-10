<template>
  <el-dialog
    v-dialog-drag
    :title="dialog.title"
    width="850px"
    :visible.sync="dialog.visible"
  >
    <el-form
      ref="ruleForm"
      v-loading="loading"
      :model="form"
      :rules="rules"
      label-width="85px"
      class="ke-form"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="案件来源"
            prop="evtResource"
          >
            <ke-dict
              v-model="form.evtResource"
              code="evtSource"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="案件类别"
            prop="evtClassId"
          >
            <el-cascader
              v-model="form.evtClassId"
              :show-all-levels="false"
              :options="ajlxArray"
              :props="{value:'id',label:'text'}"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="案件等级"
            prop="evtLevel"
          >
            <ke-dict
              v-model="form.evtLevel"
              code="evtLevel"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="所属区域"
            prop="evtAreaId"
          >
            <ke-tree
              v-model="form.evtAreaId"
              @change="handleArea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item
            label="事发位置"
            prop="evtLocation"
          >
            <el-input
              v-model="form.evtLocation" 
              readonly
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-location"
                @click="handleMap"
              />
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="案件坐标"
            prop="point"
          >
            <el-input
              v-model="form.point"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="工作网格"
            prop="workGridCode"
          >
            <el-input
              v-model="form.workGridCodeStr"
              readonly 
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="单元网格"
            prop="cellGridCode"
          >
            <el-input
              v-model="form.cellGridCodeStr"
              readonly 
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="问题描述"
            prop="content"
          >
            <el-input
              v-model="form.content"
              type="textarea"
              maxlength="200"
              show-word-limit=""
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="接收角色"
            prop="receiveRole"
          >
            <el-select v-model="form.receiveRole">
              <el-option
                v-for="(item,key) in jsjsArray"
                :key="key"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="举报人"
            prop="reporterName"
          >
            <el-input v-model="form.reporterName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="举报时间"
            prop="reportTime"
          >
            <el-date-picker
              v-model="form.reportTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="需要回复"
            prop="needReply"
          >
            <el-switch v-model="form.needReply" />
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-table
            class="table"
            :data="form.replyParam"
            width="100%"
          >
            <el-table-column
              type="index"
              width="40"
            />
            <el-table-column
              prop="replyUserName"
              width="130"
              label="被回复人姓名"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.replyUserName" />
              </template>
            </el-table-column>
            <el-table-column
              prop="replyMode"
              width="100"
              label="回复方式"
            >
              <template slot-scope="scope">
                <ke-dict
                  v-model="scope.row.replyMode"
                  code="evtReply"
                  type="select"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="replyPho"
              width="160"
              label="回复号码"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.replyPho" />
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
            >
              <template
                slot="header"
              >
                <label
                  class="add"
                  @click="handlAddReply"
                ><i
                  class="el-icon-circle-plus-outline"
                /> 新增</label>
              </template>
              <template slot-scope="scope">
                <el-button
                  type="default"
                  icon="el-icon-delete"
                  @click="handlRemoveReply(scope.$index)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="附件上传"
          >
            <ke-files
              :data="form.annexeBeforeList"
              :ids.sync="form.evtAnnexeBeforeIds"
              :style="{height:'160px'}"
              tip="允许上传图片、录音文件"
              :accept="['.jpg','.png','.jpeg','.gif','.mp3']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
            label="备注"
            prop="note"
          >
            <el-input
              v-model="form.note"
              type="textarea"
              maxlength="200"
              show-word-limit=""
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div
      slot="footer"
      class="ke-dialog-footer"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取 消
      </el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSubmit('ruleForm')"
      >
        <svg-icon name="save" />确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ElForm } from 'element-ui/types/form'

@Component
export default class extends Vue {
    @Prop() private dialog:any
    private loading:boolean=false
    private form:any={
      replyParam: [],
      annexeBeforeList: [],
      evtAnnexeBeforeIds: []
    }
  private rules:any={
    content: [
      { pattern: '[^ \x22]+', required: true,message: '问题描述不能为空' }
    ],
    evtAreaId: [
      { required: true,message: '所属区域不能为空' }
    ],
    evtClassId: [
      { required: true,message: '案件类型不能为空' }
    ],
    evtLevel: [
      { required: true,message: '案件等级不能为空' }
    ],
    evtLocation: [
      { required: true,message: '案发位置不能为空' }
    ],
    evtResource: [
      { required: true,message: '案件来源不能为空' }
    ],
    receiveRole: [
      { required: true,message: '接收角色不能为空' }
    ],
    workGridCode: [
      { required: true,message: '工作网格不能为空' }
    ],
    cellGridCode: [
      { required: true,message: '工作网格不能为空' }
    ],
    point: [
      { required: true,message: '坐标不能为空' }
    ]
  }
  private jsjsArray:Array<any>=[]
  private ajlxArray:Array<any>=[]
  private dialogMap: any = {
    title: '位置选择',
    visible: false
  }
  created() {
    // this.form.files = [{url: '/keumserver/upload.doc',name: 'xxx.doc'}]
    this.load()
  }
  setRole(){
    this.$http.post('evt/eventQuery/findEventReceiveRole',{
      nextTacheStr: 'InitialState',
      areaId: this.form.evtAreaId
    }).then((res: any) => {
      this.jsjsArray = res.rows
    })
  }
  private load(): void {
    this.$http.post('evt/class/findEventClassTree',{
      nextTacheStr: 'InitialState'
    }).then((res: any) => {
      this.ajlxArray = res.data
    })
    if (this.dialog.data && this.dialog.data.id){
      if (this.dialog.data.type === 'modify'){
        this.loading = true
        this.$http.post('evt/event/getToDoEventDetails',{
          id: this.dialog.data.id
        }).then((res: any) => {
          this.loading = false
          this.form = res.data
          this.setRole()
          if (this.form.longitude){
            this.form.point = this.form.longitude + ',' + this.form.latitude
          }
          this.form.needReply = this.form.needReply === 1
          this.form.annexeBeforeList = this.form.annexeBeforeList.map((item) => {
            return { name: item.fileName,url: item.filePath,id: item.id } 
          })
        })
      }
    }
  }
  private handleSubmit(formName:string) {
    this.loading = true
    let form = (this.$refs.ruleForm as ElForm)
    form.validate((valid) => {
      if (valid) {
        if (this.form.evtClassId && Array.isArray(this.form.evtClassId)){
          this.form.evtClassId = this.form.evtClassId[2]
        }
        this.form.needReply = this.form.needReply ? 1 : 0
        this.$http.post(this.dialog.data && this.dialog.data.type === 'modify' ? 'evt/event/editEvent' : 'evt/event/addEvent',this.form).then((res: any) => {
          if (res.code === 200){
            this.$emit('reLoad',this.dialog.type === 'create')
            if (this.dialog.type === 'create'){
              form.resetFields()
            } this.handleCancel()
          }
          this.loading = false
          this.$base.win.msgJson(res)
          
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.loading = false
      }
    })
  }
  private handleCancel(): void {
    this.$emit('update:dialog', {
      visible: false
    })
  }
   @Watch('form.needReply')
  onRouteChanged(to: any, from: any){
    if (to !== from && to === false){
      this.form.replyParam = []
    }
  }
   handleMap(){
     this.$set(this.form,'evtLocation','广东省深圳市南山区')
     this.form.point = '112.112131,10.22121'
     this.form.latitude = '112.112131'
     this.form.longitude = '10.22121'
     this.form.cellGridCodeStr = '1111'
     this.form.workGridCodeStr = '222'
     this.form.cellGridCode = '1'
     this.form.workGridCode = '2'
   }
   handlAddReply(){
     this.form.replyParam.push({})
     this.$set(this.form,'needReply',true)
   }
   handlRemoveReply(key:number){
     this.form.replyParam.splice(key,1)
   }
   handleArea(data:any){
     this.setRole()
   }
}
</script> 
<style lang="scss" scoped>
.ke-form{
  max-height: 80vh;
  overflow: auto;
  .el-table--border::after, .el-table--group::after, .el-table::before{
    background: none;
  }
  .add{
    color:#367de7;
    i{font-size:18px;top:2px;position: relative;}
  }
  .table{
    margin-bottom: 10px;
  }
}
</style>
