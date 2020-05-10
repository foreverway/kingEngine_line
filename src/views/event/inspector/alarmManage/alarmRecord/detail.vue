<template>
  <el-dialog
    v-dialog-drag
    title="详情"
    :visible.sync="dialog.visible"
    width="600px"
  >
    <el-row>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>报警类型</label>
        <span>{{ formData.alarmId | alarmFilter(alarmList) }}</span>
        <!-- <el-input
          v-model="formData.alarmId"
          :disabled="true"
        /> -->
      </el-col>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>阅读状态</label>
        {{ formData.readStatus === 1?"已读":"未读" }}
      </el-col>
    </el-row>
    <el-row>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>发送人</label>
        <span>{{ formData.senderName }}</span>
        <!-- <el-input
          v-model="formData.senderName"
          :disabled="true"
        /> -->
      </el-col>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>接收人</label>
        <span>{{ formData.receiverName }}</span>
        <!-- <el-input
          v-model="formData.receiverName"
          :disabled="true"
        /> -->
      </el-col>
    </el-row>
    <el-row>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>报警时间</label>
        {{ formData.sendTime }}
      </el-col>
      <el-col
        class="search-item"
        :span="12"
      >
        <label>发送状态</label>
        <span>{{ formData.sendStatus }}</span>
        <!-- <el-input
          v-model="formData.sendStatus"
          :disabled="true"
        /> -->
      </el-col>
    </el-row>
    <el-row>
      <el-col
        class="search-item"
        :span="24"
      >
        <label>报警内容</label>
        {{ formData.content }}
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'detail',
  components: {

  },
  filters: {
    alarmFilter: function(value,list:Array<any>){
      for (let i of list){
        if (i.id === value){
          return i.alarmName
        }
      }
      return ''
    }
  }
})
export default class extends Vue {
  @Prop({ type: Object, default: {} }) dialog!: any
  private alarmList: Array<any> = []
  private loading: boolean = true
  private formData: any = {}
  mounted(){
    this.handleGetTypeList()
    this.initData()
  }
  private handleGetTypeList(){
    this.$http({
      url: '/obs/alarm/findObsAlarmList',
      method: 'post'
    }).then((res) => {
      this.alarmList = res.data
    })
  }
  private initData(){
    this.loading = true
    this.$http({
      url: '/obs/alarm/getObsAlarmLogDetail',
      method: 'post',
      data: {
        id: this.dialog.item.id
      }
    }).then((res) => {
      this.formData = res.data
      this.formData.sendStatus = this.formData.sendStatus === 1 ? '已发送' : '未发送'
    })
  }
}
</script>

<style scoped>
.search-item {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-bottom: 15px;
  padding-right: 10px;
}
.search-item label {
  width: 95px;
  line-height: 35px;
}
</style>
