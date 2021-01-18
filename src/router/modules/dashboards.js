import Layout from '@/layout/index'

const dashboardsRouter = {
  path: '/dashboards',
  component: Layout,
  redirect: '/dashboards',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'international',
    icon: 'international'
  },
  children: [
    {
      path: 'controls/simpleIndex/my',
      component: () => import('@/views/control/simpleIndex'),
      name: 'SimpleIndex',
      meta: {
        title: 'SimpleIndex',
        envRole: 'pi'
      }
    },
    {
      path: 'board',
      component: () => import('@/views/board'),
      name: 'Boardindex',
      meta: {
        title: 'Boardindex'
      }
    }, {
      path: 'datashowboard',
      component: () => import('@/views/board/dataShowBoard'),
      hidden: true,
      name: 'DataShowBoard',
      meta: {
        title: 'DataShowBoard'
      }
    },
    {
      path: 'datashowboardlist',
      component: () => import('@/views/board/dataShowBoardList'),
      name: 'DataShowBoardList',
      meta: {
        title: 'dataShowBoardList'
      }
    },
    {
      path: 'hardware/indexQk',
      component: () => import('@/views/hardware/indexQk'),
      name: 'HardwareQk',
      meta: {
        title: 'HardwareQk'
      }
    }]
}

export default dashboardsRouter
