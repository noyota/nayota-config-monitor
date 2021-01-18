import Layout from '@/layout/index'
// 模型管理--物模型表、物表、物模型驱动表、协议表、Ai模型表
const modelsetsRouter = {
  path: '/modelsets',
  component: Layout,
  redirect: '/modelsets',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'modelsets',
    icon: 'example'
  },
  children: [
    {
      path: 'Agreement',
      component: () => import('@/views/agreement'),
      name: 'Agreement',
      meta: {
        title: 'Agreement'
      }
    },
    {
      path: 'Hardwareword',
      component: () => import('@/views/hardwareword'),
      name: 'Hardwareword',
      meta: {
        title: 'Hardwareword'
      }
    },
    {
      path: 'thingModel',
      component: () => import('@/views/thingModel'),
      name: 'ThingModel',
      meta: {
        title: 'ThingModel'
      }
    }, {
      path: 'thing',
      component: () => import('@/views/thing'),
      name: 'Thing',
      meta: {
        title: 'Thing'
      }
    }, {
      hidden: true,
      path: 'thingDrive/:modelId',
      component: () => import('@/views/thingDrive'),
      name: 'ThingDrive',
      meta: {
        title: 'ThingDrive'
      }
    },
    {
      path: 'UIModel',
      component: () => import('@/views/uiModel'),
      name: 'UIModel',
      meta: {
        title: 'UIModel'
      }
    },
    {
      path: 'Aimodel',
      component: () => import('@/views/aimodel'),
      name: 'Aimodel',
      meta: {
        title: 'Aimodel',
        envRole: 'serve'
      }
    }
  ]
}

export default modelsetsRouter
