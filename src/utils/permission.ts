import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router/index'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import IMenu from '@/interface/menu'
import { AppModule } from '@/store/modules/app'
import { DictModule } from '@/store/modules/dict'
NProgress.configure({ showSpinner: false })
const whiteList = ['/login'] 
const errorMsg = '对不起，您暂无当前页面访问权限'
router.beforeEach(async (to: Route, _: Route, next: any) => {
  // 清除上一次路由权限缓存
  UserModule.SetThisMenu(undefined)
  // 加载进度条
  NProgress.start()
  // 从vuex中获取用户登录token（token已本地化存储）判断是否登录
  if (UserModule.token && UserModule.token !== 'undefined' && UserModule.token !== undefined) {
    if (to.path === '/login') {
      // 如果已经登录并且当前路由在登录页，则直接跳转至首页
      next({ path: '/' })
      NProgress.done()
    } else if (!UserModule.name) {
      // vuex中没有用户信息，则从服务端获取用户基础信息+须要权限认证路由合集（此处信息也可直接在登录成功后返回）
      try {
        await UserModule.GetUserInfo()
        if (AppModule.menus.length === 0){
          await AppModule.GetMenus()
        }
        await DictModule.GET_DICT()
        next({ ...to, replace: true })
      } catch (err) {
        // 获取信息出错，返回登录页，删除token
        UserModule.ResetToken()
        // Message.error('用户未登录，或登录超时，请重新登录')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    } else if (!UserModule.menus){
      next()
    } else {
      // 判断当前路由是否在权限认证列表中
      let thisMenu!: IMenu
      UserModule.menus.forEach((item: IMenu) => {
        if (item.path === to.path) {
          thisMenu = item
          return true
        }
      })
      // thisMenu!==undefined代表当前路由须要权限认证
      if (thisMenu !== undefined) {
        if (thisMenu.isUser === true) {
          // thisMenu.isUser === true 代表当前用户有此路由访问权限
          // 存入vuex中，方便进入路由后判断按钮权限
          UserModule.SetThisMenu(thisMenu)
          next()
        } else {
          // 转到错误页提示用户无访问权限
          next(`/error?msg=${errorMsg}`)
        }
      } else {
        next()
      }
    }
  } else if (whiteList.indexOf(to.path) === -1) {
    // 跳转到登录页
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  } else {
    next()
  }
})
router.afterEach((to: Route) => {
  NProgress.done()
  // document.title = to.meta.title
})
