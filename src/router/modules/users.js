import Layout from '@/layout/index'

const usersRouter = {
  path: '/users',
  component: Layout,
  redirect: '/users',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'user',
    icon: 'user'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/views/user'),
      name: 'User',
      meta: {
        title: 'User'
      }
    },
    {
      path: 'roles',
      component: () => import('@/views/role'),
      name: 'Roles',
      meta: {
        title: 'Roles'
      }
    },
    {
      path: 'oauths',
      component: () => import('@/views/oauth'),
      name: 'Oauths',
      meta: {
        title: 'Oauths',
        envRole: 'serve'
      }
    },
    {
      path: 'oauthRecords',
      component: () => import('@/views/oauthRecord'),
      name: 'OauthRecords',
      meta: {
        title: 'OauthRecords',
        envRole: 'serve'
      }
    }
  ]
}

export default usersRouter
