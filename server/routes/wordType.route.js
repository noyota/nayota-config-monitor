const BaseRoute = require('./base.route')
const ctrl = require('../controllers/wordType.controller')
const asyncHandler = require('express-async-handler')
const baseRoute = new BaseRoute('wordType', ctrl)
baseRoute.addRoute = function() {
  this.router.get('/code', asyncHandler(findCode))
}
baseRoute.build()

module.exports = baseRoute.router

/**
 * @api {get} /word-types/code 获取数据
 * @apiPrivate
 * @apiDescription 根据输入的id来得到该id下的所有数据
 * @apiName findCode
 * @apiGroup WordType
 * @apiHeader (Auth) {String} Authorization Authorization value
 * @apiParam {ObjectId} wordType 图标模板
 * @apiSuccess  data 返回用户信息
 * @apiSuccessExample {json} Success-Response:
 *  {"code":0,data:{}}
 * @apiSampleRequest http://localhost:4043/api-v1/word-types/code
 * @apiVersion 1.0.0
 */
async function findCode(req, res) {
  const slt = await ctrl.findCode(req.query.wordType)
  res.json({ code: 0, data: slt })
}
