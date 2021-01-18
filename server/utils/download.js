const request = require('request')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')

exports.loadFile = async function(URL, path) {
  path = path || await createPath(Date.now() + '.' + URL.split('.').slice(-1)[0])
  await new Promise((res, rej) => {
    request(encodeURI(URL))
      .on('response', function() {
        res()
      })
      .on('error', () => {
        rej()
      })
      .pipe(fs.createWriteStream('./assets/' + path))
  })
  return path
}

async function createPath(filename) {
  const dir = `upload/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
  const abpath = path.resolve('./assets/' + dir)
  await fsPromises.mkdir(abpath, { recursive: true })
  return dir + '/' + filename
}

