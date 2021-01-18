const net = require('net')

// 指定连接的tcp server ip，端口
var options = {
  host: '172.30.20.10',
  port: 5678
}

// 连接 tcp server
const tcp_client = net.createConnection(options, () => {
  console.log('connected to Server')
  tcp_client.write('I am tcp_client of node!')
})

// 接收数据
tcp_client.on('data', function(data) {
  console.log('received data: %s from server', data.toString())
})

tcp_client.on('end', function() {
  console.log('data end!')
})

tcp_client.on('error', function() {
  console.log('tcp_client error!')
})
