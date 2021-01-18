import Layout from '@/layout/index'
// 设备管理--中控列表、设备列表、控制数据表、检测数据表、区域
const controlsRouter = {
  path: '/controls',
  component: Layout,
  redirect: '/controls',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'star',
    icon: 'star'
  },
  children: [{
    path: 'control',
    component: () => import('@/views/control'),
    name: 'Control',
    meta: {
      title: 'Control'
    }
  },
  {
    path: 'Controlword',
    component: () => import('@/views/controlword/index'),
    name: 'Controlword',
    meta: {
      title: 'Controlword',
      envRole: 'serve'
    }
  },
  {
    path: 'newPi',
    component: () => import('@/views/control/newPi'),
    name: 'controlnewPi',
    // hidden: true,
    meta: {
      title: 'controlnewPi',
      envRole: 'serve'
    }
  },
  {
    path: 'configControl/:username/:clientId',
    component: () => import('@/views/control/configControl'),
    name: 'configControl',
    hidden: true,
    meta: {
      title: 'configControl'
    }
  },
  {
    path: 'configLora/:clientId',
    component: () => import('@/views/control/configLora'),
    name: 'configLora',
    hidden: true,
    meta: {
      title: 'configLora'
    }
  },
  {
    path: 'simpleIndex/:clientId', // 简单设备配置
    component: () => import('@/views/control/simpleIndex'),
    name: 'simpleConfigIndex',
    hidden: true,
    meta: {
      title: 'simpleConfigIndex'
    }
  },
  {
    path: 'simpleConfig/:hwwId/:clientId', // 简单设备配置
    component: () => import('@/views/control/simpleConfig'),
    name: 'simpleConfig',
    hidden: true,
    meta: {
      title: 'simpleConfig'
    }
  },
  {
    path: 'person', // 简单设备配置
    component: () => import('@/views/person'),
    name: 'person',
    meta: {
      title: '摄像头人员表',
      noRoles: true
    }
  }
  ]
}

export default controlsRouter
