import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const vehicleMonitoringRoutes: RouteConfig[] = [
  {
    path: '/vehicleMonitoring',
    component: Layout,
    redirect: '/vehicleMonitoring/business',
    meta: {
      title: 'vehicleManagement'
    },
    children: [
      {
        path: 'business',
        redirect: 'business/vehicle',
        component: () => import('@/views/vehicleMonitoring/business/index.vue'),
        meta: {
          keepAlive: true,
          title: '业务管理'
        },
        children: [
          {
            path: 'vehicle',
            component: () => import('@/views/vehicleMonitoring/business/vehicle/vehicleManagement.vue'),
            meta: {
              keepAlive: true,
              title: '车辆管理'
            }
          },
          {
            path: 'driver',
            component: () => import('@/views/vehicleMonitoring/business/driver/index.vue'),
            meta: {
              keepAlive: true,
              title: '司机管理'
            }
          },
          {
            path: 'repair',
            component: () => import('@/views/vehicleMonitoring/business/repair/index.vue'),
            meta: {
              keepAlive: true,
              title: '维修管理'
            }
          },
          {
            path: 'insurance',
            component: () => import('@/views/vehicleMonitoring/business/insurance/index.vue'),
            meta: {
              keepAlive: true,
              title: '保险管理'
            }
          }
        ] 
      },
      {
        path: 'alarm',
        redirect: 'alarm/query',
        component: () => import('@/views/vehicleMonitoring/alarm/index.vue'),
        meta: {
          keepAlive: true,
          title: '报警管理'
        },
        children: [
          {
            path: 'query',
            component: () => import('@/views/vehicleMonitoring/alarm/query/index.vue'),
            meta: {
              keepAlive: true,
              title: '报警查询'
            }
          },
          {
            path: 'statistics',
            component: () => import('@/views/vehicleMonitoring/alarm/statistics/index.vue'),
            meta: {
              keepAlive: true,
              title: '报警统计'
            }
          }
        ] 
      }
    ]
  }
]
