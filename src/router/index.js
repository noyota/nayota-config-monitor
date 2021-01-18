import Vue from 'vue'
import Router from 'vue-router'
// import settingsRouter from './modules/settings'
// import dashboardsRouter from './modules/dashboards'
// import lorasRouter from './modules/loras'
// import dictionarysRouter from './modules/dictionarys'
// import modelsetsRouter from './modules/modelsets'
// import devicesetsRouter from './modules/devicesets'
// import camerasetsRouter from './modules/camerasets'
// import serialportsRouter from './modules/serialports'
// import debugsRouter from './modules/debugs'
// import datarecordsRouter from './modules/datarecords'
// import controlsRouter from './modules/controls'
// import usersRouter from './modules/users'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if `redirect:noRedirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
    noRoles: true                if set true, the role while not effect
    envRole: 'serve'             系统拥有两种环境角色‘serve’,'pi',当设置对应的环境角色时，这个页面只在对应角色下生效
  }
 */
export const constantRoutes = [
  {
    path: '/redirect', // 重定向
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/authRedirect'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    /** hidden: true,   //菜单栏隐藏**/
    children: [{
      path: 'dashboard',
      component: () => import('@/views/board/board'),
      name: 'Dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true, affix: true }
    }]
  },
  {
    path: '/set',
    component: Layout,
    meta: {
      title: '产品配置',
      icon: 'settings'
    },
    /** hidden: true,   //菜单栏隐藏**/
    children: [
      {
        path: 'setlora',
        component: () => import('@/views/deviceSet/lora'),
        name: 'Lora配置',
        meta: { title: 'Lora配置', icon: 'settings', noCache: true, affix: true }
      },
      {
        path: 'sethard',
        component: () => import('@/views/deviceSet/hard'),
        name: '设备配置',
        meta: { title: '设备配置', icon: 'settings', noCache: true, affix: true }
      },
      {
        path: 'print',
        component: () => import('@/views/deviceSet/print'),
        name: '二维码打印',
        meta: { title: '二维码打印', icon: 'settings', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/files',
    component: Layout,
    /** hidden: true,   //菜单栏隐藏**/
    children: [
      {
        path: 'get',
        component: () => import('@/views/board/files'),
        name: '历史记录',
        meta: { title: '历史记录', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/modelsets',
    component: Layout,
    meta: {
      title: 'modelsets',
      icon: 'example'
    },
    children: [
      {
        path: 'deviceword',
        component: () => import('@/views/deviceword'),
        name: 'Deviceword',
        meta: {
          title: 'Deviceword'
        }
      }, {
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
      }, {
        path: 'incAddress',
        component: () => import('@/views/incAddress'),
        name: 'IncAddress',
        meta: {
          title: 'IncAddress'
        }
      }
    ]
  }
]

export const asyncRoutes = [
  // 图表
  // dashboardsRouter,
  // // 中控管理
  // controlsRouter,
  // // LORA管理
  // lorasRouter,
  // // 设备管理
  // devicesetsRouter,
  // // 字典管理
  // dictionarysRouter,
  // // 模型管理
  // modelsetsRouter,
  // // 摄像头管理
  // camerasetsRouter,
  // 数据记录管理
  // datarecordsRouter,
  // // 串口通讯
  // // serialportsRouter,
  // // 调试
  // debugsRouter,
  // // 用户管理
  // usersRouter,
  // // 系统设置
  // settingsRouter,
  {
    path: '*', redirect: '/404', hidden: true,
    meta: {
      noRoles: true
    }
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
