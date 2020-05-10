import Router, { RouteConfig } from 'vue-router'
import Vue from 'vue'
import Layout from '@/layout/index.vue'
import { businessRoutes } from '@/router/modules/business'
import { pmiRoutes } from '@/router/modules/pmi'
import { inspectorRoutes } from '@/router/modules/inspector'
import { evaluateRoutes } from '@/router/modules/evaluate'
import { smsRoutes } from '@/router/modules/sms'
import { gpsRoutes } from '@/router/modules/gps'
import { telegramRoutes } from '@/router/modules/telegram'
import { mapRoutes } from '@/router/modules/map'
// 添加到 routes 中（框架原有代码会将新加路由挂载到 router 实例中）
export const constantRoutes: RouteConfig[] = [
  ...pmiRoutes,
  ...businessRoutes,
  ...inspectorRoutes,
  ...evaluateRoutes,
  ...gpsRoutes,
  ...telegramRoutes,
  ...smsRoutes,
  ...mapRoutes
]
Vue.use(Router)
export default new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } 
    return { x: 0, y: 0 }
    
  },
  routes: [
    {
      path: '/login',
      component: () => import('@/views/common/login/index.vue'),
      meta: { hidden: true }
    },
    {
      path: '/nav',
      component: () => import('@/views/common/dashboard/nav.vue'),
      meta: { hidden: true }
    },
    {
      path: '/404',
      component: () => import('@/views/common/404.vue'),
      meta: { hidden: true }
    },
    {
      path: '/',
      component: Layout,
      redirect: '/dashboard',
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/common/dashboard/index.vue'),
          meta: {
            keepAlive: true,
            title: '首页'
          }
        }
      ]
    },
    {
      path: '/colors',
      component: () => import('@/views/common/colors.vue'),
      meta: { hidden: true }
    },
    ...constantRoutes
  ]
})
