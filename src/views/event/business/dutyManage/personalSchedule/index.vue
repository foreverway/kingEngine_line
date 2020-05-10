<template>
  <el-container class="ke-layout">
    <el-main class="ke-body">
      <el-container class="ke-layout-container">
        <el-header height="auto">
          <el-form
            class="ke-search"
            label-width="77px"
          >
            <!-- <el-row>
              <el-col :span="13">
                <el-form-item label="排班年月">
                  <el-row>
                    <el-col :span="8">
                      <el-date-picker
                        v-model="value"
                        type="month"
                        placeholder="选择排班年月"
                        @change="handleSearch"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row>
              <el-col :span="13">
                <el-form-item label="打印周期">
                  <el-row>
                    <el-col :span="8">
                      <el-select
                        v-model="print.type"
                        @change="handleTypeClick"
                      >
                        <el-option
                          label="本周"
                          value="meWeek"
                        />
                        <el-option
                          label="下周"
                          value="nextWeek"
                        />
                        <el-option
                          label="本月"
                          value="meMonth"
                        />
                        <el-option
                          label="下月"
                          value="nextMonth"
                        />
                      </el-select>
                    </el-col>
                    <el-col
                      :span="16"
                      class="buttons"
                    >
                      <el-date-picker
                        v-model="print.date"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col
                :span="8"
                class="buttons"
              >
                <el-button
                  class="button"
                  type="primary"
                  icon="el-icon-printer"
                  @click="printTable"
                >
                  打印值班表
                </el-button>
                <el-button
                  class="button"
                  type="warning"
                  @click="handleReset"
                >
                  <svg-icon name="reset" />重置
                </el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main>
          <el-calendar
            v-model="value"
            class="g_p_b_date"
          >
            <template
              slot="dateCell"
              slot-scope="{date, data}"
            >
              <div
                v-if="dayDatas[data.day]"
                class="col"
                @click.stop
              >
                <p>{{ data.day.split('-').slice(1).join('-') }}</p>
                <div
                  v-for="(item,key) in dayDatas[data.day]"
                  :key="key"
                  class="content"
                  @dblclick.stop="handleOpen(data.day,item.opWorkNoId,key)"
                >
                  <div class="title">
                    <label>{{ item.opWorkNoName }}</label>
                  </div>
                  <div
                    :id="'col-'+data.day+'-'+key"
                    class="body"
                  >
                    {{ item.opScheduleNames }}
                  </div>
                </div>
              </div>
              <div
                v-else
                class="col none"
                @click.stop
              >
                <p @click.stop>
                  {{ data.day.split('-').slice(1).join('-') }}
                </p>
              </div>
            </template>
          </el-calendar>
        </el-main>
      </el-container>
    </el-main>
    <open-coll
      v-if="dialog.visible"
      :dialog.sync="dialog"
      @setItem="setItem"
    />

    <el-dialog
      title="过期提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>已过期，不能进行排班管理 !</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <printDate
      v-if="printDialog.visible"
      :dialog.sync="printDialog"
      :print-date="print"
      :day-datas="propDayDatas"
    />
  </el-container>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({
  name: 'personalSchedule',
  components: {
    OpenColl: () => import('./collections.vue'),
    printDate: () => import('./component/printDate.vue')
  }
})
export default class extends Vue {
  private listLoading: boolean = true
   private print:any={
     date: []
   }
  private dayDatas:any={}
  private propDayDatas:any={}
  private dialog: any = {
    visible: false,
    title: '添加工作人员'
  }
  private dialogVisible:boolean=false
  private printDialog:any={
    visible: false
  }
  private value:any = new Date()
  created(){
    this.load()
    this.print.type = 'meWeek'
    this.quickSelDate('meWeek')
  }
  private async load(){
    let selYear = this.value.getFullYear()
    let selMonth = this.value.getMonth() + 1
    
    await this.$http.request({
      url: '/evt/operatorWorkSchedule/findWorkScheduleListByDate',
      method: 'post',
      data: {
        selYear,
        selMonth
      }
    }).then((res:any) => {
      let obj: any = {}
      res.data.some((item) => {
        obj[item.workDate] = item.opWorkNoInfos
      })
      this.dayDatas = obj
    })
      
    this.$http.request({
      url: '/evt/opWorkNo/findAllOpWorkNo',
      method: 'post'
    
    }).then((res:any) => {
      this.dialog.classes = res.data
    })
  }
  private handleTypeClick(val:string){
    this.quickSelDate(val)
  }
  private handleReset(): void {
    this.print = {}
  }
  private handleOpen(key:string,id:number){
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let date = new Date().getDate()
    let currentDate = new Date(`${year}-${month < 10 ? '0' : ''}${month}-${date < 10 ? '0' : ''}${date}`).getTime()
    let clickDate = new Date(key).getTime()
    this.dialogVisible = currentDate > clickDate
    if (this.dialogVisible) {
      return false
    }  
    this.dialog.visible = true
    this.dialog.date = key
    this.dialog.id = id 
  }
  private setItem():void{
    this.load()
  }
  private printTable():void{
    if (!this.print.date){
      this.$confirm('请选择打印周期', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    } else {
      this.$http.request({
        url: '/evt/operatorWorkSchedule/printWorkScheduleByDate',
        method: 'post',
        data: {
          printStartDate: this.print.date[0],
          printEndDate: this.print.date[1]
        } 
      }).then((res:any) => {
        let obj: any = {}
        res.data.some((item) => {
          obj[item.workDate] = item.opWorkNoInfos
        })
        this.propDayDatas = obj
        this.printDialog.visible = true
      })
 
    }
 
  }
   @Watch('value')
  private onFormXjPiceChanged(newVal:Array<any>,oleVal:Array<any>): void {
    this.load()
  }
   quickSelDate(type:string){
     let begintime,endtime
     let oneminute = 60 * 1000
     let onehour = 60 * oneminute
     let oneday = 24 * onehour
     let oneweek = 7 * oneday
    
     let todayDate = new Date()
     let date = todayDate.getDate()
     let month = todayDate.getMonth() + 1
     let year = todayDate.getFullYear()
     let day = todayDate.getDay()

     // 本周
     if (type === 'meWeek'){
       let daytoMon = day - 1
       if (day === 0) {
         daytoMon = 6 
       }
        
       todayDate.setTime(todayDate.getTime() - daytoMon * oneday)
       date = todayDate.getDate()
       month = todayDate.getMonth() + 1
       year = todayDate.getFullYear()
       day = todayDate.getDay()
       begintime = `${year.toString()}-${this.fillstring(month.toString())}-${this.fillstring(date.toString())}`
       todayDate.setTime(todayDate.getTime() + 6 * oneday)
       date = todayDate.getDate()
       month = todayDate.getMonth() + 1
       year = todayDate.getFullYear()
       endtime = `${year.toString()}-${this.fillstring(month.toString())}-${this.fillstring(date.toString())}`
     } else if (type === 'nextWeek'){
       let daytoMon = 6 - day + 1 + 1
       if (day === 0) {
         daytoMon = 1 
       } 
       todayDate.setTime(todayDate.getTime() + daytoMon * oneday)
       date = todayDate.getDate()
       month = todayDate.getMonth() + 1
       year = todayDate.getFullYear()
       day = todayDate.getDay()
      
       begintime = `${year.toString()}-${this.fillstring(month.toString())}-${this.fillstring(date.toString())}`
      
       todayDate.setTime(todayDate.getTime() + 6 * oneday)
      
       date = todayDate.getDate()
       month = todayDate.getMonth() + 1
       year = todayDate.getFullYear()
      
       endtime = `${year.toString()}-${this.fillstring(month.toString())}-${this.fillstring(date.toString())}`
     } else if (type === 'meMonth'){
       let dateto1 = date - 1
      
       todayDate.setTime(todayDate.getTime() - dateto1 * oneday)
       date = todayDate.getDate()
       month = todayDate.getMonth() + 1
       year = todayDate.getFullYear()
       day = todayDate.getDay()
      
       begintime = `${year.toString()}-${this.fillstring(month.toString())}-${this.fillstring(date.toString())}`
      
       todayDate.setMonth(month)
       todayDate.setTime(todayDate.getTime() - oneday)
      
       date = todayDate.getDate()
       month = todayDate.getMonth() + 1
       year = todayDate.getFullYear()
      
       endtime = `${year.toString()}-${this.fillstring(month.toString())}-${this.fillstring(date.toString())}`
     } else if (type === 'nextMonth'){
       let dateto1 = date - 1
      
       todayDate.setTime(todayDate.getTime() - dateto1 * oneday)
       date = todayDate.getDate()
       month = todayDate.getMonth() + 2
       year = todayDate.getFullYear()
       day = todayDate.getDay()
      
       begintime = `${year.toString()}-${this.fillstring(month.toString())}-${this.fillstring(date.toString())}`
      
       todayDate.setMonth(month)
       todayDate.setTime(todayDate.getTime() - oneday)
      
       date = todayDate.getDate()
       month = todayDate.getMonth() + 1
       year = todayDate.getFullYear()
      
       endtime = `${year.toString()}-${this.fillstring(month.toString())}-${this.fillstring(date.toString())}`
     }
     this.print.date = [begintime,endtime]
   }
   private fillstring(str:any){
     if (str.length === 1){
       str = '0' + str 
     }
     return (str)
   }
}
</script>
<style lang="scss">
.g_p_b_date{
  .el-calendar-day{
    padding: 0;
  }
  .el-calendar-day{
    height:auto;
  }
  table{
    thead{
      background: #f3f3f3;
    }
      td.prev,td.next{
        pointer-events: none;
      }
  }
 
}
</style>
<style lang="scss" scoped>
.col{
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 132px;
  &.none{
    height:auto;
  }
  p{
    padding: 7px 0px;
    text-align: center;
    color:#333;
    font-weight: 600;
    display: inline-block;
  }
  .content:nth-child(2){
    background: #ffedb2;
    div{
      color:#E5A434;
    }
  }
  .content:nth-child(3){
    background: #b3dcff;
    div{
      color:#028CFF;
    }
  }
  .content:nth-child(4){
    background: #f4d6ff;
    div{
      color:#DA76FF;
    }
  }
  .content{
    display: flex;
    height:50px;
    .title{
      width:30px;
      text-align:center;
      display: flex;
      align-items: center;
      justify-content: center;
      color:#666;
      label{
        display: inline-block;
        width: 20px;
      }
    }
    .body{
      height:100%;
      overflow: auto;
      line-height: 22px;
      padding: 5px;
    }
  }
}
.pl0{
  padding-left: 0!important;
}
.ke-search{
  // display: none;
}
</style>
