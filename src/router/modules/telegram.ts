import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const telegramRoutes: RouteConfig[] = [
  {
    path: '/telegram',
    component: Layout,
    redirect: '/telegram/prelog',
    meta: {
      keepAlive: true,
      title: '12319热线'
    },
    children: [{
      path: 'prelog',
      component: () => import('@/views/event/telegram/prelog/index.vue'),
      meta: {
        keepAlive: true,
        title: '预登记件'
      }
    },
    {
      path: 'evaluation',
      redirect: 'evaluation/begin',
      component: () => import('@/views/event/telegram/evaluation/index.vue'),
      meta: {
        keepAlive: true,
        title: '公众评价'
      },
      children: [{
        path: 'begin',
        component: () => import('@/views/event/telegram/evaluation/begin/index.vue'),
        meta: {
          keepAlive: true,
          title: '立案评价'
        }},
      {
        path: 'end',
        component: () => import('@/views/event/telegram/evaluation/end/index.vue'),
        meta: {
          keepAlive: true,
          title: '结案评价'
        }
      }
      ]},
    {
      path: 'calls',
      redirect: 'calls/today',
      component: () => import('@/views/event/telegram/calls/index.vue'),
      meta: {
        keepAlive: true,
        title: '呼叫中心'
      },
      children: [
        {
          path: 'today',
          component: () => import('@/views/event/telegram/calls/today/index.vue'),
          meta: {
            keepAlive: true,
            title: '今日来电'
          }
        },
        {
          path: 'history',
          component: () => import('@/views/event/telegram/calls/history/index.vue'),
          meta: {
            keepAlive: true,
            title: '历史来电'
          }
        },
        {
          path: 'count',
          component: () => import('@/views/event/telegram/calls/count/index.vue'),
          meta: {
            keepAlive: true,
            title: '来电统计'
          }
        }
      ]
    }]
  }

]
