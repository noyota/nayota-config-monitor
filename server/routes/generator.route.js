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
      res.json(result)
    }
  }

  listRoute() {
    this.needCtrl.push(this.ctrl.list)
    this.router.route('/').get(asyncHandler(async(req, res) => {
      // console.log(req.query)
      if (req.query.creator === undefined && req.user) {
        req.query.creator = req.user._id
        this.ctrl.setModel(req.user.username)
        const list = await this.ctrl.list(req.query)
        res.json(list)
      } else {
        const list = await this.ctrl.list(req.query)
        res.json(list)
      }
    }))
  }

  insertRoute() {
    this.needCtrl.push(this.ctrl.insert)
    this.router.route('/').post(asyncHandler(async(req, res) => {
      this.ctrl.setModel(req.user.username)
      req.body.creator = req.user
      const model = await this.ctrl.insert(req.body)
      res.json(model)
    }))
  }

  deletesRoute() {
    this.needCtrl.push(this.ctrl.removes)
    this.router.route('/').delete(asyncHandler(async(req, res) => {
      this.ctrl.setModel(req.user.username)
      await this.ctrl.removes(req.body)
      res.json({ message: 'complete' })
    }))
  }

  getOneRoute() {
    this.router.route('/:id').get((req, res) => {
      this.ctrl.setModel(req.user.username)
      res.json(req.useModel)
    })
  }

  updateOneRoute() {
    this.needCtrl.push(this.ctrl.update)
    this.router.route('/:id').put(asyncHandler(async(req, res) => {
      this.ctrl.setModel(req.user.username)
      const model = this.ctrl.update(req.useModel, req.body)
      res.json(model)
    }
    ))
  }

  deleteOneRoute() {
    this.needCtrl.push(this.ctrl.remove)
    this.router.route('/:id').delete(asyncHandler(async(req, res) => {
      this.ctrl.setModel(req.user.username)
      if (req.useModel != null) await this.ctrl.remove(req.useModel)
      res.json(req.useModel)
    }))
  }

  paramId() {
    this.needCtrl.push(this.ctrl.getById)
    this.router.param('id', asyncHandler(async(req, res, next, id) => {
      this.ctrl.setModel(req.user.username)
      req.useModel = await this.ctrl.getById(id)
      next()
    }))
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
