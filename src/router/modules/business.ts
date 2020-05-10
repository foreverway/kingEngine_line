import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const businessRoutes: RouteConfig[] = [
  {
    path: '/business',
    component: Layout,
    redirect: '/business/task',
    meta: {
      title: 'task'
    },
    children: [
      {
        path: 'task',
        name: 'task',
        component: (resolve) => require(['@/views/event/business/task/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '我的待办'
        }
      },
      {
        path: 'leader',
        name: 'leader',
        component: (resolve) => require(['@/views/event/business/task/leader.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '领导批示'
        }
      },
      {
        path: 'public',
        name: 'public',
        component: (resolve) => require(['@/views/event/business/task/public.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '公众举报'
        }
      },
      {
        path: 'already',
        name: 'already',
        component: (resolve) => require(['@/views/event/business/task/already.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '已办案件'
        }
      },
      {
        path: 'verify',
        name: 'verify',
        component: (resolve) => require(['@/views/event/business/task/verify.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '核实核查'
        }
      },
      {
        path: 'withdraw',
        name: 'withdraw',
        component: (resolve) => require(['@/views/event/business/task/withdraw.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '可撤回件'
        }
      },
      {
        path: 'locking',
        name: 'locking',
        component: (resolve) => require(['@/views/event/business/task/locking.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '锁定案件'
        }
      },
      {
        path: 'recovery',
        name: 'recovery',
        component: (resolve) => require(['@/views/event/business/task/recovery.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '回收站'
        }
      },
      {
        path: 'ordinary',
        name: 'ordinary',
        component: () => import('@/views/event/business/search/ordinary.vue'),
        meta: {
          keepAlive: true,
          title: '普通查询'
        }
      },
      {
        path: 'move',
        name: 'move',
        component: () => import('@/views/event/business/search/move.vue'), 
        meta: {
          keepAlive: true,
          title: '高级查询'
        }
      },
      {
        path: 'duling',
        name: 'duling',
        component: () => import('@/views/event/business/task/duling.vue'),
        meta: {
          keepAlive: true,
          title: '改期审批'
        }
      },
      {
        path: 'regression',
        name: 'regression',
        component: () => import('@/views/event/business/task/regression.vue'),
        meta: {
          keepAlive: true,
          title: '回退审批'
        }
      },
      {
        path: 'urge',
        name: 'urge',
        component: () => import('@/views/event/business/task/urge.vue'),
        meta: {
          keepAlive: true,
          title: '我的催办'
        }
      },
      {
        path: 'supervise',
        name: 'supervise',
        component: () => import('@/views/event/business/task/supervise.vue'),
        meta: {
          keepAlive: true,
          title: '可督办件'
        }
      },
      {
        path: 'mySupervise',
        name: 'mySupervise',
        component: () => import('@/views/event/business/task/mySupervise.vue'),
        meta: {
          keepAlive: true,
          title: '我的督办'
        }
      },
      {
        path: 'dutyManage',
        redirect: 'dutyManage/personalSchedule',
        component: () => import('@/views/event/business/dutyManage/index.vue'),
        meta: {
          keepAlive: true,
          title: '值班管理'
        },
        children: [
          {
            path: 'personalSchedule',
            component: () => import('@/views/event/business/dutyManage/personalSchedule/index.vue'),
            meta: {
              keepAlive: true,
              title: '人员排班'
            }
          },
          {
            path: 'ShiftsSetting',
            component: () => import('@/views/event/business/dutyManage/ShiftsSetting/index.vue'),
            meta: {
              keepAlive: true,
              title: '班次设置'
            }
          }
        ]
      },
      {
        path: 'businessSetting',
        redirect: 'businessSetting/languageMaintain',
        component: () => import('@/views/event/business/businessSetting/index.vue'),
        meta: {
          keepAlive: true,
          title: '业务设置'
        },
        children: [
          {
            path: 'languageMaintain',
            component: () => import('@/views/event/business/businessSetting/languageMaintain/index.vue'),
            meta: {
              keepAlive: true,
              title: '常用语维护'
            }
          },
          {
            path: 'caseRechecking',
            component: () => import('@/views/event/business/businessSetting/caseRechecking/index.vue'),
            meta: {
              keepAlive: true,
              title: '案件查重设置'
            }
          },
          {
            path: 'collectionClasses',
            component: () => import('@/views/event/business/businessSetting/collectionClasses/index.vue'),
            meta: {
              keepAlive: true,
              title: '收藏类别维护'
            }
          },
          {
            path: 'timeLimit',
            component: () => import('@/views/event/business/businessSetting/timeLimit/index.vue'),
            meta: {
              keepAlive: true,
              title: '时限设置'
            }
          },
          {
            path: 'process',
            component: () => import('@/views/event/business/businessSetting/process/index.vue'),
            meta: {
              keepAlive: true,
              title: '流程管理'
            }
          },
          {
            path: 'bean',
            component: () => import('@/views/event/business/businessSetting/workflow/bean/index.vue'),
            meta: {
              keepAlive: true,
              title: 'Bean管理'
            }
          },
          {
            path: 'template',
            component: () => import('@/views/event/business/businessSetting/workflow/template/index.vue'),
            meta: {
              keepAlive: true,
              title: '流程图模板'
            }
          },
          {
            path: 'instance',
            component: () => import('@/views/event/business/businessSetting/workflow/instance/index.vue'),
            meta: {
              keepAlive: true,
              title: '流程图实例'
            }
          },
          {
            path: 'bizobj',
            component: () => import('@/views/event/business/businessSetting/workflow/bizobj/index.vue'),
            meta: {
              keepAlive: true,
              title: '业务对象'
            }
          },
          {
            path: 'formTemplate',
            component: () => import('@/views/event/business/businessSetting/workflow/formTemplate/index.vue'),
            meta: {
              keepAlive: true,
              title: '表单业务模板'
            }
          },
          {
            path: 'formInstance',
            component: () => import('@/views/event/business/businessSetting/workflow/formInstance/index.vue'),
            meta: {
              keepAlive: true,
              title: '表单业面实例'
            }
          },
          {
            path: 'processSolution',
            component: () => import('@/views/event/business/businessSetting/workflow/processSolution/index.vue'),
            meta: {
              keepAlive: true,
              title: '流程方案配置'
            }
          },
          {
            path: 'initiateProcess',
            component: () => import('@/views/event/business/businessSetting/workflow/initiateProcess/index.vue'),
            meta: {
              keepAlive: true,
              title: '发起流程'
            }
          },
          {
            path: 'schedule',
            component: () => import('@/views/event/business/businessSetting/workflow/schedule/index.vue'),
            meta: {
              keepAlive: true,
              title: '待办事项'
            }
          },
          {
            path: 'draftbox',
            component: () => import('@/views/event/business/businessSetting/workflow/draftbox/index.vue'),
            meta: {
              keepAlive: true,
              title: '草稿箱'
            }
          },
          {
            path: 'havedone',
            component: () => import('@/views/event/business/businessSetting/workflow/havedone/index.vue'),
            meta: {
              keepAlive: true,
              title: '我的已办'
            }
          },
          {
            path: 'processAgent',
            component: () => import('@/views/event/business/businessSetting/workflow/processAgent/index.vue'),
            meta: {
              keepAlive: true,
              title: '流程代理'
            }
          },
          {
            path: 'processInsMonitoring',
            component: () => import('@/views/event/business/businessSetting/workflow/processInsMonitoring/index.vue'),
            meta: {
              keepAlive: true,
              title: '流程实例监控'
            }
          },
          {
            path: 'taskInsMonitoring',
            component: () => import('@/views/event/business/businessSetting/workflow/taskInsMonitoring/index.vue'),
            meta: {
              keepAlive: true,
              title: '任务实例监控'
            }
          }
        ]
      },
      {
        path: 'workLog',
        redirect: 'workLog/platform',
        component: () => import('@/views/event/business/workLog/index.vue'),
        meta: {
          keepAlive: true,
          title: '工作日志'
        },
        children: [
          {
            path: 'platform',
            component: () => import('@/views/event/business/workLog/platform/index.vue'),
            meta: {
              keepAlive: true,
              title: '平台值班日志'
            }
          },
          {
            path: 'systemMaintain',
            component: () => import('@/views/event/business/workLog/systemMaintain/index.vue'),
            meta: {
              keepAlive: true,
              title: '系统维护日志'
            }
          },
          {
            path: 'supervise',
            component: () => import('@/views/event/business/workLog/supervise/index.vue'),
            meta: {
              keepAlive: true,
              title: '综合监管日志'
            }
          },
          {
            path: 'visitReception',
            component: () => import('@/views/event/business/workLog/visitReception/index.vue'),
            meta: {
              keepAlive: true,
              title: '参观接待日志'
            }
          }
        ]
      },
      {
        path: 'guestbook',
        redirect: 'guestbook/record',
        component: () => import('@/views/event/business/guestbook/index.vue'),
        meta: {
          keepAlive: true,
          title: '留言板'
        },
        children: [
          {
            path: 'record',
            component: () => import('@/views/event/business/guestbook/record/index.vue'),
            meta: {
              keepAlive: true,
              title: '留言记录'
            }
          },
          {
            path: 'myMessage',
            component: () => import('@/views/event/business/guestbook/myMessage/index.vue'),
            meta: {
              keepAlive: true,
              title: '我的留言'
            }
          },
          {
            path: 'statistics',
            component: () => import('@/views/event/business/guestbook/statistics/index.vue'),
            meta: {
              keepAlive: true,
              title: '留言统计'
            }
          },
          {
            path: 'demo',
            component: () => import('@/views/event/business/guestbook/demo/index.vue'),
            meta: {
              keepAlive: true,
              title: '留言demo'
            }
          }
        ]
      }
    ]
  }
]
