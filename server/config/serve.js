'use strict'

const MQTTS = require('../middleware/mqtt')
const config = require('./config')
const router = require('../subscribes/serve/index.sub')
const fs = require('fs')
const path = require('path')
const hardwareWordPro = require('../procedures/hardwareWord.pro')
const thingModelPro = require('../procedures/thingModel.pro')
const controlPro = require('../procedures/control.pro')
const controlWordPro = require('../procedures/controlWord.pro')
const userPro = require('../procedures/user.pro')
const wordPro = require('../procedures/word.pro')
const controlDataPro = require('../procedures/controlData.pro')
const uiManagementPro = require('../procedures/uiManagement.pro')
const displayAreaPro = require('../procedures/displayArea.pro')
const displayAreaClassPro = require('../procedures/displayAreaClass.pro')

const mqtt = MQTTS.connect(config.mqttserver, {
  clientId: config.clientId,
  username: config.mqtt_account.username,
  password: config.mqtt_account.password,
  root: config.mqttRoot })

// 静态文件访问 只能访问assets下的
mqtt.router.route(mqtt.subTopic('assets', 1, 0), { link: 'up', method: 'get' }, function(req, res) {
  const file = req.body
  fs.readFile(path.resolve('./assets/' + file), (err, data) => {
    console.log(err)
    if (!err) {
      res.send(data)
    } else {
      res.error(err)
    }
  })
})

mqtt.router.use(router)

mqtt.router.use((err, req, res, next) => {
  res.error(err.message)
})

mqtt.on('connect', function() {
  console.log('mqtt connected')
})

mqtt.on('close', function() {
  console.log('mqtt 服务器连接关闭')
})

mqtt.on('error', function(err) {
  console.log('MQTT ERROR：', err)
})

hardwareWordPro.init.inject(mqtt, mqtt.root)
thingModelPro.init.inject(mqtt, mqtt.root)
controlPro.init.inject(mqtt, mqtt.root)
userPro.init.inject(mqtt, mqtt.root)
wordPro.init.inject(mqtt, mqtt.root)
controlDataPro.init.inject(mqtt, mqtt.root)
controlDataPro.initControl.inject(mqtt, mqtt.root)
controlWordPro.init.inject(mqtt, mqtt.root)
uiManagementPro.init.inject(mqtt, mqtt.root)
displayAreaPro.init.inject(mqtt, mqtt.root)
displayAreaClassPro.init.inject(mqtt, mqtt.root)
module.exports = mqtt
