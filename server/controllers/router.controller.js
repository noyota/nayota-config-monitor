const Joi = require('joi')
const mongoose = require('mongoose')
const Router = mongoose.model('Router')
const GeneratorCtrl = require('./generator.controller')

/**
 * 验证
 */
const routerSchema = Joi.object().keys({
  type: Joi.string().required(),
  name: Joi.string().required(),
  path: Joi.string(),
  level: Joi.number(),
  method: Joi.string(),
  desc: Joi.string(),
  roles: Joi.array()
})

class RouterCtrl extends GeneratorCtrl {
// 在这里新加函数或者修改继承的函数

  async list(options) {
    const { label, search, creator, sort, lean, autopopulate = true, ...where } = options
    const opt = { sort, autopopulate: autopopulate !== 'false' }
    if (this.Model.schema.obj.creator) where.creator = creator
    if (label != null && label !== '') {
      where[label] = new RegExp(decodeURI(search), 'i')
    }
    let data = this.Model.find(where, null, opt)
    if (lean) {
      data = data.lean()
    }
    return await data
  }

  // 后端路由生成
  async generator({ filepath, name, fatherId }) {
    try {
      const router = require('../routes/' + filepath)
      this._loop(router, '/api/' + name, fatherId)
    } catch (e) {
      throw new Error('没有这个路径')
    }
  }

  async updateRoles(_ids, roleId) {
    Promise.all([
      this.Model.updateMany({ _id: { $in: _ids }}, { $addToSet: { roles: roleId }}),
      this.Model.updateMany({ _id: { $nin: _ids }}, { $pull: { roles: roleId }})
    ])
  }

  async _loop(router, path, fatherId) {
    console.log(fatherId)
    const routerPath = new Map()
    router.stack.map(async(layer) => {
      if (layer.method) {
        routerPath.set(path + '_' + layer.method, {
          type: 'api',
          name: path,
          path: path,
          method: layer.method
        })
      } else if (layer.route) {
        await this._loop(layer.route, path + layer.route.path, fatherId)
      } else if (layer.handle.name === 'router') {
        await this._loop(layer.handle, path, fatherId)
      }
    })
    const arr = []
    routerPath.forEach(r => arr.push(this._saveData(r)))
    const _ids = await Promise.all(arr)
    await this.Model.updateOne({ _id: fatherId }, { $pushAll: { children: _ids }})
  }

  async _saveData(r) {
    const o = await Router.findOne({ path: r.path, method: r.method })
    if (o) {
      return o._id
    }
    const router = new Router(r)
    await router.save()
    return router._id
  }
}

module.exports = new RouterCtrl(Router, routerSchema)
