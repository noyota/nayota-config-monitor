/**
 * @author lifeng
 * @date 19-7-9
 * @Description: 转换
*/
// 16进制转字符串
const hexCharCodeToStr = function(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim()
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === '0x'
      ? trimedStr.substr(2)
      : trimedStr
  var len = rawStr.length
  if (len % 2 !== 0) {
    return ''
  }
  var curCharCode
  var resultStr = []
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16) // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode))
  }
  return resultStr.join('')
}

function strToHex(str) {
  if (str === '') return ''
  const bytes = []
  for (var i = 0; i < str.length; i++) {
    bytes.push((str.charCodeAt(i)).toString(16))
  }
  return bytes.join('')
}
/**
 * 字节流转换成字符串
 * @param buffer
 * @return {string}
 */
const bufferToHexStr = function(buffer) {
  const arr = []
  buffer.forEach(item => {
    arr.push(numToHexStr(item, 2))
  })
  return arr.join('')
}

/**
 * 16进制字符串转换成字节流
 * @param hexStr
 * @return {Buffer}
 */
const hexStrToBuffer = function(hexStr) {
  hexStr = hexStr.replace(/\s/g, '') // 去空格
  let arr = hexStr.match(/.{2}/g)
  arr = arr.map(d => parseInt(d, 16))
  return Buffer.from(arr)
}

/**
 * 数字转换成固定长度的16进制字符串
 * @param number
 * @param length
 * @return {string}
 */
const numToHexStr = function(number, length) {
  if (typeof number === 'string') {
    number = parseInt(number)
  }
  let hex = number.toString(16)
  while (hex.length < length) {
    hex = '0' + hex
  }
  return hex.slice(-length)
}

/**
 * 16进制字符串加1
 * @param hexStr
 * @return {string}
 */
const hexStrAdd = function(hexStr) {
  const number = parseInt(hexStr, 16) + 1
  let hex = number.toString(16)
  while (hex.length < hexStr.length) {
    hex = '0' + hex
  }
  return hex.slice(-hexStr.length)
}

const strToJson = function(str) {
  try {
    return JSON.parse(str)
  } catch (e) {
    return { code: 10005, message: str }
  }
}

const parseInterval = function(str) {
  if (str == null || str === '') return []
  const arr = JSON.parse(str)
  if (arr.length === 3) {
    const data = []
    const min = arr[2][0]
    const max = arr[2][1]
    const i = [min, ...arr[1], max]
    arr[0].map((item, index) => {
      data.push({ label: item, min: i[index], max: i[index + 1] })
    })
    return data
  } else if (arr.length === 2) {
    const data = []
    arr[0].map((item, index) => {
      data.push({ label: item, value: arr[1][index] })
    })
    return data
  }
}

module.exports = {
  hexStrAdd,
  numToHexStr,
  hexStrToBuffer,
  bufferToHexStr,
  strToJson,
  parseInterval,
  hexCharCodeToStr,
  strToHex
}
