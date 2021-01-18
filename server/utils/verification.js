/**
 * @author lifeng
 * @date 19-7-19
 * @Description: 各种校验生成和验证 命令正确性
*/
// const { he } = require('./transformation')
// crc16 校验

exports.crc16 = function(commond) {
  const TABLE = [
    0x0000, 0xc0c1, 0xc181, 0x0140, 0xc301, 0x03c0, 0x0280, 0xc241,
    0xc601, 0x06c0, 0x0780, 0xc741, 0x0500, 0xc5c1, 0xc481, 0x0440,
    0xcc01, 0x0cc0, 0x0d80, 0xcd41, 0x0f00, 0xcfc1, 0xce81, 0x0e40,
    0x0a00, 0xcac1, 0xcb81, 0x0b40, 0xc901, 0x09c0, 0x0880, 0xc841,
    0xd801, 0x18c0, 0x1980, 0xd941, 0x1b00, 0xdbc1, 0xda81, 0x1a40,
    0x1e00, 0xdec1, 0xdf81, 0x1f40, 0xdd01, 0x1dc0, 0x1c80, 0xdc41,
    0x1400, 0xd4c1, 0xd581, 0x1540, 0xd701, 0x17c0, 0x1680, 0xd641,
    0xd201, 0x12c0, 0x1380, 0xd341, 0x1100, 0xd1c1, 0xd081, 0x1040,
    0xf001, 0x30c0, 0x3180, 0xf141, 0x3300, 0xf3c1, 0xf281, 0x3240,
    0x3600, 0xf6c1, 0xf781, 0x3740, 0xf501, 0x35c0, 0x3480, 0xf441,
    0x3c00, 0xfcc1, 0xfd81, 0x3d40, 0xff01, 0x3fc0, 0x3e80, 0xfe41,
    0xfa01, 0x3ac0, 0x3b80, 0xfb41, 0x3900, 0xf9c1, 0xf881, 0x3840,
    0x2800, 0xe8c1, 0xe981, 0x2940, 0xeb01, 0x2bc0, 0x2a80, 0xea41,
    0xee01, 0x2ec0, 0x2f80, 0xef41, 0x2d00, 0xedc1, 0xec81, 0x2c40,
    0xe401, 0x24c0, 0x2580, 0xe541, 0x2700, 0xe7c1, 0xe681, 0x2640,
    0x2200, 0xe2c1, 0xe381, 0x2340, 0xe101, 0x21c0, 0x2080, 0xe041,
    0xa001, 0x60c0, 0x6180, 0xa141, 0x6300, 0xa3c1, 0xa281, 0x6240,
    0x6600, 0xa6c1, 0xa781, 0x6740, 0xa501, 0x65c0, 0x6480, 0xa441,
    0x6c00, 0xacc1, 0xad81, 0x6d40, 0xaf01, 0x6fc0, 0x6e80, 0xae41,
    0xaa01, 0x6ac0, 0x6b80, 0xab41, 0x6900, 0xa9c1, 0xa881, 0x6840,
    0x7800, 0xb8c1, 0xb981, 0x7940, 0xbb01, 0x7bc0, 0x7a80, 0xba41,
    0xbe01, 0x7ec0, 0x7f80, 0xbf41, 0x7d00, 0xbdc1, 0xbc81, 0x7c40,
    0xb401, 0x74c0, 0x7580, 0xb541, 0x7700, 0xb7c1, 0xb681, 0x7640,
    0x7200, 0xb2c1, 0xb381, 0x7340, 0xb101, 0x71c0, 0x7080, 0xb041,
    0x5000, 0x90c1, 0x9181, 0x5140, 0x9301, 0x53c0, 0x5280, 0x9241,
    0x9601, 0x56c0, 0x5780, 0x9741, 0x5500, 0x95c1, 0x9481, 0x5440,
    0x9c01, 0x5cc0, 0x5d80, 0x9d41, 0x5f00, 0x9fc1, 0x9e81, 0x5e40,
    0x5a00, 0x9ac1, 0x9b81, 0x5b40, 0x9901, 0x59c0, 0x5880, 0x9841,
    0x8801, 0x48c0, 0x4980, 0x8941, 0x4b00, 0x8bc1, 0x8a81, 0x4a40,
    0x4e00, 0x8ec1, 0x8f81, 0x4f40, 0x8d01, 0x4dc0, 0x4c80, 0x8c41,
    0x4400, 0x84c1, 0x8581, 0x4540, 0x8701, 0x47c0, 0x4680, 0x8641,
    0x8201, 0x42c0, 0x4380, 0x8341, 0x4100, 0x81c1, 0x8081, 0x4040
  ]

  function crc(buf, previous) {
    let crc = typeof (previous) !== 'undefined' ? ~~previous : 0xffff

    for (let index = 0; index < buf.length; index++) {
      const byte = buf[index]
      crc = ((TABLE[(crc ^ byte) & 0xff] ^ (crc >> 8)) & 0xffff)
    }

    return crc
  }

  function strToHex(hexString) {
    if ((hexString.length % 2) !== 0) {
      hexString += ' '
    }
    const bytes = []
    for (let i = 0; i < hexString.length / 2; i++) {
      bytes[i] = parseInt(hexString.substr(i * 2, 2), 16)
    }
    return bytes
  }

  // var buf = new Buffer([1, 6, 0,0x64,0,1]);
  // var crc16 = crcCheck(buf, buf.length);
  // console.log("crc16[%j]=%j",buf.length,crc16.toString(16) );
  // console.log(crc(buf).toString(16));

  commond = commond.replace(new RegExp(/( )/g), '')
  let lhcrc = crc(strToHex(commond)).toString(16)
  while (lhcrc.length < 4) {
    lhcrc = '0' + lhcrc
  }
  return (commond + lhcrc.substr(2, 2) + lhcrc.substr(0, 2)).toLowerCase() // crc 校验低位在前 高位在后
}
// 和校验
exports.he = function(commond) {
  let jy = 0
  commond = commond.replace(new RegExp(/( )/g), '')
  for (let i = 0; i < commond.length; i += 2) {
    jy += parseInt(commond.substr(i, 2), 16)
  }
  jy = (jy % 256).toString(16)
  while (jy.length < 2) {
    jy = '0' + jy
  }
  return (commond + jy).toLowerCase()
}
// 数值转16进制
exports.numToHexStr = function(number, length) {
  if (typeof number === 'string') {
    number = parseInt(number)
  }
  let hex = number.toString(16).toLowerCase()
  while (hex.length < length) {
    hex = '0' + hex
  }
  return hex
}

