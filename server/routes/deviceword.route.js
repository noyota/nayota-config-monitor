const ctrl = require('../controllers/deviceword.controller')
const BaseRoute = require('./base.route')
// const asyncHandler = require('express-async-handler')
const baseRoute = new BaseRoute('deviceWord', ctrl)

baseRoute.addRoute = function() {
}
baseRoute.build()

module.exports = baseRoute.router

