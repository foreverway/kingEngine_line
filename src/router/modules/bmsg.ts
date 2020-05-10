import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const bmsgRoutes: RouteConfig[] = [
  {
    path: '/bmsg',
    component: Layout,
    redirect: '/bmsg/hmsg',
    meta: {
      title: '业务短信'
    },
    children: [
      {
        path: 'hmsg',
        name: 'hmsg',
        component: () => import('@/views/event/bmsg/hmsg/index.vue'),
        meta: {
          keepAlive: true,
          title: '历史短信'
        }
      },
      {
        path: 'sendMsg',
        name: 'sendMsg',
        component: () => import('@/views/event/bmsg/sendMsg/index.vue'),
        meta: {
          keepAlive: true,
          title: '指令调度'
        }
      },
      {
        path: 'msgTemplate',
        name: 'msgTemplate',
        component: () => import('@/views/event/bmsg/msgTemplate/index.vue'),
        meta: {
          keepAlive: true,
          title: '短信模板'
        }
      }
    ]
  }
]
