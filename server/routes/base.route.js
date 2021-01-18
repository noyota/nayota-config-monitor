/**
 * Created by lifeng on 19/03/21.
 * 这是一个用于敏捷开发的简单route生成器
 * 旨在将统一模式的rest api结构CRUD 统一生成路由
 */
const express = require('express')
const asyncHandler = require('express-async-handler')

module.exports = class GeneratorRoute {
  constructor(name, ctrl) {
    if (typeof ctrl !== 'object') {
      throw new Error('传入的controller参数错误')
    }
    this.name = name
    this.ctrl = ctrl
    this.needCtrl = []
    this.router = express.Router()
  }

  /**
   * 简单格式的路由转函数
   * @param fn 函数
   * @param param_key 传递的参数query body params
   * @returns {Function}
   */
  static simpleRoute(fn, param_key) {
    return async(req, res) => {
      const result = await fn(req[param_key])
      res.json({ code: 0, data: result })
    }
  }

  /**
   * @api {post} /${models} 通用列表查询
   * @apiDescription 多数据查询的通用api接口
   * @apiName list
   * @apiGroup Default
   * @apiHeader (Auth) {String} Authorization Authorization value.
   * @apiParam {string} [label] 模糊查询字段
   * @apiParam {string} [search] 模糊查询值
   * @apiParam {string} [model字段名] 对应字段查询,对应字段的精准查询条件例如username:'admin'
   * @apiParam {string} [time] 时间范围字段查询
   * @apiParam {String[]} [range] 时间反馈，开始时间到结束时间
   * @apiParam {number} [page] 分页第几页
   * @apiParam {number} [limit] 单页几条数据
   * @apiParam {string} [sort] 排序
   * @apiParam {string} [select] 选择查询部分字段 字段前加-表示选择不查询此字段
   * @apiParam {boolean} [autopopulate=true] 自动关联数据，部分字段自动联表查询，设置这个值可关闭自动联表查询
   * @apiSuccess  total 返回查询到的数据总数
   * @apiSuccess  rows 返回查询到的数据队列
   * @apiSuccessExample {json} Success-Response:
   *  {"code":0,data:{total:0,rows:[]}}
   * @apiSampleRequest off
   * @apiVersion 1.0.0
   */
  listRoute() {
    this.needCtrl.push(this.ctrl.list)
    this.router.route('/').get(asyncHandler(async(req, res) => {
      if (req.query.creator === undefined && req.user) {
        req.query.creator = req.user._id
      }
      const list = await this.ctrl.list(req.query)
      res.json({ code: 0, data: list })
    }))
  }

  /**
   * @api {post} /${models} 通用单数据新增
   * @apiDescription 新增单条数据
   * @apiName insert
   * @apiGroup Default
   * @apiHeader (Auth) {String} Authorization Authorization value.
   * @apiParam {Object} model 要新增的对象
   * @apiSuccessExample {json} Success-Response:
   *  {"code":0,data:{}}
   * @apiSampleRequest off
   * @apiVersion 1.0.0
   */
  insertRoute() {
    this.needCtrl.push(this.ctrl.insert)
    this.router.route('/').post(asyncHandler(async(req, res) => {
      if (req.body.creator === undefined && req.user) {
        req.body.creator = req.user
      }
      const model = await this.ctrl.insert(req.body)
      res.json({ code: 0, data: model })
    }))
  }

  /**
   * @api {delete} /${models} 通用删除多条数据
   * @apiDescription 删除多条数据
   * @apiName deletes
   * @apiGroup Default
   * @apiHeader (Auth) {String} Authorization Authorization value.
   * @apiParam {String[]} body 要删除的_id数组
   * @apiSuccessExample {json} Success-Response:
   *  {"code":0,message:"complete"}
   * @apiSampleRequest off
   * @apiVersion 1.0.0
   */
  deletesRoute() {
    this.needCtrl.push(this.ctrl.removes)
    this.router.route('/').delete(asyncHandler(async(req, res) => {
      await this.ctrl.removes(req.body)
      res.json({ code: 0, message: 'complete' })
    }))
  }

  /**
   * @api {get} /${models}/:id 通用单数据读取
   * @apiDescription 查询单条数据
   * @apiName getOne
   * @apiGroup Default
   * @apiHeader (Auth) {String} Authorization Authorization value.
   * @apiParam {string} id model的_id
   * @apiSuccess  data 返回查询到的数据
   * @apiSuccessExample {json} Success-Response:
   *  {"code":0,data:{}}
   * @apiSampleRequest off
   * @apiVersion 1.0.0
   */
  getOneRoute() {
    this.router.route('/:id').get((req, res) => {
      res.json({ code: 0, data: req[this.name] })
    })
  }

  /**
   * @api {put} /${models}/:id 通用单数据更新
   * @apiDescription 更新单条数据
   * @apiName updateOne
   * @apiGroup Default
   * @apiHeader (Auth) {String} Authorization Authorization value.
   * @apiParam {string} id model的_id
   * @apiParam {Object} model 修改后的对象
   * @apiSuccessExample {json} Success-Response:
   *  {"code":0,data:{}}
   * @apiSampleRequest off
   * @apiVersion 1.0.0
   */
  updateOneRoute() {
    this.needCtrl.push(this.ctrl.update)
    this.router.route('/:id').put(asyncHandler(async(req, res) => {
      const model = await this.ctrl.update(req[this.name], req.body)
      res.json({ code: 0, data: model })
    }
    ))
  }

  /**
   * @api {delete} /${models}/:id 通用单数据删除
   * @apiDescription 删除单条数据
   * @apiName delete
   * @apiGroup Default
   * @apiHeader (Auth) {String} Authorization Authorization value.
   * @apiParam {string} id model的_id
   * @apiSuccessExample {json} Success-Response:
   *  {"code":0,message:"complete"}
   * @apiSampleRequest off
   * @apiVersion 1.0.0
   */
  deleteOneRoute() {
    this.needCtrl.push(this.ctrl.remove)
    this.router.route('/:id').delete(asyncHandler(async(req, res) => {
      if (req[this.name] != null) await this.ctrl.remove(req[this.name])
      res.json({ code: 0, data: req[this.name] })
    }))
  }

  paramId() {
    this.needCtrl.push(this.ctrl.getById)
    this.router.param('id', (req, res, next, id) => {
      this.ctrl.getById(id, null, { autopopulate: false })
        .then(res => {
          req[this.name] = res
          next()
        }).catch(err => {
          next(err)
        })
    })
  }

  /**
   * 放在所有路由之前
   */
  addBeforeRoute() {

  }
  /**
   * 放在/ 路由之后 /:id路由之前
   */
  addRoute() {

  }

  /**
   * 放在所有路由之后
   */
  addAfterRoute() {

  }

  /**
   * 添加新的Param解析
   */
  addParam() {

  }

  /**
   * 构建路由运行
   * @param options  include 和 exclude只能输入一个 include优先
   * include 使用这些路由
   * exclude 数组 排除某些默认路由 list insert deletes get update delete
   */
  build(options = {}) {
    const { include, exclude } = options
    let routes = new Set(['list', 'insert', 'delete', 'deletes', 'get', 'update'])
    if (include) {
      routes = new Set(include)
    } else if (exclude) {
      exclude.forEach(item => routes.delete(item))
    }
    this.addBeforeRoute()
    if (routes.has('list')) this.listRoute()
    if (routes.has('insert')) this.insertRoute()
    if (routes.has('deletes')) this.deletesRoute()
    this.addRoute()
    if (routes.has('get')) this.getOneRoute()
    if (routes.has('update')) this.updateOneRoute()
    if (routes.has('delete')) this.deleteOneRoute()
    this.addAfterRoute()
    this.addParam()
    this.paramId()
    this.needCtrl.map(ctrl => {
      if (ctrl == null || typeof ctrl !== 'function') {
        throw new Error('您传入的controller函数中没有包含所有我需要的函数。请确认传入函数里是否有list.insert,removes,update,remove,getById')
      }
    })
  }
}
