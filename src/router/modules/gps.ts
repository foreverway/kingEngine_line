import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const gpsRoutes: RouteConfig[] = [
  {
    path: '/gps',
    component: Layout,
    redirect: '/gps/business',
    meta: {
      title: 'vehicleManagement'
    },
    children: [
      {
        path: 'business',
        redirect: 'business/vehicle',
        component: (resolve) => require(['@/views/gps/business/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '业务管理'
        },
        children: [
          {
            path: 'vehicle',
            component: (resolve) => require(['@/views/gps/business/vehicle/vehicleManagement.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '车辆管理'
            }
          },
          {
            path: 'driver',
            component: (resolve) => require(['@/views/gps/business/driver/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '司机管理'
            }
          },
          {
            path: 'repair',
            component: (resolve) => require(['@/views/gps/business/repair/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '维修管理'
            }
          },
          {
            path: 'insurance',
            component: (resolve) => require(['@/views/gps/business/insurance/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '保险管理'
            }
          },
          {
            path: 'jobStatistics',
            component: (resolve) => require(['@/views/gps/business/jobStatistics/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '作业统计'
            }
          }
        ] 
      },
      {
        path: 'alarm',
        redirect: 'alarm/query',
        component: (resolve) => require(['@/views/gps/alarm/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '报警管理'
        },
        children: [
          {
            path: 'query',
            component: (resolve) => require(['@/views/gps/alarm/query/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '报警设置'
            }
          },
          {
            path: 'statistics',
            component: (resolve) => require(['@/views/gps/alarm/statistics/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '报警统计'
            }
          },
          {
            path: 'record',
            component: (resolve) => require(['@/views/gps/alarm/record/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '报警记录'
            }
          }
        ] 
      },
      {
        path: 'dispatch',
        redirect: 'dispatch/dispatch',
        component: (resolve) => require(['@/views/gps/dispatch/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '指令调度'
        },
        children: [
          {
            path: 'dispatch',
            component: (resolve) => require(['@/views/gps/dispatch/dispatch.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '指令调度'
            }
          },
          {
            path: 'investigation',
            component: (resolve) => require(['@/views/gps/dispatch/investigation.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '指令调度调查'
            }
          },
          {
            path: 'statistics',
            component: (resolve) => require(['@/views/gps/dispatch/statistics.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '指令调度统计'
            }
          }
        ] 
      },
      {
        path: 'monitor',
        component: (resolve) => require(['@/views/gps/monitor/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '实时监控'
        }
      }
    ]
  }
]
