import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const inspectorRoutes: RouteConfig[] = [
  {
    path: '/inspector',
    component: Layout,
    redirect: '/inspector/basicInfo',
    meta: {
      keepAlive: true,
      title: '监督员管理'
    },
    children: [
      {
        path: 'basicInfo',
        redirect: 'basicInfo/person',
        component: (resolve) => require(['@/views/event/inspector/basicInfo/index.vue'],resolve),
        meta: {
          keepAlive: true,
          title: '基本信息'
        },
        children: [
          {
            path: 'person',
            component: (resolve) => require(['@/views/event/inspector/basicInfo/person/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '人员管理'
            }
          },
          {
            path: 'dismission',
            component: (resolve) => require(['@/views/event/inspector/basicInfo/dismission/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '离职名单'
            }
          },
          {
            path: 'group',
            component: (resolve) => require(['@/views/event/inspector/basicInfo/group/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '工作组管理'
            }
          }, {
            path: 'device',
            component: (resolve) => require(['@/views/event/inspector/basicInfo/device/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '设备管理'
            }
          },{
            path: 'web',
            component: (resolve) => require(['@/views/event/inspector/basicInfo/web/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '工作组网格管理'
            }
          }
        ]
      },
      {
        path: 'dutyManage',
        redirect: 'dutyManage/today',
        component: (resolve) => require(['@/views/event/inspector/dutyManage/index.vue'],resolve),
        meta: {
          keepAlive: true,
          title: '当班管理'
        },
        children: [
          {
            path: 'today',
            component: (resolve) => require(['@/views/event/inspector/dutyManage/today/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '今日当班'
            }
          },
          {
            path: 'history',
            component: (resolve) => require(['@/views/event/inspector/dutyManage/history/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '历史当班'
            }
          },
          {
            path: 'webQuest',
            component: (resolve) => require(['@/views/event/inspector/dutyManage/webQuest/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '网格任务统计'
            }
          }, {
            path: 'personQuest',
            component: (resolve) => require(['@/views/event/inspector/dutyManage/personQuest/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '人员任务统计'
            }
          }, {
            path: 'dutyQuest',
            component: (resolve) => require(['@/views/event/inspector/dutyManage/dutyQuest/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '当班任务统计'
            }
          }
        ]
      },
      {
        path: 'orderManage',
        redirect: 'orderManage/person',
        component: (resolve) => require(['@/views/event/inspector/orderManage/index.vue'],resolve),
        meta: {
          keepAlive: true,
          title: '排班管理'
        },
        children: [
          {
            path: 'person',
            component: (resolve) => require(['@/views/event/inspector/orderManage/person/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '人员排班'
            }
          },
          {
            path: 'class',
            component: (resolve) => require(['@/views/event/inspector/orderManage/class/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '班次设置'
            }
          }
        ]
      },
      {
        path: 'attendenceManage',
        redirect: 'attendenceManage/record',
        component: (resolve) => require(['@/views/event/inspector/attendenceManage/index.vue'],resolve),
        meta: {
          keepAlive: true,
          title: '考勤管理'
        },
        children: [
          {
            path: 'record',
            component: (resolve) => require(['@/views/event/inspector/attendenceManage/record/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '打卡记录'
            }
          },
          {
            path: 'count',
            component: (resolve) => require(['@/views/event/inspector/attendenceManage/count/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '考勤统计'
            }
          },
          {
            path: 'vacate',
            component: (resolve) => require(['@/views/event/inspector/attendenceManage/vacate/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '请假管理'
            }
          }
        ]
      }, {
        path: 'workManage',
        redirect: 'workManage/workCount',
        component: (resolve) => require(['@/views/event/inspector/workManage/index.vue'],resolve),
        meta: {
          keepAlive: true,
          title: '工作统计'
        },
        children: [
          {
            path: 'workCount',
            component: (resolve) => require(['@/views/event/inspector/workManage/workCount/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '工作统计'
            }
          },
          {
            path: 'attendance',
            component: (resolve) => require(['@/views/event/inspector/workManage/attendance/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '考勤情况'
            }
          }
          // {
          //   path: 'workSituation',
          //   component: (resolve) => require(['@/views/event/inspector/workManage/workSituation/index.vue'],resolve),
          //   meta: {
          //     keepAlive: true,
          //     title: '工作情况汇总'
          //   }
          // },
          // {
          //   path: 'assessmentSituation',
          //   component: (resolve) => require(['@/views/event/inspector/workManage/assessmentSituation/index.vue'],resolve),
          //   meta: {
          //     keepAlive: true,
          //     title: '考核情况表'
          //   }
          // }

        ]
      },
      {
        path: 'alarmManage',
        redirect: 'alarmManage/alarmRecord',
        component: (resolve) => require(['@/views/event/inspector/alarmManage/index.vue'],resolve),
        meta: {
          keepAlive: true,
          title: '智能报警'
        },
        children: [
          {
            path: 'alarmRecord',
            component: (resolve) => require(['@/views/event/inspector/alarmManage/alarmRecord/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '报警记录'
            }
          },
          {
            path: 'alarmCount',
            component: (resolve) => require(['@/views/event/inspector/alarmManage/alarmCount/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '报警统计'
            }
          },
          {
            path: 'alarmSetting',
            component: (resolve) => require(['@/views/event/inspector/alarmManage/alarmSetting/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '报警设置'
            }
          }
        ]
      },
      {
        path: 'message',
        redirect: 'message/bussinessMessage',
        component: (resolve) => require(['@/views/event/inspector/message/index.vue'],resolve),
        meta: {
          keepAlive: true,
          title: '消息通讯'
        },
        children: [
          {
            path: 'bussinessMessage',
            component: (resolve) => require(['@/views/event/inspector/message/bussinessMessage/index.vue'],resolve),
            meta: {
              keepAlive: true,
              title: '业务消息'
            }
          }
        ]
      }
    ]
  }
]
