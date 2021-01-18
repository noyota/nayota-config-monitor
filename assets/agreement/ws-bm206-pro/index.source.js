function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 20 // 地址最大
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
  var commond = 'FA0000016869FE'
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if(result.length<26){
          return error(400)
      }
      var address =result.substr(12, 2)
      // var data=fromCharCode(result.substr(8, 16));
      /*if (data.toUpperCase() != result.toUpperCase()) {
       return error(401);
       }*/
      var addr = result.substr(8, 2)
      if (addr != '69') {
          return error(403)
      }
      var json = {
        shortAddress: address,
        name: devicename + address,
        checks: defaultCheck,
        operates:defaultOperates,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: true // 改变地址
  }
}
/**
     * 改变设备地址
     * 回调 【addr】  返回
     */
Relay.prototype.changeAddr = function(options) {
  if (typeof options.shortAddress === 'number')options.shortAddress = options.shortAddress.toString(16)
  while (options.shortAddress.length < 2) {
    options.shortAddress = '0' + options.shortAddress
  }
  var jiaoyanone=(parseInt(options.oldAddr,16)+3+106+parseInt(options.shortAddress,16)).toString(16)
  var jiaoyan=jiaoyanone.substr(jiaoyanone.length-2,jiaoyanone.length);
  var commond="FA00"+options.oldAddr+"036A00"+options.shortAddress+jiaoyan+"FE"
  // commond = this.validate.crc16(commond)
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates = this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if(result.length<18){
          return error(400)
      }
       //var func=result.substr(8,2)
	  // console.log("func="+func)
     //  if(func!='6a'){
     //      return error(402)
     //  }
      var json = {
        shortAddress: options.shortAddress,
        name: devicename + options.shortAddress,
        checks: defaultCheck,
        operates:defaultOperates,
        attribute: attribute
      }
      return success(json)
    }
  }
}

/**
     * 读取数据
     */
Relay.prototype.read = function(addr, code) {
  if (code == null)code = this.checksAddress
  else if (typeof code === 'string') code = [code]
  var analysis = []
  var _this = this
  code.forEach(function(item) {
  analysis.push(_this['analysis' + item])
  })
  while (addr.length < 2) {
  addr = '0' + addr
  }
  var state="0180"
  var v1=parseInt(parseInt(state,16)/256)+parseInt(state,16)%256
  var jiaoyantow=(parseInt(addr,16)+v1).toString(16)
  var jiaoyan2=jiaoyantow.substr(jiaoyantow.length-2,2)
  var commond1="FA00"+addr+"0180"+jiaoyan2+"FE"
  var cmd = []
  cmd.push(commond1)
  var validate = this.validate
  return {
    cmd: cmd.join(','),
    resolve: function(result, success, error) {
      var data = result.split(',')
      if (data.length !== cmd.length) {
      return error(400)
      }
      var res = {}
      var allChecks = {}
      for (var i = 0 ;i < data.length ;i++) {
      var item = data[i]
      if (item.length < 18) {
        return error(400)
      }
      var addrback = item.substr(0, 2)
      if (addrback != addr.toLowerCase()) {
        return error(403)
      }
      var func = item.substr(2, 2)
      if (func != '03') {
        return error(401)
      }
      var func2 = item.substr(4, 2)
      if (func2 != '04') {
        return error(402)
      }
      allChecks['1'] = item.substr(6, 4)
      allChecks['2'] = item.substr(10, 4)
      code.forEach(function(item, index) {
        var analyze = null
        eval(analysis[index])
        if (allChecks[item] && analyze) {
        res[item] = analyze(allChecks[item])
        }
      })
      }
    success(res)
    }
  }
}



Relay.prototype.write = function (addr,code,state) {  //01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
    var state2=state
    if(state==0){             //播放
        state="1002"
    }else if(state==1){      //暂停
        state="1003"
    }else if(state==2){     //上一曲
        state="100b"
    }else if(state==3){     //下一曲
        state="100c"
    }else if(state==4){     //音量+
        state="1007"
    }else if(state==5){     //音量-
        state="1006"
    }else if(state==6){     //全部循环
        state="8601"
    }else if(state==7){     //单曲循环q
        state="8602"
    }else if(state==8){     //随机播放
        state="8603"
    }
    addr=addr.toString(16)
    while (addr.length<2){
        addr="0"+addr
    }
    var v1=parseInt(parseInt(state,16)/256)+parseInt(state,16)%256
    var jiaoyanone=(parseInt(addr,16)+2+v1).toString(16)
    var jiaoyantow=(parseInt(addr,16)+v1).toString(16)
    var jiaoyan=jiaoyanone.substr(jiaoyanone.length-2,2)
    var jiaoyan2=jiaoyantow.substr(jiaoyantow.length-2,2)
    validate=this.validate
    if(state2==9){
    var commond="FA00"+addr+state+jiaoyan2+"FE"
    }else{
    var commond="FA00"+addr+"02"+state+jiaoyan+"FE"
    }
    console.log(commond)
    //commond=this.validate(commond);
    return {
        cmd:commond,
        resolve:function (result,success,error) {
            if(state2==2||state2==3){              //上一曲 下一曲
                var func=result.substr(8,2)
                if(func!="03"){
                    return error(402)
                }
                var brr=result.substring(20,result.length-4)
                var rawStr = brr.trim()
                var len = rawStr.length
                var curCharCode=''
                var resultStr = []
                for(var i = 0; i < len;i = i + 2) {
                    curCharCode+="%"+rawStr.substr(i, 2) // ASCII Code Value
                }
                // var JSON1={name: decodeURI(curCharCode)}
                var namestate=decodeURI(curCharCode)
                return success(namestate)
            }else if(state2==0||state2==1){      //开始 暂停
                if(result.length<14){
                    return error(400)
                }
                var func=result.substr(8,2)
                if(func!='03'){
                    return error(402)
                }
                var state=result.substr(12,2)
                // var JSON2={state:state2}
                return success(state2)
            }else if(state2==6||state2==7||state2==8){            //循环
                if(result.length<16){
                    return error(400)
                }
                var func=result.substr(8,2)
                if(func!='86'){
                    return error(402)
                }
                var type=result.substr(10,2)
                // var JSON3={
                //   type:parseInt(type,16)
                // }
                return success(state2)
            }else if(state2==4||state2==5){         //音量+ 音量-
                if(result.length<18){
                    return error(400)
                }
                var func=result.substr(8,2)
                if(func!="03"){
                    return error(402)
                }
                var vol=result.substr(12,2)
                // var JSON4={
                //   vol:parseInt(vol,16)
                // }
                return success(vol)
            }
            
        }
    }
}
/**
    * 生成主动上报
    * addr 设备地址
    * parameters 默认参数配置
    * changecycle 默认参数 --变化周期 1个字节
    * rangeofchange 默认参数 --变化幅度 1个字节
    * 比较字节1
    * lowerLimitValue 默认参数 --下限值 字节数(根据commonds中的reslength/2)
    * upperlimitvalue  默认参数 --上限值 字节数(根据commonds中的reslength/2)
    * port 串口配置
    */
Relay.prototype.encode = function(addr, parameters, port) {
}
/**
    * 简析主动上报指令，并且生成一个数组
    */
Relay.prototype.decode = function(result) {
}

Relay.prototype.navi = function(result) {
  if (result) {
    const ret = result.substr(0, 2)
    return ret
  }
  return null
}

module.exports = Relay