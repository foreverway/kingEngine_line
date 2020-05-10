import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const mapRoutes: RouteConfig[] = [
  {
    path: '/map',
    component: Layout,
    redirect: '/map/index',
    meta: {
      title: '监督指挥子系统'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/map/index.vue'),
        meta: {
          keepAlive: true,
          title: '监督指挥子系统'
        }
      }
    ]
  }
]
