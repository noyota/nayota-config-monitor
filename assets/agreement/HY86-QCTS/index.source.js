function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 100 // 地址最大
  this.validate = validate
  this.button = [0, 1, 2, 3]
  this.options = options // options.defaulttest  options.defaultbutton
  var _this = this
  _this.checksAddress = []
  options.defaultCheck.forEach(function(test) {
    _this['analysis' + test.address] = test.analysis// test.analysis 解析函数
    _this.checksAddress.push(test.address)
  })
}
/**
     * 搜索设备
     * 回调 [addr] 返回搜索到的设备的地址
     */
Relay.prototype.find = function(startAddr, endAddr) {
  if (startAddr && typeof startAddr === 'string')startAddr = parseInt(startAddr)
  if (endAddr && typeof endAddr === 'string')endAddr = parseInt(endAddr)
  var addr = startAddr || this.addrmin
  var end = endAddr || this.addrmax
  function strToHex(str) {
    if(str === "") return ""
    const bytes = []
    for(var i = 0; i < str.length; i++) {
      bytes.push((str.charCodeAt(i)).toString(16));
　　 }
    return bytes.join("");
  }
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  var commond = strToHex('RELAY: ?')
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      console.log(result)
      if (result.length < 14) {
        return error(400)
      }
      var json = {
        shortAddress: '01',
        name: devicename + '01',
        checks: defaultCheck,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: false // 改变地址
  }
}


/**
* 简析主动上报指令，并且生成一个数组
*/

Relay.prototype.decode = function(result) {
  var ret = {}
  function hexCharCodeToStr(hexCharCodeStr) {
  　　var trimedStr = hexCharCodeStr.trim();
  　　var rawStr = 
  　　trimedStr.substr(0,2).toLowerCase() === "0x"
  　　? 
  　　trimedStr.substr(2) 
  　　: 
  　　trimedStr;
  　　var len = rawStr.length;
  　　if(len % 2 !== 0) {
  　　　　return "";
  　　}
  　　var curCharCode;
  　　var resultStr = [];
  　　for(var i = 0; i < len;i = i + 2) {
  　　　　curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
  　　　　resultStr.push(String.fromCharCode(curCharCode));
  　　}
  　　return resultStr.join("");
  }
  if (result.length === 72) {
    var result = result.substr(34, 32)
    let res=hexCharCodeToStr(result)
    if(res===""){
      return ''
    }
    ret[1]= parseInt(res,16)
    return ret
  } else {
    return null
  }
}

Relay.prototype.navi = function(result) {
  if (result) {
    return '01'
  }
  return null
}

module.exports = Relay
