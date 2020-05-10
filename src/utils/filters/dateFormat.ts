/*
*  时间格式化
*  @param date 后台返回的时间
*  @param fmt 要转换的时间格式，如：yyyy-MM-dd HH:mm:ss
*  @param type 非必传，如果格式是4-14位时间 20190813170822，就需要传
* */
function dateFormatFilter(date: any, fmt: any, type?: any) {
  const dateStr = type ? date2GMT(date) : new Date(date)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (String(dateStr.getFullYear())).substr(4 - RegExp.$1.length))
  }
  let o: any = {
    'M+': dateStr.getMonth() + 1,
    'd+': dateStr.getDate(),
    'H+': dateStr.getHours(),
    'm+': dateStr.getMinutes(),
    's+': dateStr.getSeconds()
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      let str = String(o[k])
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length))
    }
  }
  return fmt
}

function date2GMT(value: any): any {
  if (value === null || value === 'null' || value === '' || value === undefined) {
    return null
  }
  let time = '/'
  value = String(value)
  if (value.length < 4){
    return null
  }
  if ( value.length === 8){ // 年月日
    time =
      value.substr(0,4) + '/' +
      value.substr(4,2) + '/' +
      value.substr(6,2)
  } else if ( value.length === 12){ // 年月日时分
    time =
      value.substr(0,4) + '/' +
      value.substr(4,2) + '/' +
      value.substr(6,2) + ' ' +
      value.substr(8,2) + ':' +
      value.substr(10,2) + ':'
  } else if ( value.length === 14){ // 年月日时分秒
    time =
      value.substr(0,4) + '/' +
      value.substr(4,2) + '/' +
      value.substr(6,2) + ' ' +
      value.substr(8,2) + ':' +
      value.substr(10,2) + ':' +
      value.substr(12,2)
  }
  return new Date(Date.parse(time))
}

export default dateFormatFilter
