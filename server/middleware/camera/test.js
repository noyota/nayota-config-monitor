const util = require('util')
const child_process = require('child_process')
const exec = util.promisify(child_process.exec)

async function test() {
  const { stdout, stderr } = await exec(`ffmpeg -loglevel quiet -rtsp_transport tcp -i rtsp://admin:abc88223080@192.168.1.118 -t 10 -y -f mp4 test.mp4`)
  console.log('stdout', stdout)
  console.log('stderr', stderr)
}
test()

