
let now = new Date() // 当前日期
let nowDayOfWeek = now.getDay() // 今天本周的第几天
let nowDay = now.getDate() // 当前日
let nowMonth = now.getMonth() // 当前月
let nowYear = now.getFullYear() // 当前年
// 格局化日期：yyyy-MM-dd
function formatDate(date) {
  let myyear = date.getFullYear()
  let mymonth = date.getMonth() + 1
  let myweekday = date.getDate()

  if (mymonth < 10){
    mymonth = '0' + mymonth
  }
  if (myweekday < 10){
    myweekday = '0' + myweekday
  }
  return (myyear + '-' + mymonth + '-' + myweekday)
}
// 获取一周开始时间
function getWeekStartDate() {

  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
  return formatDate(weekStartDate)
}
// 获取一周结束时间
function getWeekEndDate() {
  let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
  return formatDate(weekEndDate)
}
// JS获取当前周从星期一到星期天的日期
function getDates(date) {
  let currentDate = new Date(date)
  let timesStamp = currentDate.getTime()
  let currenDay = currentDate.getDay()
  let dates:any = []
  for (let i = 0; i < 7; i++) {
    dates.push(formatDate(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7))))
    // dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '-'))
  }
  return dates
}
// 判断是否为同一天
function isSameDay(timeStampA, timeStampB){
  let dateA = new Date(timeStampA)
  let dateB = new Date(timeStampB)
  return (dateA.setHours(0, 0, 0, 0) === dateB.setHours(0, 0, 0, 0))
}

// 计算时间跨度
function countDay(startDate,endDate){
  return new Date(endDate).getTime() - new Date(startDate).getTime()
}

export default {
  formatDate,
  getWeekStartDate,
  getWeekEndDate,
  getDates,
  isSameDay,
  countDay
}
