import ElementUI, { Table as ElTable } from 'element-ui'
import { MessageType } from 'element-ui/types/message'
import { VNode } from 'vue'
import { IUserState, UserModule } from '../store/modules/user'
import request from './request'
import IDict from '@/interface/dict'
import { DictModule } from '@/store/modules/dict'
// 弹框方法封装
interface Win {

   // interface（接口） 描述一个对象或函数

  /**
  * message自动关闭，参数同步UI框架，默认type不传为warning
  * @param message 提示内容
  * @param type 弹框类型同步UI框架
  */
  msg(message: string | VNode, type?: MessageType): void

  /**
   * 针对城管后台框架定制提示，方便调用，json为后台返回的结果集
   * @param json code为1返回success状态 反之error
   */
  msgJson(json: any): void

  /**
   * 弹出确定 取消框
   * @param message 提示内容
   * @param type 弹框类型同步UI框架
   * @param 弹框标题
   */
  confirm(message: string, title?: string, type?: MessageType): any
}
// 表格操作公用方法
interface Grid {

  /**
   * 表格删除时判断是否有选择项，没有则提示，有选择返回以逗号分隔返回ids和选中项array
   * @param rows 表格选中项Array<any>
   * @param message 提示是否删除文字
   * @param title 弹框标题
   */
  remove(rows: Array<any>, message?: string, title?: string): any

  /**
   * 表格多选时判断是否有选择项，没有则提示
   * @param rows 表格选中项Array<any>
   * @param message 未选择时提示
   */
  rows(rows: Array<any>, message?: string): any

  /**
   * 表格单选时判断是否有选择项或选择了多项，有则提示，只选择一项后返回单条记录
   * @param rows 表格选中项Array<any>
   * @param message 未选择时提示
   */
  row(rows: Array<any>, message?: string): any

  /**
   * 表格点击行时，要先清除选中状态，达到始终只选择一行的效果
   * @param table 当前表格对象
   * @param rows 当前表格数据源
   * @param row 当前表格点击行数据源
   * @param name 标识name 默认为flag，如和数据源列有冲突，请更换
   */
  rowClcik(table: any, rows: Array<any>, row: any, name?: string): void

  /**
   * 获取用户设置grid每页记录数
   * */
  page: number,
  /**
   *  判断当前删除数据后是否要退后一页
   *  解决无数据的问题
   * @param length 当前页表格记录数
   * @param search 查询参数集合
   */
  resizePage(params: any)
}
interface Dict {

  /**
   * 根据code获取某类数据字典 如性别
   * @param code 某类数据字典ocde 如sex
   */
  getItems(code: string): any

  /**
   * 根据value获取字典项 如从性别中获取value=11的字典项
   * @param dict 某类数据字典
   * @param val 字典值
   */
  dictByItem(dict: IDict[], val: string): any

  /**
   * 根据value获取字典项 如从性别中获取value=11的字典项
   * @param code 某类数据字典ocde 如sex
   * @param val 字典值
   */
  dictByCode(code: string, val: string): any
}
interface Common {

  /**
   * 深拷
   * @param source 需要深拷贝的数据
   */
  extend(source: any): any

  /**
   * 校验手机号
   * @param validatePhone 手机号
   */
  validatePhone(number: any): any

  /**
   * 校验数字，保留两位小数点
   * @param validateNumberFixTwo 手机号
   */
  validateNumberFixTwo(number: any): any

  /**
  * 表格刷新
  * @param self 所在作用域
  */
  reload(self: any): any

  /**
   * 表单重置
   * @param self 所在作用域
   */
  reset(self: any): any

  /**
   * 表单空格去除
   * @param self 所在作用域
   */
  trimParams(self: any): any
}
export class Base {