/**
 * 验证命令中是否有标准的Lora从站消息格式参数（帧头，帧尾，和校验）并提取出来，
 * @param command
 * @param netAddr
 * @param loraAddr
 */
exports.validateLora = (command, netAddr = '.{4}', loraAddr = '.{4}') => {
  command = command.replace(/\s/g, '') // 去空格
  const startMatch = new RegExp(`aa${netAddr}aa${loraAddr}`, 'g')
  const endMatch = /ff22/g
  let startCmd = null; let endCmd = null
  const startIndexs = []; const endIndexs = []
  do {
    startCmd = startMatch.exec(command)
    if (startCmd)startIndexs.push(startCmd.index)
  } while (startCmd)
  do {
    endCmd = endMatch.exec(command)
    if (endCmd)endIndexs.push(endCmd.index)
  } while (endCmd)
  for (let i = 0; i < startIndexs.length; i++) {
    for (let j = 0; j < endIndexs.length; j++) {
      const startI = startIndexs[i]; const endI = endIndexs[j]
      if (startI > endI) continue
      const cmd = command.substring(startI, endI)
      if (this.he(cmd.substring(6, cmd.length - 2)) === cmd.substring(6)) { // 通过校验
        return cmd + 'ff22'
      }
    }
  }
  return null
}
/**
 * 字符串转2进制
 * @param str
 */
exports.hex_to_bin = function(str) {
  const hex_array = [{ key: 0, val: '0000' }, { key: 1, val: '0001' }, { key: 2, val: '0010' }, { key: 3, val: '0011' }, { key: 4, val: '0100' }, { key: 5, val: '0101' }, { key: 6, val: '0110' }, { key: 7, val: '0111' },
    { key: 8, val: '1000' }, { key: 9, val: '1001' }, { key: 'a', val: '1010' }, { key: 'b', val: '1011' }, { key: 'c', val: '1100' }, { key: 'd', val: '1101' }, { key: 'e', val: '1110' }, { key: 'f', val: '1111' }]
  let value = ''
  for (let i = 0; i < str.length; i++) {
    for (let j = 0; j < hex_array.length; j++) {
      if (str.charAt(i) == hex_array[j].key) {
        value = value.concat(hex_array[j].val)
        break
      }
    }
  }
  return value
}
/**
 * 2进制转字符串
 */
exports.bin_to_hex = function(str) {
  const hex_array = [{ key: 0, val: '0000' }, { key: 1, val: '0001' }, { key: 2, val: '0010' }, { key: 3, val: '0011' }, { key: 4, val: '0100' }, { key: 5, val: '0101' }, { key: 6, val: '0110' }, { key: 7, val: '0111' },
    { key: 8, val: '1000' }, { key: 9, val: '1001' }, { key: 'a', val: '1010' }, { key: 'b', val: '1011' }, { key: 'c', val: '1100' }, { key: 'd', val: '1101' }, { key: 'e', val: '1110' }, { key: 'f', val: '1111' }]
  let value = ''
  const list = []
  if (str.length % 4 !== 0) {
    const a = '0000'
    const b = a.substring(0, 4 - str.length % 4)
    str = b.concat(str)
  }
  while (str.length > 4) {
    list.push(str.substring(0, 4))
    str = str.substring(4)
  }
  list.push(str)
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < hex_array.length; j++) {
      if (list[i] == hex_array[j].val) {
        value = value.concat(hex_array[j].key)
        break
      }
    }
  }
  return value
}
