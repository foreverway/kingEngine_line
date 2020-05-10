// url 导出链接 self this
export default function exportXls(url:string,self: any){
  let baseURL: any = sessionStorage.getItem('baseURL')
  let flag = false
  url = baseURL + url + '?'
  if (self.selections && self.selections.length) {
    let ids: Array<any> = []
    self.selections.forEach((el) => {
      ids.push(el.id)
    })
    url += `ids=${ids.join(',')}`
    flag = true
  }
  if (self.params) {
    if (flag){
      url += '&'
    }
    for (let i in self.params){
      if (i === 'page' || i === 'rows'){
        continue
      }
      if (self.params[i] === ''){
        continue
      }
      url += `${i}=${self.params[i]}&`
    }
    url = url.substring(0,url.length - 1)
  }
  window.open(url,'_blank')
  self.$base.win.msg('导出成功', 'success')
}

