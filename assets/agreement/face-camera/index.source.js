const EventEmitter = require('events').EventEmitter
const request = require('request')
const asyncHandler = require('express-async-handler')

class HttpRoute extends EventEmitter {
  constructor(hardwareWord, router) {
    super()
    router.route('/face-camera/records').post(asyncHandler(async(req, res) => {
      const data = JSON.parse(req.body.accessRecord)
      const shortAddress = data.mac
      this.emit(`node${shortAddress}`, { 0: JSON.stringify(data), 1: data.faceId, 2: data.role })
      res.json({})
    }))
  }

  // 配置回调地址
  async config(model) {
    const url = model.attribute.filter(item => item.key === 'url')[0].value
    return await new Promise((res, rej) => {
      request.post({
        url: `${model.url}/linmu/server/url`,
        form: {
          'url': url
        },
        timeout: 5000
      }, function(err, response, body) {
        if (err)rej(err)
        const result = JSON.parse(body)
        if (result.success) {
          res()
        } else {
          rej('参数错误')
        }
      })
    })
  }

  // 写入
  write(model, addr, code, state) {

  }
}

module.exports = HttpRoute
