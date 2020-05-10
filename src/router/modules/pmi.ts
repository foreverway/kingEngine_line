import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

export const pmiRoutes: RouteConfig[] = [
  {
    path: '/pmi',
    component: Layout,
    redirect: '/pmi/user',
    name: 'user',
    meta: {
      title: '用户管理',
      keepAlive: true
    },
    children: [
      {
        path: 'organize',
        redirect: 'organize/department',
        component: (resolve) => require(['@/views/pmi/organize/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '组织结构'
        },
        children: [
          {
            name: 'dept',
            path: 'department',
            component: (resolve) => require(['@/views/pmi/organize/department/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '部门管理'
            }
          },
          {
            name: 'user',
            path: 'person',
            component: (resolve) => require(['@/views/pmi/organize/person/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '人员管理'
            }
          }
        ]
      },
      {
        path: 'limit',
        redirect: 'limit/systemResource',
        component: (resolve) => require(['@/views/pmi/limit/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '权限管理'
        },
        children: [
          {
            path: 'systemResource',
            component: (resolve) => require(['@/views/pmi/limit/systemResource/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '系统资源'
            }
          },
          {
            path: 'roleManager',
            component: (resolve) => require(['@/views/pmi/limit/roleManager/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '角色管理'
            }
          },
          {
            path: 'appRoleManager',
            component: (resolve) => require(['@/views/pmi/limit/appRoleManager/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: 'APP角色管理'
            }
          }
        ]
      },
      {
        path: 'basicInfo',
        redirect: 'basicInfo/adminArea',
        component: (resolve) => require(['@/views/pmi/basicInfo/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '基础信息'
        },
        children: [
          {
            path: 'adminArea',
            component: (resolve) => require(['@/views/pmi/basicInfo/adminArea/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '行政区域'
            }
          },
          {
            path: 'gridManage',
            component: (resolve) => require(['@/views/pmi/basicInfo/gridManage/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '工作网格'
            }
          },
          {
            path: 'partManage',
            component: (resolve) => require(['@/views/pmi/basicInfo/partManage/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '事部件管理'
            }
          }
        ]
      },
      {
        path: 'senior',
        redirect: 'senior/systemProfile',
        component: (resolve) => require(['@/views/pmi/senior/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '高级管理'
        },
        children: [
          {
            path: 'systemProfile',
            component: (resolve) => require(['@/views/pmi/senior/systemProfile/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '系统信息配置'
            }
          },
          {
            path: 'loginLog',
            component: (resolve) => require(['@/views/pmi/senior/loginLog/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '系统登录日志'
            }
          },
          {
            path: 'operationLog',
            component: (resolve) => require(['@/views/pmi/senior/operationLog/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '系统操作日志'
            }
          },
          {
            path: 'updateRecord',
            component: (resolve) => require(['@/views/pmi/senior/updateRecord/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '系统更新记录'
            }
          },
          {
            path: 'helpDocument',
            component: (resolve) => require(['@/views/pmi/senior/helpDocument/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '系统帮助文档'
            }
          }
        ]
      },
      {
        path: 'personal',
        redirect: 'personal/personalInfo',
        component: (resolve) => require(['@/views/pmi/personal/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '个人设置'
        },
        children: [
          {
            path: 'personalInfo',
            component: (resolve) => require(['@/views/pmi/personal/personalInfo/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '个人信息'
            }
          },
          {
            path: 'changePwd',
            component: (resolve) => require(['@/views/pmi/personal/changePwd/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '修改密码'
            }
          },
          {
            path: 'agenda',
            component: (resolve) => require(['@/views/pmi/personal/agenda/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '待办配置'
            }
          }
        ]
      },
      {
        path: 'systemBulletin',
        component: (resolve) => require(['@/views/pmi/systemBulletin/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '系统公告'
        }
      },
      {
        path: 'commonInfo',
        redirect: 'commonInfo/fileInfo',
        component: (resolve) => require(['@/views/pmi/commonInfo/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '公共信息'
        },
        children: [
          {
            path: 'fileInfo',
            component: (resolve) => require(['@/views/pmi/commonInfo/fileInfo/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '文件资料'
            }
          }
        ]
      },
      {
        path: 'ddic',
        component: (resolve) => require(['@/views/pmi/ddic/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '数据字典'
        }
      },
      {
        path: 'comLanguage',
        redirect: 'comLanguage/language',
        component: (resolve) => require(['@/views/pmi/comLanguage/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '工作流管理'
        },
        children: [
          {
            path: 'language',
            component: (resolve) => require(['@/views/pmi/comLanguage/manage/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '系统常用语'
            }
          }
        ]
      },
      {
        path: 'monitor',
        redirect: 'monitor/performance',
        component: (resolve) => require(['@/views/pmi/monitor/index.vue'], resolve),
        meta: {
          keepAlive: true,
          title: '系统监控'
        },
        children: [
          {
            path: 'performance',
            component: (resolve) => require(['@/views/pmi/monitor/performance/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '性能监控'
            }
          },
          {
            path: 'alarmSetting',
            component: (resolve) => require(['@/views/pmi/monitor/alarmSetting/index.vue'], resolve),
            meta: {
              keepAlive: true,
              title: '报警设置'
            }
          }
        ]
      }
    ]
  }
]
