const EventEmitter = require('events').EventEmitter
// const request = require('request')
const asyncHandler = require('express-async-handler')

class HttpRoute extends EventEmitter {
  constructor(hardwareWord, router) {
    super()
    router.route(`/${hardwareWord.code}/info`).post(asyncHandler(async(req, res) => {
      const data = req.body
      const shortAddress = data.deviceId
      this.emit(`node${shortAddress}`, { 0: JSON.stringify(data), 1: data.name, 2: data.temp, 3: data.address, 4: data.warning ? 1 : 0 })
      res.json({})
    }))
    router.route(`${hardwareWord.code}/packet`).post(asyncHandler(async(req, res) => {
      const data = req.body
      const shortAddress = data.deviceId
      this.emit(`node${shortAddress}`, {})
      res.json({})
    }))
  }
}

module.exports = HttpRoute
