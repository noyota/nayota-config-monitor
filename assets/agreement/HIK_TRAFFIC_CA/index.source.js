const EventEmitter = require('events').EventEmitter
const asyncHandler = require('express-async-handler')
const formidable = require('formidable')
const request = require('request')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const xml2js = require('xml2js')
const XLSX = require('xlsx')
const gm = require('gm')
const imageMagick = gm.subClass({ imageMagick: true })
const SDK = require(path.resolve('./server/utils/hik-camera-sdk.js'))
const parseString = new xml2js.Parser({ explicitArray: false }).parseStringPromise
const mongoose = require('mongoose')
const Roster = mongoose.model('Roster')

class HttpRoute extends EventEmitter {
  constructor(hardwareWord, router) {
    super()
    router.route('/hik-traffic-ca/records').post(asyncHandler(async(req, res) => {
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
      // console.log(files['anpr.xml'])
      const result = await fsPromises.readFile(files['anpr.xml'].path)
      // console.log(result.toString())
      const data = await parseString(result)
      // console.log(data)
      const { ipAddress, macAddress, channelID, dateTime, activePostCount, eventType, eventState, eventDescription, ANPR } = data.EventNotificationAlert
      const { country, licensePlate, direction, confidenceLevel, plateType, plateColor, licenseBright, vehicleInfo, pictureInfoList, originalLicensePlate } = ANPR
      console.log(macAddress, country, licensePlate, direction, confidenceLevel, plateType, plateColor, activePostCount, eventType, eventState, eventDescription, licenseBright, vehicleInfo, pictureInfoList, originalLicensePlate)
      // console.log(files['detectionPicture.jpg'])
      const roster = await Roster.findOne({ 'value.车牌': licensePlate })
      let type = 2
      if (roster != null) type = parseInt(roster.value['黑白名单'])
      // 视频和图片上传资源服务器
      const formData = {}
      formData.file = fs.createReadStream(files['detectionPicture.jpg'].path)
      // imageMagick(files['detectionPicture.jpg'].path).save(abpath + '/dist.jpg')
      const res_server = process.env.RESOURCE_SERVER
      const imagePath = await new Promise((res, rej) => {
        request.post({ url: res_server + '/api/uploads', formData: formData }, function optionalCallback(err, httpResponse, body) {
          if (err) {
            console.log('upload failed:' + err)
            return rej(files['detectionPicture.jpg'].path)
          }
          // 成功上传文件后上传记录
          body = JSON.parse(body)
          res(res_server + body.data)
        })
      })
      const name = new Date().getTime() + '_platePicture.jpg'
      const out_path = abpath + '/' + name
      let x, y, width, height
      let smallLocalPath = ''
      let smallPath = ''
      if (pictureInfoList.pictureInfo.length > 1) {
        x = pictureInfoList.pictureInfo[1].plateRect.X
        y = pictureInfoList.pictureInfo[1].plateRect.Y
        width = pictureInfoList.pictureInfo[1].plateRect.width
        height = pictureInfoList.pictureInfo[1].plateRect.height
        smallLocalPath = await new Promise((res, rej) => {
          imageMagick(files['detectionPicture.jpg'].path).crop(width, height, x, y).write(out_path, function(err) {
            if (err) {
              return rej(400)
            }
            res(out_path)
          })
        })
        const formData2 = {}
        if (smallLocalPath !== 400) {
          formData2.file = fs.createReadStream(smallLocalPath)
          smallPath = await new Promise((res, rej) => {
            request.post({ url: res_server + '/api/uploads', formData: formData2 }, async function optionalCallback(err, httpResponse, body) {
              if (err) {
                return rej(smallLocalPath)
              }
              // 成功上传文件后上传记录
              body = JSON.parse(body)
              res(res_server + body.data)
            })
          })
        }
      }
      if (imagePath.indexOf(res_server) > -1) {
        await fsPromises.unlink(path.resolve(files['detectionPicture.jpg'].path))
      }
      this.emit(`node${macAddress}`, { 0: JSON.stringify({ ipAddress, macAddress, channelID, dateTime, country, licensePlate, plateType, plateColor, type, direction, confidenceLevel, plateRect: pictureInfoList.pictureInfo.length > 1 ? pictureInfoList.pictureInfo[1].plateRect : null, image: imagePath, vehicle_body: vehicleInfo.vehileModel, vehicle_mark: vehicleInfo.vehileType, vehicle_color: vehicleInfo.color, smallPath: smallPath }), 1: licensePlate, 2: type, 3: imagePath, 4: smallPath })
      res.send('success')
    }))
  }

