const BaseRoute = require('./base.route')
const ctrl = require('../controllers/word.controller')
const baseRoute = new BaseRoute('word', ctrl)
baseRoute.addRoute = function() {
}
baseRoute.build()

module.exports = baseRoute.router
