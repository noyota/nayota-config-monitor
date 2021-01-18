
const asyncHandler = require('express-async-handler')
const userCtrl = require('../controllers/user.controller') // 本控制器
const routerCtrl = require('../controllers/router.controller')// 其他控制器
const BaseRoute = require('./base.route')

const baseRoute = new BaseRoute('userInfo', userCtrl)
baseRoute.addRoute = function() {
  this.router.get('/info', info)
  this.router.get('/check', check)
  this.router.get('/tree', asyncHandler(tree))
}

baseRoute.build()

module.exports = baseRoute.router

/**
 * @api {get} /users 用户列表
 * @apiDescription 用户列表
 * @apiName 用户数组查询
 * @apiGroup User
 * @apiHeader (Auth) {String} Authorization Authorization value.
 * @apiParam {string} username 用户名
 * @apiSuccess  rows 返回用户列表
 * @apiSuccess  total 返回用户总数
 * @apiSuccessExample {json} Success-Response:
 *  {"code":0,data:{total:0,rows:[]}}
 * @apiSampleRequest http://localhost:4042/api-v1/users
 * @apiVersion 1.0.0
 */

/**
 * @api {get} /users/info 用户信息
 * @apiDescription 当前登录用户完整信息
 * @apiName 用户信息
 * @apiGroup User
 * @apiHeader (Auth) {String} Authorization Authorization value
 * @apiSuccess  data 返回用户信息
 * @apiSuccessExample {json} Success-Response:
 *  {"code":0,data:{}}
 * @apiSampleRequest http://localhost:4042/api-v1/users/info
 * @apiVersion 1.0.0
 */
async function info(req, res) {
  if (req.user.username === 'admin' || (req.user.roles != null && req.user.roles.some(role => role.name === 'admin'))) {
    req.user.roles = ['admin']
    res.json({ code: 0, data: req.user })
  } else {
    const routers = await routerCtrl.list({ type: 'menu', roles: { $in: req.user.roles }, lean: true })
    req.user.routers = routers
    res.json({ code: 0, data: req.user })
  }
}
async function check(req, res) {
  const data = await userCtrl.checkUser(req.query)
  res.json({ code: 0, data: data })
}
async function tree(req, res) {
  const data = await userCtrl.tree([{
    label: 'trueName',
    model: 'User'
  }], req.user)
  res.json({ code: 0, data: data })
}
