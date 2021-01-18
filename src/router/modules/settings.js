import Layout from '@/layout/index'

const settingsRouter = {
  path: '/settings',
  component: Layout,
  redirect: '/settings',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'settings',
    icon: 'settings'
  },
  children: [
    {
      path: 'wordType',
      component: () => import('@/views/wordType'),
      name: 'WordType',
      meta: {
        title: 'WordType'
      }
    }, {
      path: 'word',
      component: () => import('@/views/word'),
      name: 'Word',
      meta: {
        title: 'Word'
      }
    },
    {
      path: 'uiManagement',
      component: () => import('@/views/uiManagement'),
      name: 'UiManagement',
      meta: {
        title: 'UiManagement'
      }
    },
    {
      path: 'router',
      component: () => import('@/views/router'),
      name: 'Router',
      meta: {
        title: 'router'
      }
    },
    {
      path: 'uploadFile',
      component: () => import('@/views/upload'),
      name: 'uploadFile',
      meta: {
        title: 'uploadFile'
      }
    },
    {
      path: 'updategit',
      component: () => import('@/views/updategit'),
      name: 'updategit',
      meta: {
        title: 'updategit',
        envRole: 'pi'
      }
    },
    {
      path: 'package',
      component: () => import('@/views/package'),
      name: 'package',
      meta: {
        title: 'package',
        envRole: 'serve'
      }
    },
    {
      path: 'orderData',
      component: () => import('@/views/orderData'),
      name: 'orderData',
      meta: {
        title: 'orderData',
        envRole: 'serve'
      }
    },
    {
      path: 'superConfig',
      component: () => import('@/views/superConfig'),
      name: 'superConfig',
      meta: {
        title: 'superConfig', // noRoles: true,
        envRole: 'pi'
      }
    }
  ]
}

export default settingsRouter
