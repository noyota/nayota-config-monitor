const express = require('express')
// new route require append
const loraMasterRoutes = require('./loraMaster.route')
const userRoutes = require('./user.route')

const authRoutes = require('./auth.route')
const wordRoutes = require('./word.route')
const wordTypeRoutes = require('./wordType.route')
const roleRoutes = require('./role.route')
const agreementRoutes = require('./agreement.route')
const hardwarewordRoutes = require('./hardwareword.route')
const routerRoutes = require('./router.route')
const devicewordRoutes = require('./deviceword.route')
const incAddressRoutes = require('./incAddress.route')
// new route require append
const passport = require('passport')
const Policies = require('../middleware/policies')
const router = express.Router() // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
  res.send('OK')
})

router.use('/auth', authRoutes)
router.use(passport.authenticate('jwt', { session: false }))
router.use('/users', userRoutes)
router.use('/roles', roleRoutes)
router.use('/routers', routerRoutes)
router.use('/lora-masters', loraMasterRoutes)
router.use('/agreement', agreementRoutes)
router.use('/hardware-word', hardwarewordRoutes)
router.use('/words', wordRoutes)
router.use('/word-types', wordTypeRoutes)
router.use('/device-word', devicewordRoutes)
router.use('/inc-address', incAddressRoutes)
module.exports = router

const policies = new Policies()
// 权限开启
policies.init().then(() => {
  loop(userRoutes, '/api-v1/user')
  loop(roleRoutes, '/api-v1/roles')
  loop(agreementRoutes, '/api/agreement')
  loop(hardwarewordRoutes, '/api/hardwareword')
  // loop(controlwordRoutes, '/api/controlword')
  loop(routerRoutes, '/api-v1/routers')
  loop(routerRoutes, '/api-v1/words')
  loop(routerRoutes, '/api-v1/word-types')
})
/**
 * 遍历 生成路由权限管理
 * 插入权限管理
 * @type {Layer}
 */
const Layer = require('express/lib/router/layer')
function loop(router, path) {
  const addLayer = []
  router.stack.map((layer, index) => {
    if (layer.method && policies.hasCheck(path, layer.method)) {
      // 创建权限管理中间件
      const l = Layer('/', {}, function(req, res, next) {
        policies.isAllowed(req.user.roles, path, req.method.toLowerCase(), function(err, allowd) {
          if (allowd) {
            next()
          } else if (err) {
            next(err)
          } else {
            next(new Error('User is not authorized'))
          }
        })
      })
      l.method = layer.method
      addLayer.unshift({ index, l })
    } else if (layer.route) {
      loop(layer.route, path + layer.route.path)
    } else if (layer.handle.name === 'router') {
      loop(layer.handle, path)
    }
  })
  // 插入权限管理
  addLayer.map(add => {
    router.stack.splice(add.index, 0, add.l)
  })
}

