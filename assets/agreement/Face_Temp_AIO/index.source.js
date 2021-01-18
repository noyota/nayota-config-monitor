const EventEmitter = require('events').EventEmitter
const request = require('request')
const asyncHandler = require('express-async-handler')

class HttpRoute extends EventEmitter {
  constructor(hardwareWord, router) {
    super()
    router.route('/face-temp-aio/snap').post(asyncHandler(async(req, res) => {
      const data = req.body
      const shortAddress = data.info.DeviceID
      this.emit(`node${shortAddress}`, { '10': JSON.stringify(data), '11': data.SanpPic, '12': data.info.Temperature, '13': data.info.CreateTime })
      res.json({ 'code': 200, 'desc': 'OK' })
    }))

    router.route('/face-temp-aio/verify').post(asyncHandler(async(req, res) => {
      const data = req.body
      const shortAddress = data.info.DeviceID
      this.emit(`node${shortAddress}`, { '0': JSON.stringify(data), '1': data.info.Name, '2': data.info.PersonType, '11': data.SanpPic })
      res.json({ 'code': 200, 'desc': 'OK' })
    }))

    router.route('/face-temp-aio/heartbeat').post(asyncHandler(async(req, res) => {
      const data = req.body
      const shortAddress = data.info.DeviceID
      this.emit(`node${shortAddress}`, {})
      res.json({ 'code': 200, 'desc': 'OK' })
    }))
  }

  // 配置
  async config(model) {
    const SubscribeAddr = model.attribute.filter(item => item.key === 'SubscribeAddr')[0].value
    const Topics = model.attribute.filter(item => item.key === 'Topics')[0].value.split(',')
    const SubscribeUrl = {
      'Snap': '/http-api/face-temp-aio/snap',
      'Verify': '/http-api/face-temp-aio/verify',
      'HeartBeat': '/http-api/face-temp-aio/heartbeat'
    }
    const sendInfo = {
      'operator': 'Subscribe',
      info: {
        DeviceID: model.shortAddress,
        Num: Topics.length,
        Topics,
        SubscribeAddr,
        SubscribeUrl,
        'ResumefromBreakpoint': 1, // 开启断点续传
        Auth: 'none'
      }
    }
    const result = await new Promise(async(res, rej) => {
      request.post({
        url: `${model.url}/action/Subscribe`,
        headers: {
          Authorization: 'Basic YWRtaW46YWRtaW4='
        },
        body: JSON.stringify(sendInfo)
      }, (err, respone, body) => {
        if (err) {
          rej({ message: '发送失败' })
        } else if (JSON.parse(body).info.Result === 'Fail') {
          rej({ message: JSON.parse(body).info.Detail })
        } else {
          res('发送成功')
        }
      })
    })
    console.log(result)
    return
  }

  // 导入
  async import(model, code, data) {
    try {
      await new Promise(async(res, rej) => {
        request.post({
          url: `${model.url}/action/DeletePerson`,
          headers: {
            Authorization: 'Basic YWRtaW46YWRtaW4='
          },
          body: JSON.stringify({
            'operator': 'DeletePerson',
            'info': {
              'DeviceID': model.shortAddress,
              'TotalNum': data.length,
              IdType: 2,
              PersonUUID: data.map(item => item._id.toString())
            }
          })
        }, (err, respone, body) => {
          console.log(body)
          if (err) {
            rej({ message: '删除失败' })
          } else if (JSON.parse(body).info.Result === 'Fail') {
            rej({ message: JSON.parse(body).info.Detail })
          } else {
            res('删除成功')
          }
        })
      })
    } catch (e) {
      console.log('有新名单')
    }
    const sendInfo = {
      'operator': 'AddPersons',
      DeviceID: model.shortAddress,
      Total: data.length
    }

    data.forEach((item, index) => {
      sendInfo['Personinfo_' + index] = {
        'PersonType': item.value['PersonType'], // 黑白名单
        'Name': item.value['Name'],
        'Gender': item.value['Gender'], // 性别
        IdType: 2,
        PersonUUID: item._id.toString(), // id
        picinfo: item.value['picinfo'],
        Tempvalid: 0,
        'Nation': 0,
        CardType: 0,
        IdCard: '2222222',
        Notes: 'nayota'
      }
    })
    console.log(sendInfo)
    const result = await new Promise(async(res, rej) => {
      request.post({
        url: `${model.url}/action/AddPersons`,
        headers: {
          Authorization: 'Basic YWRtaW46YWRtaW4='
        },
        body: JSON.stringify(sendInfo)
      }, (err, respone, body) => {
        console.log(body)
        if (err) {
          rej({ message: '发送失败' })
        } else if (JSON.parse(body).info.Result === 'Fail') {
          rej({ message: JSON.parse(body).info.Detail })
        } else {
          res('发送成功')
        }
      })
    })
    console.log(result)
    return
  }
}

module.exports = HttpRoute
