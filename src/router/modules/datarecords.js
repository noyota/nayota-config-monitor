import Layout from '@/layout/index'
// 数据记录管理--异常数据记录，检测数据记录，检测记录报表，控制数据记录，场景触发数据记录
const datarecordsRouter = {
  path: '/datarecords',
  component: Layout,
  redirect: '/datarecords',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'chart',
    icon: 'chart'
  },
  children: [
  // {
  //   path: 'abnormaldata',
  //   component: () => import('@/views/abnormalData'),
  //   name: 'Abnormaldata',
  //   meta: {
  //     title: '异常数据记录', noRoles: false
  //   }
  // },
    {
      path: 'checkRecord',
      component: () => import('@/views/checkRecord'),
      name: 'CheckRecord',
      meta: {
        title: 'CheckRecord'
      }
    },
    // {
    //   path: 'checkReport',
    //   component: () => import('@/views/checkReport'),
    //   name: 'CheckReport',
    //   meta: {
    //     title: '检测记录报表', noRoles: false
    //   }
    // },
    {
      path: 'operateRecord',
      component: () => import('@/views/operateRecord'),
      name: 'OperateRecord',
      meta: {
        title: 'OperateRecord'
      }
    },
    {
      path: 'sceneRecord',
      component: () => import('@/views/sceneRecord'),
      name: 'SceneRecord',
      meta: {
        title: 'SceneRecord'
      }
    },
    {
      path: 'smartRecord',
      component: () => import('@/views/smartRecord'),
      name: 'SmartRecord',
      meta: {
        title: 'SmartRecord'
      }
    },
    {
      path: 'cameraRecord',
      component: () => import('@/views/cameraRecord'),
      name: 'CameraRecord',
      meta: {
        title: 'cameraRecord'
      }
    },
    {
      path: 'thingRecord',
      component: () => import('@/views/thingRecord'),
      name: 'ThingRecord',
      meta: {
        title: 'ThingRecord'
      }
    },
    {
      path: 'pushRecord',
      component: () => import('@/views/pushRecord'),
      name: 'PushRecord',
      meta: {
        title: 'PushRecord'
      }
    },
    {
      path: 'recall',
      component: () => import('@/views/recall'),
      name: 'Recall',
      meta: {
        title: 'recall'
      }
    },
    {
      path: 'board/board',
      component: () => import('@/views/board/board'),
      hidden: true,
      name: 'Board',
      meta: {
        title: 'Board'
      }
    },
    {
      path: 'board/historyChart',
      component: () => import('@/views/board/historyChart'),
      hidden: true,
      name: 'HistoryChart',
      meta: {
        title: 'HistoryChart', noRoles: false
      }
    }
  // {
  //   path: 'abnormaldatachart',
  //   component: () => import('@/views/abnormalDataChart'),
  //   name: 'Abnormaldatachart',
  //   meta: {
  //     title: '异常数据记录(图)', noRoles: false
  //   }
  // },
  // {
  //   path: 'checkRecordchart',
  //   component: () => import('@/views/checkRecordChart'),
  //   name: 'CheckRecordchart',
  //   meta: {
  //     title: '检测数据记录(图)', noRoles: false
  //   }
  // },
  // {
  //   path: 'checkReportchart',
  //   component: () => import('@/views/checkReportChart'),
  //   name: 'CheckReportchart',
  //   meta: {
  //     title: '检测记录报表(图)', noRoles: false
  //   }
  // },
  // {
  //   path: 'controlRecordchart',
  //   component: () => import('@/views/controlRecordChart'),
  //   name: 'ControlRecordchart',
  //   meta: {
  //     title: '控制数据记录(图)', noRoles: false
  //   }
  // }
  ]
}

export default datarecordsRouter
