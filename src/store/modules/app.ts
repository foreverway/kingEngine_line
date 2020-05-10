import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'
import store from '@/store'
import request from '@/utils/request'
import {UserModule} from './user'

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface IAppState {
  device: DeviceType
  serverUrl: string
  menus:Array<any>
  select:any
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
  },
  double:boolean
}

@Module({ dynamic: true, store, name: 'app' })
class App extends VuexModule implements IAppState {
  public sidebar = {
    opened: getSidebarStatus() !== 'closed',
    withoutAnimation: false
  }
  public device = DeviceType.Desktop
  public serverUrl: string = ''
  public menus:Array<any> = []
  public select:any = JSON.parse(sessionStorage.getItem('g_select') || '{}')
  public double:boolean = sessionStorage.getItem('g_double') === 'true'
  @Mutation
  private TOGGLE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = !this.sidebar.opened
    this.sidebar.withoutAnimation = withoutAnimation
    if (this.sidebar.opened) {
      setSidebarStatus('opened')
    } else {
      setSidebarStatus('closed')
    }
  }

  @Mutation
  private CLOSE_SIDEBAR(withoutAnimation: boolean) {
    this.sidebar.opened = false
    this.sidebar.withoutAnimation = withoutAnimation
    setSidebarStatus('closed')
  }

  @Mutation
  private TOGGLE_DEVICE(device: DeviceType) {
    this.device = device
  }
  @Mutation
  private SET_SERVERURL(str: string) {
    this.serverUrl = str
  }
  @Mutation
  public SET_SELECT(obj:any) {
    sessionStorage.setItem('g_select',JSON.stringify(obj))
    this.select = obj
  }
  @Mutation
  public SET_MENUS(menus:Array<any>) {
    this.menus = menus
  }
  @Mutation
  public SET_DOUBLE(flag:boolean) {
    sessionStorage.setItem('g_double',String(flag))
    this.double = flag
  }
  @Mutation
  public REMOVE_MENUS() {
    this.menus = []
    this.select = null
    sessionStorage.removeItem('g_double')
  }
  @Action
  public async GetMenus() {
    if (this.menus.length === 0) {
      let res = await request.get('pmi/menu/user/tree')
      // let res = require('@/router/json.json')
      this.SET_MENUS(res.data)
    }
    return this.menus
  }
  @Action
  public ToggleSideBar(withoutAnimation: boolean) {
    this.TOGGLE_SIDEBAR(withoutAnimation)
  }
  @Action
  public CloseSideBar(withoutAnimation: boolean) {
    this.CLOSE_SIDEBAR(withoutAnimation)
  }
  @Action
  public SetServerUrl(str: any) {
    this.SET_SERVERURL(str)
  }
  @Action
  public ToggleDevice(device: DeviceType) {
    this.TOGGLE_DEVICE(device)
  }
}

export const AppModule = getModule(App)
