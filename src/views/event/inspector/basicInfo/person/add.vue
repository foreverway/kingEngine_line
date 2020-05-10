<!-- eslint-disable no-irregular-whitespace -->
<template>
  <el-dialog
    v-show="showMain"
    v-dialog-drag
    :title="dialog.title"
    :visible.sync="dialog.visible"
    class="main-container"
    width="900px"
  >
    <div class="basic-form">
      <div
        v-if="dialog.type !=='check'"
        v-loading="loading"
        class="basic"
      >
        <div style="height:430px">
          <el-scrollbar
            class="ke-scrollbar"
            style="height:100%"
          >
            <el-form
              ref="ruleForm"
              :model="formData"
              :rules="rules"
              label-width="95px"
            >
              <el-row>
                <el-col
                  class="col-container"
                  :span="6"
                >
                  <div class="photo-container">
                    <!-- <img> -->
                    <upload-avatar
                      :picture-id.sync="formData.avtarId"
                      :picture-url="avtar"
                      action="sys/file/fileUpload"
                      :limit="1"
                      :accept="['.jpg','.png']"
                      :styles="updateStyle"
                      tip="上传头像"
                    />
                  </div>
                </el-col>
                <el-col :span="18">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        label="姓　　名"
                        prop="userName"
                      >
                        <el-input
                          v-model="formData.userName"
                          placeholder="请输入姓名"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="工作编码"
                        prop="workerNo"
                      >
                        <el-input
                          v-model="formData.workerNo"
                          placeholder="请输入工作编码"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        label="入职时间"
                        prop="entryDate"
                      >
                        <el-date-picker
                          v-model="formData.entryDate"
                          :picker-options="pickerOptions"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择入职时间"
                          type="datetime"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="登 录 名"
                        prop="loginName"
                      >
                        <el-input
                          v-model="formData.loginName"
                          placeholder="请输入登录名"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        label="登录密码"
                        prop="loginPwd"
                      >
                        <el-input
                          v-model="formData.loginPwd"
                          placeholder="请输入登录密码"
                          type="password"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="联系方式"
                        prop="userMobile"
                      >
                        <el-input
                          v-model="formData.userMobile"
                          placeholder="请输入联系方式"
                          clearable
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <div class="fill-block" />
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="性　　别"
                    prop="sex"
                  >
                    <el-select
                      v-model="formData.sex"
                      placeholder="请选择性别"
                    >
                      <el-option
                        v-for="item in sexOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="身份证号"
                    prop="idno"
                  >
                    <el-input
                      v-model="formData.idno"
                      placeholder="请输入身份证号"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="政治面貌"
                    prop="politicalStatus"
                  >
                    <el-select
                      v-model="formData.politicalStatus"
                      placeholder="请选择政治面貌"
                    >
                      <el-option
                        v-for="item in politicsOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="籍　　贯"
                    prop="nativePlace"
                  >
                    <el-input
                      v-model="formData.nativePlace"
                      placeholder="请输入籍贯"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="学　　历"
                    prop="acadQual"
                  >
                    <ke-dict
                      v-model="formData.acadQual"
                      placeholder="请选择学历"
                      code="obs_acad_qual"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="人员类型"
                    prop="userType"
                  >
                    <ke-dict
                      v-model="formData.userType"
                      placeholder="请选择人员类型"
                      code="observer_type"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="P　D　A"
                    prop="pdaId"
                  >
                    <pda-selector
                      :pda-id.sync="formData.pdaId"
                      :disabled="disabled"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="排 序 号"
                    prop="orderNo"
                  >
                    <el-input
                      v-model="formData.orderNo"
                      placeholder="请输入排序号"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="工作网格"
                    prop="workCells"
                  >
                    <WorkGroupTree :value.sync="formData.workCells" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="通讯地址"
                    prop="address"
                  >
                    <el-input
                      v-model="formData.address"
                      placeholder="请输入通讯地址"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="部门"
                    prop="deptId"
                  >
                    <department-tree :value.sync="formData.deptId" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="专业特长"
                    prop="speciality"
                  >
                    <el-input
                      v-model="formData.speciality"
                      placeholder="请输入专业特长"
                      type="textarea"
                      :rows="2"
                      resize="none"
                      height="50px"
                      maxlength="250"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="兴趣爱好"
                    prop="hobby"
                  >
                    <el-input
                      v-model="formData.hobby"
                      placeholder="请输入兴趣爱好"
                      type="textarea"
                      :rows="2"
                      height="50px"
                      resize="none"
                      maxlength="250"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="曾获奖励"
                    prop="reward"
                  >
                    <el-input
                      v-model="formData.reward"
                      placeholder="请输入曾获奖励"
                      type="textarea"
                      :rows="2"
                      height="50px"
                      resize="none"
                      maxlength="250"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="备　　注"
                    prop="note"
                  >
                    <el-input
                      v-model="formData.note"
                      placeholder="请输入备注"
                      type="textarea"
                      :rows="2"
                      resize="none"
                      height="50px"
                      maxlength="250"
                      show-word-limit
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
      <div
        v-else
        ref="ruleForm"
      >
        <el-tabs v-model="currentTab">
          <el-tab-pane
            label="基本信息"
            name="first"
          >
            <div style="height:430px">
              <el-scrollbar
                class="ke-scrollbar"
                style="height:100%"
              >
                <el-row>
                  <el-col :span="18">
                    <el-row class="check-item">
                      <el-col :span="12">
                        <label>姓　　名：</label>
                        {{ checkData.obsName }}
                      </el-col>
                      <el-col :span="12">
                        <label>登　陆　名　：</label>
                        {{ checkData.loginName }}
                      </el-col>
                    </el-row>
                    <el-row class="check-item">
                      <el-col :span="12">
                        <label>城管通号：</label>
                        {{ checkData.pdaNum }}
                      </el-col>
                      <el-col :span="12">
                        <label>工　卡　号　：</label>
                        {{ checkData.workerNo }}
                      </el-col>
                    </el-row>
                    <el-row class="check-item">
                      <el-col :span="12">
                        <label>状　　态：</label>
                        {{ checkData.isOnline === 1?"在线":"离线" }}
                      </el-col>
                      <el-col :span="12">
                        <label> G P S 状态　：</label>
                        {{ checkData.gpsSignal === 1?"在线":"离线" }}
                      </el-col>
                    </el-row>
                    <el-row class="check-item">
                      <el-col :span="12">
                        <label>今日里程：</label>
                        {{ checkData.mileage }}km
                      </el-col>
                      <el-col :span="12">
                        <label>是否被评价　：</label>
                        {{ checkData.isEvaluate===1?"是":"否" }}
                      </el-col>
                    </el-row>
                    <el-row class="check-item">
                      <el-col :span="12">
                        <label>是否在职：</label>
                        {{ checkData.isOnjob===1?"在岗":"离职" }}
                      </el-col>
                      <el-col :span="12">
                        <label>最近在线时间：</label>
                        {{ checkData.gpsTime }}
                      </el-col>
                    </el-row>
                    <el-row class="check-item">
                      <el-col :span="12">
                        <label>工作网格：</label>
                        {{ checkData.gridName }}
                      </el-col>

                      <el-col :span="12">
                        <label>PDA在线时长：</label>
                        {{ checkData.pdaOnlineTime }}
                      </el-col>
                    </el-row>
                    <el-row class="check-item">
                      <el-col :span="12">
                        <label>手　　机：</label>
                        {{ checkData.mobile }}
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col
                    :span="6"
                    class="upload-container"
                  >
                    <div class="upload">
                      <img :src="checkData.avtar">
                    </div>
                  </el-col>
                </el-row>
                <div class="status-container">
                  今日工作情况：({{ checkData.gridCode?"已排版":"未排班" }})
                </div>
                <div class="status-form">
                  <el-table :data="countData">
                    <el-table-column
                      prop="reportNum"
                      label="上报数"
                      align="center"
                    />
                    <el-table-column
                      prop="validCollectionNum"
                      label="有效上报数"
                      align="center"
                    />

                    <el-table-column
                      prop="uncheckNum"
                      label="待核查"
                      align="center"
                    />
                    <el-table-column
                      prop="overTimeChecked"
                      label="超时核查"
                      align="center"
                    />
                    <el-table-column
                      prop="checked"
                      label="按时已核查"
                      align="center"
                    />
                    <el-table-column
                      prop="overTimeUncheck"
                      label="超时未核查"
                      align="center"
                    />
                    <el-table-column
                      prop="unverifyNum"
                      label="待核实"
                      align="center"
                    />
                    <el-table-column
                      prop="overTimeVerified"
                      label="超时核实"
                      align="center"
                    />
                    <el-table-column
                      prop="verified"
                      label="按时已核实"
                      align="center"
                    />
                    <el-table-column
                      prop="overTimeUnverified"
                      label="超时未核实"
                      align="center"
                    />
                  </el-table>
                  <!-- <el-form
                    label-width="200px"
                    label-position="left"
                  >
                    <el-row>
                      <el-col
                        :span="12"
                        class="col-item"
                      >
                        <div class="blue-dot" />
                        <el-form-item label="上报数">
                          <span class="value">{{checkData.reportNum}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col
                        :span="12"
                        class="col-item"
                      >
                        <div class="blue-dot" />
                        <el-form-item label="有效上报数">
                          <span class="value">{{checkData.validCollectionNum}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col
                        :span="12"
                        class="col-item"
                      >
                        <div class="blue-dot" />
                        <el-form-item label="核实/核查数">
                          <span class="value">{{checkData.validCollectionNum}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col
                        :span="12"
                        class="col-item"
                      >
                        <div class="blue-dot" />
                        <el-form-item label="待核实/核查数">
                          <span class="value">{{checkData.validCollectionNum}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col
                        :span="12"
                        class="col-item"
                      >
                        <div class="blue-dot" />
                        <el-form-item label="核查/核查超时数">
                          <span class="value">{{checkData.validCollectionNum}}</span>
                        </el-form-item>
                      </el-col>
                      <el-col
                        :span="12"
                        class="col-item"
                      >
                        <div class="blue-dot" />
                        <el-form-item label="核查/核查回退数">
                          <span class="value">{{checkData.validCollectionNum}}</span>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form> -->
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="消息通讯"
            name="second"
          >
            <el-form
              ref="messageForm"
              :model="message"
              :rules="messageRules"
            >
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="消息内容"
                    prop="content"
                  >
                    <el-input
                      v-model="message.content"
                      type="textarea"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label="消息形式"
                    prop="msgNum"
                  >
                    <el-radio-group v-model="message.msgNum">
                      <el-radio
                        :value="3"
                        :label="3"
                      >
                        通讯消息形式
                      </el-radio>
                      <el-radio
                        :value="4"
                        :label="4"
                      >
                        移动短信形式
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="opeate-buttons">
              <el-button @click="handleCancel">
                <svg-icon name="close" />关闭
              </el-button>
              <el-button
                type="primary"
                @click="handleMessageSubmit"
              >
                发送
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div
      v-if="dialog.type!='check'"
      class="opeate-buttons"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        <svg-icon name="save" />保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form as ElForm } from 'element-ui'
import md5 from 'js-md5'
import PdaSelector from '../../components/pdaSelector.vue'
@Component({
  name: 'TaskForm',
  components: {
    Basic: () => import('./basic.vue'),
    WorkGroupTree: () => import('../../components/workGroupTree.vue'),
    DepartmentTree: () => import('../../components/departmentTree.vue'),
    PdaSelector: () => import('../../components/pdaSelector.vue'),
    uploadAvatar: () => import('../../components/uploadAvatar.vue')
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private currentTab: string = 'first'
  private updateStyle = {
    // width: '160px',
    // height: '160px'
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
    // height: '100%'
  }
  private disabled: boolean = true
  private countData:Array<any> = []
  private pickerOptions= {
    // disabledDate(time) {
    //   return time.getTime() > Date.now()
    // },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date())
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }]
  }
  private formData: any = {
    deptId: '',
    userName: '',
    workerNo: '',
    entryDate: '',
    loginName: '',
    loginPwd: '',
    userMobile: '',
    avtarId: '',
    sex: '',
    idno: '',
    politicalStatus: '',
    nativePlace: '',
    acadQual: '',
    userType: '',
    pdaId: '',
    orderNo: '',
    workCells: '',
    address: '',
    speciality: '',
    hobby: '',
    reward: '',
    note: ''
  }
  // TODO: 消息类型code待完善
  private message: any= {
    content: '',
    msgNum: ''
  }
  private checkData:any = {
    obsName: '',
    loginName: '',
    pdaNum: '',
    workerNo: '',
    isOnline: '',
    gpsSignal: '',
    mileage: '',
    isEvaluate: '',
    isOnjob: '',
    gpsTime: '',
    gridName: '',
    pdaOnlineTime: '',
    mobile: ''
  }
  private sexOptions: any = [
    {
      label: '男',
      value: 1
    },
    {
      label: '女',
      value: 2
    }
  ]
  private politicsOptions: any = [
    {
      label: '共青团员',
      value: 1
    },
    {
      label: '党员',
      value: 2
    },
    {
      label: '其他',
      value: 3
    }
  ]
  private avtar: string = ''
  private passwordTemp: string = ''
  private showMain: Boolean = false
  private loading: boolean = true
  private flag = false
  private messageRules: Object = {
    content: [{
      required: true,message: '请输入消息',trigger: 'change'
    }],
    msgNum: [{
      required: true,message: '请选择消息类型',trigger: 'change'
    }]
  }
  private rules: object = {
    userName: [{ required: true,pattern: '[^ \x22]+', message: '请输入姓名', trigger: 'change' }],
    loginName: [{ required: true, pattern: '[^ \x22]+',message: '请输入登录名', trigger: 'change' }],
    loginPwd: [
      { required: true, pattern: '[^ \x22]+',message: '请输入登录密码', trigger: 'change' }
    ],
    deptId: [
      { required: true, message: '请选择部门', trigger: 'change' }
    ],
    pdaId: [
      { pattern: /^[0-9]*(.[0-9]+)?$/,message: '请输入数字' }
    ],
    orderNo: [
      { required: true, message: '请输入排序号', trigger: 'change' },
      { pattern: /^100$|^(\d|[1-9]\d)$/ , message: '请输入小于100的正整数', trigger: 'change' }
    ]
  }
  created() {
    setTimeout(() => {
      this.showMain = true
    },200)
    // console.log(this.basicData)
  }
  mounted(){
    if (this.dialog.type === 'edit'){
      this.initData()
    } else if (this.dialog.type === 'check'){
      this.initCheckData()
    } else {
      this.loading = false
    }
  }
  private initCheckData(){
    this.$http({
      url: '/obs/observer/queryObserverInfo',
      method: 'post',
      data: {
        id: this.dialog.item.id
      }
    }).then((res) => {
      this.checkData = res.data
      let obj = {
        reportNum: res.data.reportNum || 0,
        validCollectionNum: res.data.validCollectionNum || 0,
        uncheckNum: res.data.uncheckNum || 0,
        overTimeChecked: res.data.overTimeChecked || 0,
        checked: res.data.checked || 0,
        overTimeUncheck: res.data.overTimeUncheck || 0,
        unverifyNum: res.data.unverifyNum || 0,
        overTimeVerified: res.data.overTimeVerified || 0,
        verified: res.data.verified || 0,
        overTimeUnverified: res.data.overTimeUnverified || 0
      }
      this.countData.push(obj)
    })
  }
  private initData() {
    this.$http({
      url: '/obs/observer/getObserverDetail',
      method: 'post',
      data: {
        id: this.dialog.item.id
      }
    }).then((res) => {
      for (let i in this.formData){
        if (res.data[i]){
          this.formData[i] = res.data[i]
        }
      }
      if (res.data.auditStatus !== 1){
        this.disabled = false
      }
      if (res.data.workCellList){
        this.formData.workCells = []
        res.data.workCellList.forEach((item) => {
          this.formData.workCells.push(item.id)
        })
        this.formData.workCells = this.formData.workCells.join(',')
      }
      this.avtar = res.data.avtar
      this.passwordTemp = res.data.loginPwd
      this.formData.id = this.dialog.item.id
      this.formData.userId = this.dialog.item.userId

      this.$nextTick(() => {
        this.loading = false
      })
    })
  }
  private handleEdit(){
    this.submitForm().then((data) => {
      this.$http({
        url: '/obs/observer/updateObserver',
        method: 'post',
        data
      }).then((res) => {
        this.$base.win.msg('成功','success')
        let dialog = {
          visible: false
        }
        this.$emit('handleInit')
        this.$emit('update:dialog', dialog)
      })
    })
  }
  private handleSave() {
    this.submitForm().then((data) => {
      this.$http({
        url: '/obs/observer/addObserver',
        method: 'post',
        data
      }).then((res) => {
        this.$base.win.msg('成功','success')
        let dialog = {
          visible: false
        }
        this.$emit('handleReload')
        this.$emit('update:dialog', dialog)
      })
    })
  }
  private handleCancel(): void {
    let dialog = {
      title: '',
      visible: false
    }
    this.$emit('update:dialog', dialog)
  }
  private handleSubmit(){
    return this.dialog.item ? this.handleEdit() : this.handleSave()
  }
  private handleMessageSubmit(){
    let form = this.$refs.messageForm as ElForm
    this.message.obsIds = this.dialog.item.id
    this.message.msgType = 2
    form.validate(async(isValid) => {
      if (isValid){
        this.$http({
          url: '/obs/msg/addObserverMessage',
          method: 'post',
          data: this.message
        }).then(() => {
          this.$base.win.msg('发送成功','success')
          this.handleCancel()
          this.clearMessageForm()
        })
      } else {
        return false
      }
    })
  }
  private clearMessageForm(){
    for (let i in this.message){
      if (this.message[i]){
        this.message[i] = ''
      }
    }
  }
  private submitForm(): any {

    let res = new Promise((resolve, reject) => {
      let form = this.$refs.ruleForm as ElForm
      form.validate(async (valid: boolean) => {
        if (valid) {
          this.loading = true
          let data = this.$base.common.extend(this.formData)
          data.orderNo = Number(data.orderNo)
          data.pdaId = (data.pdaId === '' ? null : Number(data.pdaId))
          data.avtarId = (data.avtarId === '' ? null : Number(data.avtarId))
          if (this.dialog.type !== 'add'){
            if (this.formData.loginPwd !== this.passwordTemp){
              data.loginPwd = md5(data.loginPwd)
            }
          } else {
            data.loginPwd = md5(data.loginPwd)
          }
          resolve(data)
        } else {
          return false
        }
      })
    })
    return res
  }
}
</script>
<style scoped>

</style>
<style lang="scss" scoped>

.pane-item {
  height: 100%;
}

.opeate-buttons {
  padding-top:10px;
  text-align: right;
}
.tips {
  color: #ff4949;
}

.el-input-rank {
  width: 70px;
}
.no-margin {
  margin-bottom: 0px;
}
.mb10 {
  margin-bottom: 10px;
}
</style>
<style scoped>
.fill-block{
  width: 100%;
  height: 10px;
}
.basic >>> .el-form-item{
  display: flex;
  flex-flow: row;
}
.basic >>> .el-input__inner{
  padding-right: 15px!important;
}
.basic >>> .el-form-item__content {
  margin-left: 0px !important;
  flex-grow:1;
}
.basic >>> .el-textarea__inner {
  height: 75px;
}
.status-form>>>.el-form-item{
  margin-bottom: 0px!important;
}
</style>
<style lang="scss" scoped>
.status-container{
  height: 60px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  line-height: 60px;
  box-sizing: border-box;
  margin-top: 30px;
  margin-left: 15px;
  margin-bottom: 30px;
}
.photo-container{
  width: 160px;
  height: 100px;
  // background: #E5E5E5;
  margin-bottom: 10px;
  margin-top: 5px;
}
.col-container{
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}
.basic-form{
  overflow: auto;
  margin-bottom: 10px;
  .basic{
    padding-right: 15px;
  }
}
.col-item{
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-bottom: 15px;
  .blue-dot{
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #4DAEFF;
    margin-right: 10px;
    margin-bottom: 5px;

  }
  .value{
    color: #028CFF
  }
}
.check-item {
  margin-top: 20px;
  padding-left: 15px;
}
.upload-container {
  width: 160px;
  height:190px;
  margin-top: 30px;
  img {
    width: 160px;
    height:190px;
    object-fit: cover;
  }
}
.checkbox-container {
  height: 35px;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding-left: 35px;
}
.opeate-buttons {
  text-align: right;
}
.tips {
  color: #ff4949;
}
.el-input,
.el-select,
.el-cascader {
  width: 100%;
}
.check-table {
  margin-top: 15px;
}
// .el-tabs__content{
//   padding: 0 40px;
//   box-sizing: border-box;
//   height: 350px;
// }
</style>
