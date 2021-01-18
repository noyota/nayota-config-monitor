const EventEmitter = require('events').EventEmitter
// const request = require('request')
const asyncHandler = require('express-async-handler')

class HttpRoute extends EventEmitter {
  constructor(hardwareWord, router) {
    super()
    router.route('/door/sub').post(asyncHandler(async(req, res) => {
      const data = req.body
      const shortAddress = data.info.DeviceID
      this.emit(`node${shortAddress}`, { 0: JSON.stringify(data), 1: data.info.Name })
      res.json({})
    }))
    router.route('/door/packet').post(asyncHandler(async(req, res) => {
      const data = req.body
      const shortAddress = data.info.DeviceID
      this.emit(`node${shortAddress}`, {})
      res.json({})
    }))
  }

  write(model, addr, code, state) {

  }
}

module.exports = HttpRoute
