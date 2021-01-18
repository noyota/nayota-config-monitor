const BaseRoute = require('./base.route')
const ctrl = require('../controllers/agreement.controller')

const baseRoute = new BaseRoute('agreement', ctrl)

baseRoute.addRoute = function() {
}

baseRoute.build()

module.exports = baseRoute.router

/**
 * 查询协议列表
 * selectAgreement
 * wbb
*/

