import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const smsRoutes: RouteConfig[] = [
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/hmsg',
    meta: {
      title: '业务短信'
    },
    children: [
      {
        path: 'hmsg',
        name: 'hmsg',
        component: () => import('@/views/sms/hmsg/index.vue'),
        meta: {
          keepAlive: true,
          title: '历史短信'
        }
      },
      {
        path: 'sendMsg',
        name: 'sendMsg',
        component: () => import('@/views/sms/sendMsg/index.vue'),
        meta: {
          keepAlive: true,
          title: '指令调度'
        }
      },
      {
        path: 'msgTemplate',
        name: 'msgTemplate',
        component: () => import('@/views/sms/msgTemplate/index.vue'),
        meta: {
          keepAlive: true,
          title: '短信模板'
        }
      }
    ]
  }
]
