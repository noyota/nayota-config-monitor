## MQTT配置项目
配置监控MQTT服务中间件运行情况和通讯权限
## 依赖服务
mosca-server  
rabbitMQ 3.6~3.7  
mongodb 3.4~3.6
### Installation 
``` 
git clone https://github.com/lifengtc123/vmen-mqtt-config.git
cd vmen-mqtt-config
npm install
npm start (for development)
npm serve (for vue-cli)
```
### Docker based 
``` 
git clone https://github.com/lifengtc123/vmen-mqtt-config.git
cd vmen-mqtt-config
docker-compose up -d
```
    
## 开发下前端启动
[官方文档](https://cli.vuejs.org/zh/guide/cli-service.html#vue-cli-service-build)  
vue-cli-service serve 命令会启动一个开发服务器 (基于 webpack-dev-server) 并附带开箱即用的模块热重载 (Hot-Module-Replacement)。  
使用 vue.config.js 里的 devServer 字段配置开发服务器。  

