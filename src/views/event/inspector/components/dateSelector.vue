<template>
  <el-dialog
    v-dialog-drag
    title="选择应用日期"
    :visible.sync="dialog.visible"
    class="date-container"
    width="900px"
    :append-to-body="true"
  >
    <div style="height:400px;">
      <el-scrollbar
        class="ke-scrollbar"
        style="height:100%"
      >
        <el-calendar
          v-if="showCalendar"
          v-model="currentDate"
        >
          <template
            slot="dateCell"
            slot-scope="{date,data}"
          >
            <div
              v-if="showSelection(data)"
              :ref="data.day.split('-').splice(1,2)"
              :class="{'item':true,'pass-date':isPassTime(data)}"
              @click.stop="handleSelect(data)"
            >
              {{ data.day.split('-').slice(1).join('-') }}
            </div>
            <div
              v-else
              class="item"
              @click.stop="fake()"
            />
          </template>
        </el-calendar>
      </el-scrollbar>
    </div>
    <div
      class="opeate-buttons"
    >
      <el-button @click="handleCancel">
        <svg-icon name="close" />取消
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
      >
        <svg-icon name="save" />保存
      </el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component({})
export default class DateSelector extends Vue {
@Prop({ default: '' }) value: any
@Prop() dialog: any
private showCalendar: boolean = false
private selections = {}
private currentDate: any = ''
created(){
  this.currentDate = new Date()
  this.initSelections()
}
mounted(){
  setTimeout(() => {
    if (this.value){
      this.value.forEach((item) => {
        this.handleSelect({day: item})
      })
    }
  },50)
}
private initSelections(){
  for (let i = 1; i < 32; i++){
    this.selections[i] = false
  }
  this.$nextTick(() => {
    this.showCalendar = true
  })
}
private clearSelections(){
  for (let i in this.$refs){
    if (this.$refs[i] && (this.$refs[i] as any).style){
      (this.$refs[i] as any).style.background = '#fff';
      (this.$refs[i] as any).style.color = '#606266'
    }
  }
}
@Watch('currentDate')
handleCurrentDateChange(newVal,oldVal){
  this.initSelections()
  this.clearSelections()
}
private showSelection(data){
  if (data.type === 'current-month'){
    return true
  }
  return false
}
private fake(){
  console.log('nothing happens')
}
private handleSelect(data){
  console.log('data',data.day)
  let currentTime = new Date(data.day).getTime()
  if (currentTime < (new Date().getTime())){
    this.$alert('已过期，无法进行排班管理', '提示', {
      confirmButtonText: '确定'
    })
    return
  }
  let key = Number(data.day.split('-').splice(2,1))
  this.selections[key] = !this.selections[key]
  if (this.selections[key]){
    (this.$refs[data.day.split('-').splice(1,2)] as any).style.background = '#409EFF';
    (this.$refs[data.day.split('-').splice(1,2)] as any).style.color = '#fff'
  } else {
    (this.$refs[data.day.split('-').splice(1,2)] as any).style.background = '#fff';
    (this.$refs[data.day.split('-').splice(1,2)] as any).style.color = '#606266'
  }
}
private isPassTime(data){
  let currentTime = new Date(data.day).getTime()
  if (currentTime < (new Date().getTime())){
    return true
  }
  return false

}
private handleCancel(){
  let dialog = {
    visible: false
  }
  this.$emit('update:dialog',dialog)
}
private handleSave(){
  let year = new Date().getFullYear()
  let month = this.currentDate.getMonth() + 1
  if (month < 10){
    month = '0' + month
  }
  let values:Array<string> = []
  for (let i in this.selections){
    if (this.selections[i]){
      if (Number(i) < 10){
        values.push(`${year}-${month}-0${i}`)
      } else {
        values.push(`${year}-${month}-${i}`)
      }
    }
  }
  this.$emit('update:value',values)
  this.handleCancel()
}
}
</script>
<style scoped>
.pass-date{
  background: #FFFACD  !important;
  color: #606266;
  cursor: not-allowed !important;
}
.el-calendar >>> .el-calendar-day{
  padding: 0 !important;
}
.el-calendar >>> .is-selected{
  background: #fff !important;
}
.el-calendar >>> .el-calendar__body{
  padding-bottom: 15px !important;
}
</style>
<style lang="scss" scoped>
  .item{
    width: 100%;
    height: 100%;
    padding: 8px;
  }
  .selected{
    background: #409EFF !important;
    color: #fff !important;
  }
  .opeate-buttons{
    text-align: right;
  }
</style>
