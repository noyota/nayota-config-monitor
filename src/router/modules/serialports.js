import Layout from '@/layout/index'

const serialportsRouter = {
  path: '/serialports',
  component: Layout,
  redirect: '/serialports',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: '串口通讯',
    icon: 'settings'
  },
  children: [

  ]
}

export default serialportsRouter
