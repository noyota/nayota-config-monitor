'use strict'

const MQTTS = require('../middleware/mqtt')
const config = require('./config')
const router = require('../subscribes/serve/index-data.sub')

const mqtt = MQTTS.connect(config.mqttserver, {
  clientId: config.clientId,
  username: config.mqtt_account.username,
  password: config.mqtt_account.password,
  root: config.mqttRoot })

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
  console.log('MQTT ERROR：', err.message)
})

module.exports = mqtt
