const BaseRoute = require('./base.route')
const ctrl = require('../controllers/incAddress.controller')
// const asyncHandler = require('express-async-handler')
const baseRoute = new BaseRoute('IncAddress', ctrl)
baseRoute.addRoute = function() {

}
baseRoute.build()


module.exports = baseRoute.router
