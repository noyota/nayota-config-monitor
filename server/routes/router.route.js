const BaseRoute = require('./base.route')
const ctrl = require('../controllers/router.controller')
const asyncHandler = require('express-async-handler')

const baseRoute = new BaseRoute('router', ctrl)
baseRoute.addRoute = function() {
  this.router.put('/roles-auth', asyncHandler(updateRoles))
  this.router.post('/generator', asyncHandler(generator))
}
baseRoute.build()

/**
 * @api {post} /routers/generator 路由生成器
 * @apiDescription 调用路由生成器生成路由
 * @apiName 路由生成器
 * @apiGroup Router
 * @apiHeader (Auth) {String} Authorization Authorization value.
 * @apiParam {string} name 路由名称（复数）
 * @apiParam {string} filepath 路由文件名
 * @apiSuccessExample {json} Success-Response:
 *  {"code":0,message:"OK"}\
 * @apiVersion 1.0.0
 */
async function generator(req, res) {
  await ctrl.generator(req.body)
  res.send({ code: 0, message: 'OK' })
}

/**
 * @api {put} /routers/roles-auth 路由角色权限
 * @apiDescription 赋予一个角色哪些路由权限
 * @apiName 路由角色权限
 * @apiGroup Router
 * @apiHeader (Auth) {String} Authorization Authorization value.
 * @apiParam {String[]} _ids 给予权限路由的ID
 * @apiParam {String[]} roleId 角色ID
 * @apiSuccessExample {json} Success-Response:
 *  {"code":0,message:"OK"}
 * @apiVersion 1.0.0
 */
async function updateRoles(req, res) {
  await ctrl.updateRoles(req.body._ids, req.body.roleId)
  res.send({ code: 0, message: 'OK' })
}

module.exports = baseRoute.router

/**
 * @api {get} /routers 获取路由列表
 * @apiDescription 获取路由列表 路由结构自动联表成一个树结构数据
 * @apiName 路由列表
 * @apiGroup Router
 * @apiHeader (Auth) {String} Authorization Authorization value.
 * @apiParam {String} level 路由等级，赋值0,只查从树根开始的完整树结构数据
 * @apiParam {Boolean} autopopulate=true 自动联表查询，false后将获得非数结构数据
 * @apiSuccessExample {json} Success-Response:
 *  {"code":0,data:[]}
 * @apiVersion 1.0.1
 */
