// config should be imported before importing any other file
const config = require('./config/config')
require('./config/mongoose')
// require('./config/mqtt')
const app = require('./config/express')
// 根据不同的角色执行不同的服务
process.env.ROLE = 'pi'
if (process.env.ROLE === 'pi') { // 如果是树莓派中控机
  // TODO Lorawan的 mqtt服务
  const { loraMasterInit } = require('./config/pi')
  loraMasterInit()
}

const start = function() {
  if (!module.parent) {
    // TODO 这样require不太优雅，但暂时只能这样
    app.listen(config.port, () => {
      console.info('Database:        ' + config.mongo.host)
      console.info(`项目启动,端口： ${config.port} (${config.env === 'development' ? '开发模式' : '成品模式'})`)
    })
  }
}

module.exports = start()
