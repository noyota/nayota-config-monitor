const util = require('util')
const child_process = require('child_process')
const exec = util.promisify(child_process.exec)
const fsPromises = require('fs').promises

module.exports = {
  recording,
  screenshot
}

async function recording(data, duration) {
  let url = data.local_ip
  if (data.local_username && data.local_password) {
    url = url.slice(0, 7) + `${data.local_username}:${data.local_password}@` + url.slice(7)
  }
  const fileDir = './assets/camera/' + data._id
  await fsPromises.mkdir(fileDir, { recursive: true })
  const file = fileDir + '/' + Date.now() + '.mp4'
  const { stderr } = await exec(`ffmpeg -loglevel quiet -rtsp_transport tcp -i ${url} -t ${duration} -y -f mp4 ${file}`)
  if (stderr) {
    throw stderr
  }
  return file
}

async function screenshot(data) {
  let url = data.local_ip
  if (data.local_username && data.local_password) {
    url = url.slice(0, 7) + `${data.local_username}:${data.local_password}@` + url.slice(7)
  }
  const fileDir = './assets/camera/' + data._id
  await fsPromises.mkdir(fileDir, { recursive: true })
  const file = fileDir + '/' + Date.now() + '.jpg'
  const { stderr } = await exec(`ffmpeg -loglevel quiet -rtsp_transport tcp -i ${url} -vframes 1 -y -f image2 ${file}`)
  if (stderr) {
    throw stderr
  }
  return file
}