  // 配置回调地址
  async config(model) {
    const username = model.attribute.filter(item => item.key === 'username')[0].value
    const password = model.attribute.filter(item => item.key === 'password')[0].value
    const channel = model.attribute.filter(item => item.key === 'channel')[0].value
    const ip = model.attribute.filter(item => item.key === 'ip')[0].value
    const port = model.attribute.filter(item => item.key === 'port')[0].value
    const info = {
      url: model.url,
      username,
      password,
      channel: {
        id: channel
      }
    }
    const sdk = new SDK(info)
    await sdk.setEventHttpHost(ip, port, '/http-api/hik-traffic-ca/records')
    await sdk.setAlarmHttpPushProtocol()
    return
  }

  /**
   * 导入
   * @param model 设备对象
   * @param code 导入状态-值-标记
   * @param data 导入数据
   */
  async import(model, code, data) {
    const username = model.attribute.filter(item => item.key === 'username')[0].value
    const password = model.attribute.filter(item => item.key === 'password')[0].value
    const channel = model.attribute.filter(item => item.key === 'channel')[0].value
    const info = {
      url: model.url,
      username,
      password,
      channel: {
        id: channel
      }
    }
    const sdk = new SDK(info)
    const result = await HttpRoute.rosterEncode(data)
    await sdk.setLicensePlateAuditData(result.buffer)
    return
  }

  // 转换成导入文件 返回buffer 和fileName
  static async rosterEncode(data) {
    data = data.map((item, index) => {
      return {
        'No.': index,
        'Plate No.': item.value['车牌'],
        'Group(0 black list, 1 white list)': item.value['黑白名单'],
        'Expiry Date (Format: YYYY-MM-DD, e.g., 2017-12-07)': item.value['有效日期']
      }
    })
    const ws = XLSX.utils.json_to_sheet(data, { header: ['No.', 'Plate No.', 'Group(0 black list, 1 white list)', 'Expiry Date (Format: YYYY-MM-DD, e.g., 2017-12-07)'] })
    const workbook = {
      'SheetNames': ['sheet1'],
      'Sheets': {
        'sheet1': ws
      }
    }
    var buffer = XLSX.write(workbook, { bookType: 'biff8', type: 'buffer' })
    return { fileName: 'plate.xls', buffer }
  }

  // 导出文件转换成数据
  static async rosterDecode(data) {
    const wk = XLSX.read(data)
    const result = XLSX.utils.sheet_to_json(wk.Sheets.sheet1)
    return result.map(item => {
      return {
        value: {
          '车牌': item['Plate No.'],
          '黑白名单': item['Group(0 black list, 1 white list)'],
          '有效日期': item['Expiry Date (Format: YYYY-MM-DD, e.g., 2017-12-07)']
        }
      }
    })
  }

  /**
   * 导出
   * @param model 设备对象
   * @param code 导出状态-值-标记
   * @param data 导出数据
   */
  async export(model, code) {
    const username = model.attribute.filter(item => item.key === 'username')[0].value
    const password = model.attribute.filter(item => item.key === 'password')[0].value
    const channel = model.attribute.filter(item => item.key === 'channel')[0].value
    const info = {
      url: model.url,
      username,
      password,
      channel: {
        id: channel
      }
    }
    const sdk = new SDK(info)
    const result = await sdk.getLicensePlateAuditData()
    console.log(result)
  }
}

module.exports = HttpRoute