  /**
   * 获取登录用户信息（可根据业务系统需要添加）
   */
  getUser: IUserState = UserModule
  win: Win = {
    msg(message: string | VNode, type?: MessageType): void {
      ElementUI.Message({
        message: message,
        type: type || 'warning'
      })
    },
    msgJson(json: any): void {
      this.msg(json.msg, json.code === 200 ? 'success' : 'error')
    },
    confirm(message: string, title?: string, type?: MessageType): any {
      return ElementUI.MessageBox.confirm(message || '你确定此操作', title || '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type || 'warning'
      })
    }
  }
  grid: Grid = {
    remove(rows: Array<any>, message?: string, title?: string): any {
      let res = new Promise((resolve, reject) => {
        if (!rows || rows.length === 0) {
          const msg: string = '请至少选择一项删除'
          ElementUI.Message({ message: msg, type: 'error' })
          reject(msg)
        } else {
          ElementUI.MessageBox.confirm(message || '你确定删除这些项', title || '删除提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            UserModule.SET_COUNTROW(rows.length)
            resolve(rows.map((d) => {
              return d.id
            }).join(','))
          })
        }
      })
      return res
    },
    rows(rows: Array<any>, message?: string): any {
      let res = new Promise((resolve, reject) => {
        let msg: string = message || '请至少选择一项操作'
        if (!rows || rows.length === 0) {
          ElementUI.Message({ message: msg, type: 'error' })
          reject(msg)
        } else {
          resolve(rows)
        }
      })
      return res
    },
    row(rows: Array<any>, message?: string): any {
      let msg: string = ''
      let res = new Promise((resolve, reject) => {
        if (!rows || rows.length === 0) {
          msg = message || '请选择一项操作'
          ElementUI.Message({ message: msg, type: 'error' })
          reject(msg)
        } else if (rows.length > 1) {
          msg = message || '当前操作只能选择一项进行'
          ElementUI.Message({ message: msg, type: 'error' })
          reject(msg)
        } else {
          resolve(rows[0])
        }
      })
      return res
    },
    rowClcik(table: any, rows: Array<any>, row: any, name?: string): void {
      if (!rows || rows.length === 0 || !row) {
        return
      }
      let eltable = table as ElTable
      let iName: string = name || 'flag'
      eltable.clearSelection()
      rows.forEach((iRow: any) => {
        if (row !== iRow) {
          iRow[iName] = false
        }
      })
      if (!row[iName]) {
        row[iName] = true
      } else {
        row[iName] = !row[iName]
      }
      table.toggleRowSelection(row, row[iName])
    },
    page: UserModule.page,
    resizePage(params: any): void {
      const count = UserModule.countRow
      if (count !== -1 && params.len <= count && params.search.page > 1) {
        params.search.page -= 1
      }
      UserModule.SET_COUNTROW(-1)
      console.log(params.search.page)
    }
  }
  dict: Dict = {
    getItems(code: string) {
      return DictModule.GetItems(code)
    },
    dictByItem(dict: IDict[], val: string): any {
      let result: IDict = {} as IDict
      dict.forEach((item: IDict) => {
        if (item.dictValue === val) {
          result = item
        }
      })
      return result
    },
    async dictByCode(code: string, val: string) {
      let data: any = await DictModule.GetItems(code)
      let result: IDict = {} as IDict
      data.forEach((item: IDict) => {
        if (item.dictValue === val) {
          result = item
        }
      })
      return result
    }
  }
  common: Common = {
    extend(obj: any): any {
      //
      let result: any = Array.isArray(obj) ? [] : {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            const bese = new Base()
            result[key] = bese.common.extend(obj[key])
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    validatePhone(number: any): any {
      let re = /^1\d{10}$/
      let result = re.test(number)
      return result
    },
    validateNumberFixTwo(number: any): any {
      let re = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
      let result = re.test(number)
      return result
    },
    reload(self: any): any {
      if (self.params) {
        for (let i in self.params) {
          if (i === 'page') {
            self.params[i] = 1
          } else if (i === 'rows') {
            self.params[i] = self.$base.grid.page
          } else if (i === 'total') {
            self.params[i] = 0
          } else {
            self.params[i] = ''
          }
        }
      }
      self.initTableData()
    },
    trimParams(self: any): any {
      if (!self.params) {
        return
      }
      for (let i in self.params) {
        if (typeof self.params[i] === 'string') {
          self.params[i] = self.params[i].trim()
        }
      }
    },
    reset(self: any): any {
      if (self.params) {
        for (let i in self.params) {
          if (i === 'page') {
            continue
          } else if (i === 'rows') {
            self.params[i] = self.$base.grid.page
          } else {
            self.params[i] = ''
          }
        }
      }
    }
  }
}
const base = new Base()
export default base
