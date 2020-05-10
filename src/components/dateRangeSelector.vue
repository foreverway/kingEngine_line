<template>
  <div class="dateRangeSelector">
    <label :style="'width:'+labelWidth">{{ startLabel }}</label>
    <el-date-picker
      v-model="start"
      :picker-options="pickerOptions"
      placeholder="请选择开始时间"
      :value-format="format"
      :type="type"
      @change="handleChange"
    />
    <label :style="'width:'+labelWidth">
      {{ endLabel }}
    </label>
    <el-date-picker
      v-model="end"
      :picker-options="pickerOptions"
      placeholder="请选择结束时间"
      :value-format="format"
      :type="type"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
let lock: boolean = false
@Component({})
export default class DateRangeSelector extends Vue {
  @Prop({ default: '开始时间' }) startLabel!: string
  @Prop({ default: '结束时间' }) endLabel!: string
  @Prop({ default: '' }) startValue: any
  @Prop({ default: '' }) endValue: any
  @Prop({ default: 'yyyy-MM-dd HH:mm:ss' }) format!: string
  @Prop({ default: 'datetime' }) type!: string
  @Prop({ default: '85px' }) labelWidth!: any
  private start:string = ''
  private end:string = ''

  private pickerOptions= {
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

  mounted(){
    this.start = this.startValue || ''
    this.end = this.endValue || ''
  }

  private handleChange(){
    if (!this.end || lock){
      return
    }
    const start = new Date(this.start).getTime()
    const end = new Date(this.end).getTime()
    if (start > end){
      lock = true
      const temp = this.end
      this.end = this.start
      this.start = temp
      this.$nextTick(() => {
        lock = false
      })
    }
    this.$emit('update:startValue',this.start)
    this.$emit('update:endValue',this.end)
  }
}
</script>

<style lang="scss">
.dateRangeSelector{
  display: flex;
  flex-flow: row;
  align-items: center;
  color: #606266;
  label {
    padding: 0 10px;
    flex-shrink: 0;
  }
}
</style>
