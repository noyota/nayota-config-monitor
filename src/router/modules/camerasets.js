import Layout from '@/layout/index'
// 摄像头管理--摄像头列表、萤石账号、截屏记录
const camerasetsRouter = {
  path: '/camerasets',
  component: Layout,
  redirect: '/camerasets/ezvizAccount',
  alwaysShow: true, // will always show the root menu
  meta: {
    title: 'eyeOpen',
    icon: 'eye-open'
  },
  children: [
    {
      path: 'ezvizAccount',
      component: () => import('@/views/ezvizAccount'),
      name: 'EzvizAccount',
      meta: {
        title: 'EzvizAccount'
      }
    },
    {
      path: 'camera',
      component: () => import('@/views/camera'),
      name: 'Camera',
      meta: {
        title: 'Camera'
      }
    }, {
      path: 'pictureRecord',
      component: () => import('@/views/pictureRecord'),
      name: 'PictureRecord',
      meta: {
        title: 'PictureRecord'
      }
    }
  ]
}

export default camerasetsRouter
