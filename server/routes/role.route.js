
const ctrl = require('../controllers/role.controller') // 本控制器
const BaseRoute = require('./base.route') // 其他路由
// 声明
const baseRoute = new BaseRoute('role', ctrl)

baseRoute.build() // 加载

module.exports = baseRoute.router

