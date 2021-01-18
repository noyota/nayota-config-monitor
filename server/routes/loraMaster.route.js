const BaseRoute = require('./base.route')
const ctrl = require('../controllers/loraMaster.controller')
const asyncHandler = require('express-async-handler')
const baseRoute = new BaseRoute('LoraMaster', ctrl)
const fs = require('fs')
const { join } = require('path')
baseRoute.addRoute = function() {
  this.router.get('/tree', asyncHandler(getTree))
  this.router.get('/files', asyncHandler(getFiles))
}
baseRoute.build()

/**
 * @api {get} /lora-masters/tree 获取中控树列表
 * @apiDescription 获取中控树列表
 * @apiName getTree
 * @apiGroup lora-masters
 * @apiHeader (Auth) {String} Authorization Authorization value.
 * @apiSuccess  data 返回查询到的数据
 * @apiSuccessExample {json} Success-Response:
 *  {"code":0,data:{[]}}
 * @apiSampleRequest http://localhost:4043/api-v1/lora-masters/tree
 * @apiVersion 1.0.0
 */
async function getTree(req, res) {
  const slt = await ctrl.tree([{
    model: 'User',
    label: 'trueName',
    children: [{
      model: 'Control',
      label: 'name',
      father: 'creator',
      children: [{
        model: 'LoraMaster',
        label: 'name',
        father: 'control'
      }]
    }]
  }], req.user)
  res.json({ code: 0, data: slt })
}
async function getFiles(req, res) {
  const components = []
  const path = './assets/log'
  function findJsonFile(path) {
    const files = fs.readdirSync(path)
    files.forEach(function(item, index) {
      let fPath = join(path, item)
      const stat = fs.lstatSync(fPath)
      if (stat.isDirectory() === true) {
        findJsonFile(fPath)
      }
      if (stat.isFile() === true) {
        fPath = fPath.replace('assets/', '')
        components.push(fPath)
      }
    })
  }
  findJsonFile(path)
  console.log(components)
  res.json({ code: 0, data: components })
}
module.exports = baseRoute.router
