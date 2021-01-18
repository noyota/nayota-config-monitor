/**
 * @author lifeng
 * @date 19-7-10
 * @Description: 拥有数据操作历史记录和同步的基础controller（增删改） 批量的新增和删除无法记录历史
*/
const mongoose = require('mongoose')
const GeneratorCtrl = require('./generator.controller')
/**
 * 此基类只能被字段中拥有control字段的Model继承
 */
class BaseHasDataSyncCtrl extends GeneratorCtrl {
  /**
   * 构造函数
   * @param modelName model名 首字母大写
   * @param Model
   * @param joiSchema
   * @param neverFields 更新数据 改变不同步的字段名
   */
  constructor(modelName, Model, joiSchema, neverFields) {
    super(Model, joiSchema)
    this.modelName = modelName
    this.neverFields = neverFields || []
  }

  async insert(body, isShb = true) {
    const result = await super.insert(body)
    if (isShb) {
      this._createShb('create', result)
    }
    return result
  }

  /**
   * 更新要处理包含字段和剔除字段
   * @param object
   * @param body
   * @return {Promise<*>}
   */
  async update(object, body) {
    const old = object.toObject()
    const result = await super.update(object, body)
    for (const key in body) {
      if (!body.hasOwnProperty(key) || this.neverFields.includes(key) || this.Model.schema.obj[key] == null) continue
      let oField = old[key]
      let nField = body[key]
      if (oField instanceof Date)oField = oField.toISOString()
      else if (oField instanceof mongoose.Types.ObjectId) {
        if (typeof nField === 'object' && nField._id) {
          nField = nField._id
        }
        oField = oField.toString()
      } else if (typeof oField === 'object')oField = JSON.stringify(oField)
      if (typeof nField === 'object')nField = JSON.stringify(nField)
      if (oField !== nField) {
        this._createShb('update', object, old)
        break
      }
    }
    return result
  }

  async remove(obj, isShb = true) {
    if (isShb) {
      this._createShb('delete', obj, obj)
    }
    return await super.remove(obj)
  }

  createShb(behavior, obj, body) {
    this._createShb(behavior, obj, body)
  }
}

module.exports = BaseHasDataSyncCtrl
