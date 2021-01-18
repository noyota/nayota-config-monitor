import Layout from '@/layout/index'
// 配置管理
const dictionarysRouter = {
  path: '/dictionarys',
  component: Layout,
  redirect: '/dictionarys',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'component',
    icon: 'component'
  },
  children: [
    {
      path: 'displayArea',
      component: () => import('@/views/displayArea'),
      name: 'DisplayArea',
      meta: {
        title: 'DisplayArea'
      }
    }, {
      path: 'displayAreaClass',
      component: () => import('@/views/displayAreaClass'),
      name: 'DisplayAreaClass',
      meta: {
        title: 'displayAreaClass'
      }
    },
    {
      path: 'dataShowBoard',
      component: () => import('@/views/dataShowBoard'),
      name: 'DataShowBoard',
      meta: {
        title: 'dataShowBoard'
      }
    },
    {
      path: 'scene',
      component: () => import('@/views/scene'),
      name: 'Scene',
      meta: {
        title: 'Scene'
      }
    }, {
      path: 'smart',
      component: () => import('@/views/smart'),
      name: 'Smart',
      meta: {
        title: 'Smart'
      }
    },
    {
      path: 'ruleRecord',
      component: () => import('@/views/ruleRecord'),
      name: 'ruleRecord',
      meta: {
        title: 'ruleRecord'
      }
    }
  ]
}

export default dictionarysRouter
