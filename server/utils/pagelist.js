const mongoose = require('mongoose')

module.exports = {
  getPageList,
  getPageLimit,
  getPageNoTotal
}

/**
 * 少量数据的表
 * @param Model
 * @param currentPage
 * @param pageSize
 * @param conditions
 * @param fields
 * @param options
 * @param populate
 * @returns {Promise<{total, rows: *}>}
 */
async function getPageList(Model, currentPage = 1, pageSize = 100, conditions = {}, fields, options = {}, populate = []) {
  if (typeof Model !== 'function') {
    throw new TypeError('Model is not a function')
  }
  if (!(Model.prototype instanceof mongoose.Model)) {
    throw new TypeError('Model is not a mongoose.Model')
  }
  pageSize = Number(pageSize)
  const StartLine = (currentPage - 1) * pageSize
  const total = await Model.countDocuments(conditions).exec()
  const q = Model.find(conditions, fields, options).limit(pageSize).skip(StartLine)
  for (const x in populate) {
    q.populate(populate[x])
  }
  const rows = await q.exec()
  return { total, rows }
}

/**
 * 限制最多加载50000条数据
 * 在一些记录表将会有很多的数据，同个搜索条件下大量的历史并没有查看的意义
 * 应该使用更全面的搜索条件来搜索数据，这样可以减轻mongodb分页的压力
 * 单次查询不超过5000条数据 防止过多数据传输
 * @param Model
 * @param currentPage
 * @param pageSize
 * @param conditions
 * @param fields
 * @param options
 * @param populate
 * @returns {Promise<{total, rows: *}>}
 */
async function getPageLimit(Model, currentPage = 1, pageSize = 5000, conditions = {}, fields, options = {}, populate = []) {
  if (typeof Model !== 'function') {
    throw new TypeError('Model is not a function')
  }
  if (!(Model.prototype instanceof mongoose.Model)) {
    throw new TypeError('Model is not a mongoose.Model')
  }
  pageSize = Number(pageSize)
  const StartLine = (currentPage - 1) * pageSize
  let total = await Model.countDocuments(conditions).exec()
  if (total > 50000)total = 50000
  const q = Model.find(conditions, fields, options).limit(pageSize).skip(StartLine)
  for (const x in populate) {
    q.populate(populate[x])
  }
  const rows = await q.exec()
  return { total, rows }
}

// 不显示页码 更高的查询性能
async function getPageNoTotal(Model, currentPage = 1, pageSize = 10, conditions = {}, fields, options = {}, populate = []) {
  if (typeof Model !== 'function') {
    throw new TypeError('Model is not a function')
  }
  if (!(Model.prototype instanceof mongoose.Model)) {
    throw new TypeError('Model is not a mongoose.Model')
  }
  pageSize = Number(pageSize)
  const StartLine = (currentPage - 1) * pageSize
  const q = Model.find(conditions, fields, options).limit(pageSize).skip(StartLine)
  for (const x in populate) {
    q.populate(populate[x])
  }
  const rows = await q.exec()
  return { rows }
}
