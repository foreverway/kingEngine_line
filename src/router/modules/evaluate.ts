import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const evaluateRoutes: RouteConfig[] = [
  {
    path: '/evaluate',
    component: Layout,
    redirect: '/evaluate/task',
    meta: {
      title: 'task'
    },
    children: [
      {
        path: 'task',
        name: 'task',
        component: () => import('@/views/event/evaluate/task/index.vue'),
        meta: {
          keepAlive: true,
          title: '我的待办1'
        }
      },
      {
        path: 'comprehensive',
        redirect: 'comprehensive/acceptor',
        component: () => import('@/views/event/evaluate/comprehensive/index.vue'),
        meta: {
          keepAlive: true,
          title: '综合评价'
        },
        children: [
          {
            path: 'acceptor',
            component: () => import('@/views/event/evaluate/comprehensive/acceptor/index.vue'),
            meta: {
              keepAlive: true,
              title: '受理员评价'
            }
          },
          {
            path: 'shiftForeman',
            component: () => import('@/views/event/evaluate/comprehensive/shiftForeman/index.vue'),
            meta: {
              keepAlive: true,
              title: '值班长评价'
            }
          },
          {
            path: 'dispatcher',
            component: () => import('@/views/event/evaluate/comprehensive/dispatcher/index.vue'),
            meta: {
              keepAlive: true,
              title: '派遣员评价'
            }
          },
          {
            path: 'unit',
            component: () => import('@/views/event/evaluate/comprehensive/unit/index.vue'),
            meta: {
              keepAlive: true,
              title: '责任单位评价'
            }
          },
          {
            path: 'special',
            component: () => import('@/views/event/evaluate/comprehensive/special/index.vue'),
            meta: {
              keepAlive: true,
              title: '专项评价'
            }
          }
        ]
      },
      {
        path: 'statistics',
        redirect: 'statistics/parts',
        component: () => import('@/views/event/evaluate/statistics/index.vue'),
        meta: {
          keepAlive: true,
          title: '数据统计'
        },
        children: [
          {
            path: 'parts',
            component: () => import('@/views/event/evaluate/statistics/parts/index.vue'),
            meta: {
              keepAlive: true,
              title: '事部件统计'
            }
          },
          {
            path: 'caseLevel',
            component: () => import('@/views/event/evaluate/statistics/caseLevel/index.vue'),
            meta: {
              keepAlive: true,
              title: '案件等级统计'
            }
          },
          {
            path: 'problemSource',
            component: () => import('@/views/event/evaluate/statistics/problemSource/index.vue'),
            meta: {
              keepAlive: true,
              title: '问题来源统计'
            }
          }
        ]
      },
      {
        path: 'setting',
        redirect: 'setting/personnel',
        component: () => import('@/views/event/evaluate/setting/index.vue'),
        meta: {
          keepAlive: true,
          title: '评价设置'
        },
        children: [
          {
            path: 'personnel',
            component: () => import('@/views/event/evaluate/setting/personnel/index.vue'),
            meta: {
              keepAlive: true,
              title: '评价人员'
            }
          },
          {
            path: 'department',
            component: () => import('@/views/event/evaluate/setting/department/index.vue'),
            meta: {
              keepAlive: true,
              title: '评价部门'
            }
          },
          {
            path: 'weight',
            component: () => import('@/views/event/evaluate/setting/weight/index.vue'),
            meta: {
              keepAlive: true,
              title: '权重设置'
            }
          },
          {
            path: 'formula',
            component: () => import('@/views/event/evaluate/setting/formula/index.vue'),
            meta: {
              keepAlive: true,
              title: '公式定义'
            }
          },
          {
            path: 'explain',
            component: () => import('@/views/event/evaluate/setting/explain/index.vue'),
            meta: {
              keepAlive: true,
              title: '评价说明'
            }
          },
          {
            path: 'rate',
            component: () => import('@/views/event/evaluate/setting/rate/index.vue'),
            meta: {
              keepAlive: true,
              title: '评级设置'
            }
          }
        ]
      },
      {
        path: 'appeal',
        redirect: 'appeal/myAppeal',
        component: () => import('@/views/event/evaluate/appeal/index.vue'),
        meta: {
          keepAlive: true,
          title: '评价申诉'
        },
        children: [
          {
            path: 'myAppeal',
            component: () => import('@/views/event/evaluate/appeal/myAppeal/index.vue'),
            meta: {
              keepAlive: true,
              title: '我的申诉'
            }
          },
          {
            path: 'apply',
            component: () => import('@/views/event/evaluate/appeal/apply/index.vue'),
            meta: {
              keepAlive: true,
              title: '申诉申请'
            }
          }
        ]
      }
    ]
  }
]
