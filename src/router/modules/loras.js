import Layout from '@/layout/index'
// LORA配置--LORA主站、LORA从站
const lorasRouter = {
  path: '/loras',
  component: Layout,
  redirect: '/loras',
  alwaysShow: false, // will always show the root menu
  meta: {
    title: 'loraSet',
    icon: 'link'
  },
  children: [
    {
      path: 'loraMaster',
      component: () => import('@/views/loraMaster'),
      name: 'LoraMaster',
      meta: {
        title: 'LoraMaster'
      }
    },
    {
      path: 'loraSlave',
      component: () => import('@/views/loraSlave'),
      name: 'LoraSlave',
      meta: {
        title: 'LoraSlave'
      }
    }
  ]
}

export default lorasRouter
