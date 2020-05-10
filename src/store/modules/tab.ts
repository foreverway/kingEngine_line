import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ITabState {
  openTab: any[],// 所有打开的路由
  activeIndex: string, // 激活状态
  exclude:Array<string> // 不被缓存的组件
}

@Module({ dynamic: true, store, name: 'tab' })
class Tab extends VuexModule implements ITabState {
  public openTab: any[] = [] // 所有打开的路由
  public activeIndex: string = '/dashboard' // 激活状态
  public exclude:Array<string> = []
  // 清空tabs
  @Mutation
  public resetTabs() {
    this.openTab = []
  }
  // 添加tabs
  @Mutation
  public addTabs(data: any) {
    if (data.path.startsWith('/') === false){
      data.path = '/' + data.path
    }
    this.openTab.push(data)
  }
 // 修改tabs
 @Mutation
  public updateTabs(data: any) {
    for (let option of this.openTab) {
      if (option.route === data.path ) {
        option.name = data.meta.name
        break
      }
    }
  }

  @Mutation
  // 删除tabs
 public deleteTabs(path: any) {
   let index = 0
   for (let option of this.openTab) {
     if (option.path === path) {
       option.meta.keepAlive = false
       break
     }
     index++
   }
   this.openTab.splice(index, 1)
 }

  @Mutation
  // 设置当前激活的tab
  public setActiveIndex(index: any) {
    this.activeIndex = index
  }

  @Mutation
  // 保证只打开5个tab
  public mostTabs () {
    if (this.openTab.length > 5) {
      this.openTab.splice(1, 1)
    }
  }
  @Mutation
  public setExclude(name:string){
    this.exclude.push(name)
  }
  @Mutation
  public removeExclude(name?:any){
    let index = this.exclude.indexOf(name)
    if (index > -1){
      this.exclude.splice(index,1)
    }
  }
}
export const TabModule = getModule(Tab)
