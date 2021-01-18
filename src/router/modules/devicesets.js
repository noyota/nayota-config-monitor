import Layout from '@/layout/index'
// 设备管理
const devicesetsRouter = {
  path: '/devicesets',
  component: Layout,
  redirect: '/devicesets',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'Equ',
    icon: 'list'
  },
  children: [
    {
      path: 'httpDrive',
      component: () => import('@/views/httpDrive'),
      name: 'HttpDrive',
      meta: {
        title: 'HttpDrive',
        noRoles: true
      }
    },
    {
      path: 'hardware',
      component: () => import('@/views/hardware'),
      name: 'Hardware',
      meta: {
        title: 'Hardware'
      }
    },
    {
      path: 'check',
      component: () => import('@/views/check'),
      name: 'Check',
      meta: {
        title: 'Check'
      }
    },
    {
      path: 'operate',
      component: () => import('@/views/operate'),
      name: 'Operate',
      meta: {
        title: 'Operate '
      }
    }
  ]
}

export default devicesetsRouter
