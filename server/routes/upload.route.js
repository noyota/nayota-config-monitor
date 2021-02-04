const BaseRoute = require('./base.route')
const asyncHandler = require('express-async-handler')
const formidable = require('formidable')
const path = require('path')
const fsPromises = require('fs').promises
const ctrl = require('../controllers/upload.controller')

const baseRoute = new BaseRoute('upload', ctrl)

baseRoute.insertRoute = function() {
  this.router.post('/', asyncHandler(upload))
}

baseRoute.getOneRoute = function() {
  this.router.route('/:id').get((req, res) => {
    res.sendFile(path.resolve(`./assets/${req[this.name].path}`))
  })
}
baseRoute.build()

module.exports = baseRoute.router

async function upload(req, res) {
  const form = new formidable.IncomingForm()
  form.keepExtensions = true // 保留扩展名
  const dir = `upload/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
  const abpath = path.resolve('./assets/' + dir)
  await fsPromises.mkdir(abpath, { recursive: true })
  form.uploadDir = abpath
  const { files } = await new Promise((res, rej) => {
    form.parse(req, (err, fields, files) => {
      if (err) rej(err)
      res({ fields, files })
    })
  })

  const file = await ctrl.insert({ name: files.file.name, path: dir + files.file.path.replace(form.uploadDir, ''), type: files.file.type, size: files.file.size, dir: dir })
  res.json({ code: 0, data: file })
}
