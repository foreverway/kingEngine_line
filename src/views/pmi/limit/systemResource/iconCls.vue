<template>
  <el-dialog
    :title="dialog.title"
    :visible.sync="dialog.visible"
    width="600px"
    append-to-body
  >
    <ul>
      <li
        v-for="item in IconClsData"
        :key="item.iconName"
        @click="handleSelectIcon(item)"
      >
        <svg-icon :name="item.iconName" />
        <span>{{ item.iconName }}</span>
      </li>
    </ul>
  </el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  name: 'IconCls'
})
export default class extends Vue {
    private IconClsData:Array<any>=[
      { iconName: 'add' },
      { iconName: 'user' },
      { iconName: 'out' },
      { iconName: 'callPolice' },
      { iconName: 'senior' },
      { iconName: 'personalSettings' },
      { iconName: 'publicInformation' },
      { iconName: 'basicInformation' },
      { iconName: 'jurisdiction' },
      { iconName: 'dataDictionary' },
      { iconName: 'systemMonitoring' },
      { iconName: 'caseEnquiry' },
      { iconName: 'caseAcceptance' },
      { iconName: 'jobDiary' },
      { iconName: 'messageBoard' },
      { iconName: 'businessSettings' },
      { iconName: 'dutyManager' },
      { iconName: 'evaluationSettings' },
      { iconName: 'dataStatistics' },
      { iconName: 'evaluate' },
      { iconName: 'business1' },
      { iconName: 'instructions' },
      { iconName: 'SMStemplate' },
      { iconName: 'instructions1' },
      { iconName: 'publicEvaluation' },
      { iconName: 'callCenter' },
      { iconName: 'onDuty' },
      { iconName: 'workStatistics' },
      { iconName: 'basic' },
      { iconName: 'checkWorkAttendance' },
      { iconName: 'Scheduling' },
      { iconName: 'MessageCommunication' },
      { iconName: 'shortMessage' },
      { iconName: 'documentation' },
      { iconName: 'systemBulletin' },
      { iconName: 'preRegistration' },
      { iconName: 'intelligentAlarm' }
    ]
    @Prop({ type: Object, default: {} }) dialog !: object
    private handleSelectIcon(item:any) {
      this.$emit('selectIcon', item)
      this.$emit('update:dialog', {visible: false})
    }
}
</script>
<style lang="scss" scoped>
ul{
  // display: flex;
  flex-direction: row;
  max-height: 500px;
  overflow: auto;
  margin-top: 10px;
  li{
    cursor: pointer;
    margin: 10px 15px;
    display: inline-block;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;
    text-align: center;
    height: 100px;
    vertical-align: middle;
    svg{
      width:38px;
      height:38px;
    }
    span{
      margin-top: 7px;
      font-size: 18px;
      display: block;
    }
  }
}
</style>
