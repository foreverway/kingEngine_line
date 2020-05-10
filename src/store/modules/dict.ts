import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import request from '@/utils/request'
import store from '@/store'

export interface IDict {
  // 字典值
  dictValue: string
  // 字典名称
  dictName: string
  // 字典code
  dictCode: string
  // 层级
  dictLevel: number
  // 排序
  orderNo: number
  // 备注
  note: string
}

export interface IDictState {
  items: IDict[]
}

@Module({ dynamic: true, store, name: 'dict' })
class Dict extends VuexModule implements IDictState {
  items: any = []
  @Mutation
  private SET_DICT(dict: string) {
    this.items = dict
  }
  @Action({ commit: 'SET_DICT' })
  public async GET_DICT() {
    const response = await request.get('sys/dict/list', {
      params: {
        page: 1,
        rows: 1000000
      }
    })
    return response.rows
  }
  @Action
  public async GetItems(code: string) {
    if (this.items.length === 0) {
      await this.GET_DICT()
    }
    let result: IDict[] = []
    this.items.forEach((item: IDict) => {
      if (item.dictCode === code) {
        result.push(item)
      }
    })
    return result
  }

  @Action
  public GetItemByVal(items: IDict[], val: string): IDict {
    let result: IDict = {} as IDict
    items.forEach((item: IDict) => {
      if (item.dictValue === val) {
        result = item
      }
    })
    return result
  }

  @Action
  public async GetItemByCodeAndVal(code: string, val: string) {
    if (this.items.length === 0) {
      await this.GET_DICT()
    }
    let result: IDict = {} as IDict
    this.items.forEach((item: IDict) => {
      if (item.dictValue === val && item.dictCode === code) {
        result = item
      }
    })
    return result
  }
}

export const DictModule = getModule(Dict)
