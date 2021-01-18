const ctrl = require('../controllers/hardwareword.controller')
const BaseRoute = require('./base.route')
const asyncHandler = require('express-async-handler')
const baseRoute = new BaseRoute('hardwareWord', ctrl)

baseRoute.addRoute = function() {
  this.router.get('/img', asyncHandler(downHwwImg))
  this.router.get('/hardwareWordCode', asyncHandler(hardwareWordCode))
}
baseRoute.build()

module.exports = baseRoute.router

async function hardwareWordCode(req, res) {
  const result = await ctrl.hardwareWordCode(req.query)

  console.log(result, '----')
}

async function downHwwImg(req, res) {
  await ctrl.loadImg()
  res.json({ code: 0, message: '下载完成' })
}
