import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserId, getUserId, removeUserId } from '@/utils/cookies'
import store from '@/store'
import IMenu from '../../interface/menu'
import md5 from 'js-md5'
import { Message } from 'element-ui'
import { AppModule } from './app'

export interface IUserState {
  token: string
  // 用户名
  name: string
  avatar: string
  introduction: string
  roles: string[]
  page: number
  userId: number
  menus: IMenu[]
  thisMenu: IMenu | undefined
  countRow:number // 删除后是否后退一页，解决无记录的问题
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public menus: IMenu[] = []
  public thisMenu: IMenu | undefined
  public page: number = 10
  public userId: number = getUserId()
  public countRow:number = -1
  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }
  @Mutation
  private SET_USERID(userId: number) {
    this.userId = Number(userId)
  }
  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }
  @Mutation
  private SET_MENUS(menus: IMenu[]) {
    this.menus = menus
  }
  @Mutation
  private SET_PAGE(page: number) {
    this.page = page
  }
  @Mutation
  public SET_COUNTROW(count: number) {
    this.countRow = count
  }
  @Action
  public async Login(userInfo:any) {
    const res = await login({param1: userInfo.param1,param2: md5(md5(userInfo.param2) + 'kingdom'),param3: 1}).catch((e:any) => {
      Message({
        message: '后台返回错误，请重试',
        type: 'error',
        duration: 5 * 1000
      })
    })
    if (res){
      if (res.code === 200){
        setToken(res.data.jwt)
        setUserId(res.data.userId)
        this.SET_TOKEN(res.data.jwt)   
        this.SET_USERID(res.data.userId)
        this.SET_NAME(res.data.userName)
        return res
      }
      userInfo.param2 = ''
      return null
    }
  }
  @Action
  public SetThisMenu(menu: IMenu | undefined) {
    this.thisMenu = menu
  }
  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    const res = await getUserInfo(this.userId)
    if (res.code !== 200) {
      throw Error('Verification failed, please Login again.')
    }

    if (!res.data.id) {
      throw Error('GetUserInfo: roles must be a non-null array!')
    }
    this.SET_NAME(res.data.userName)
  }
  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    AppModule.REMOVE_MENUS()
    removeToken()
    removeUserId()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
