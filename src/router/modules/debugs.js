import Layout from '@/layout/index'

const debugsRouter = {
  path: '/debug',
  component: Layout,
  redirect: '/debug',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'bug',
    icon: 'bug'
  },
  children: [
    {
      path: 'mqtt',
      component: () => import('@/views/mqttTest'),
      name: 'mqtt',
      meta: {
        title: 'mqttBug'
      }
    },
    {
      path: 'serialport',
      component: () => import('@/views/portTest'),
      name: 'serialport',
      meta: {
        title: 'serialport'
      }
    }
  ]
}

export default debugsRouter
