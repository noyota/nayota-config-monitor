function Relay(options, validate) {
  this.addrmin = 100 // 地址最小
  this.addrmax = 130 // 地址最大
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
  var commond = 'AAAAAAAAAA5656560F'
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates =this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      if (result.length < 10) {
        return error(400)
      }
      // var data = result.substr(0, result.length - 4)
      // var validatedata = validate.crc16(data)
      // if (validatedata !== result) {
      //   return error(401)
      // }
      // var func = result.substr(2, 2)
      // if (func !== '03') {
      //   return error(402)
      // }
      var address = result.substr(8, 2)
      var json = {
        shortAddress: address,
        name: devicename + address,
        checks: defaultCheck,
        operates: defaultOperates,
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
  if (typeof options.oldAddr === 'number')options.oldAddr = options.oldAddr.toString(16)
  while (options.oldAddr.length < 2) {
    options.oldAddr = '0' + options.oldAddr
  }

  var commond1="00000000"+options.oldAddr+"F8E7D600000000"+options.shortAddress;
  var commond2="AAAAAAAAAA5656560F"
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates=this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond1+","+commond2,
    resolve: function(result, success, error) {
      var result2=result.split(",")[1];
      if(result2.length<10){
        return error(400);
      }
      var func=result2.substr(8,2);
      if(func.toUpperCase()!=options.shortAddress.toUpperCase()){
        return error(402);
      }
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

}
Relay.prototype.write = function (addr,code,state) {
  var code2=code;
  if(state === 0){
    state='00';
  }else if(state === 1){
    state='01';
  }
  state=state.toString(16);
  while(state.length<2){
    state="0"+state;
  }
  addr=addr.toString(16);
  while (addr.length<2){
    addr="0"+addr;
  }
  code=code.toString(16);
  while (code.length<2){
    code="0"+code;
  }
  validate=this.validate;
  var commond1="00000000"+addr+"00"+code+state+"0F";
  var commond2="00000000"+addr+"8686860F"
  //commond=this.validate(commond);
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperate = this.options.defaultOperate
  return {
    cmd:commond1+","+commond2,
    resolve:function (result,success,error) {

      var result2=result.split(",")[1];
      if(result2.length<20){
        return error(400);
      }
      if(code2==0){
        code2=10
      }else if(code2==1){
        code2=12
      }else if(code2==2){
        code2=14
      }
      var addrback=result2.substr(code2,2);
      if (addrback ==='01')addrback = 1
      else if (addrback ==='00')addrback =0
      return success(addrback)


    }
  };
}
/**
 * 生成主动上报
 * addr 设备地址
 * parameters 默认参数配置
 * changecycle 默认参数 --变化周期 1个字节
 * rangeofchange 默认参数 --变化幅度 1个字节
 * lowerLimitValue 默认参数 --下限值 字节数(根据commonds中的reslength/2)
 * upperlimitvalue  默认参数 --上限值 字节数(根据commonds中的reslength/2)
 * port 串口配置
 */
Relay.prototype.encode = function(addr, parameters, port) {
  /**
   * 定义个查询指令
   *cmd1:查询电压
   *cmd2:查询电流
   *cmd3:查询电能
   */
  var cmd1 = this.validate.crc16(addr + '0300320003')
  var cmd2 = this.validate.crc16(addr + '0300380003')
  var cmd3 = this.validate.crc16(addr + '04000A0002')
  /**
   *commonds --定义数据参数的反馈起始位和惭愧数据参数长度。
   *begin ---数据参数 字节数 反馈起始位*2
   *reslength----数据参数 反馈数据参数长度 下限值-上限值的指令字节数为该长度*2
   *cmd  ------ 非必选，用于设定不同的指令的作用
   */
  var commonds = [
    { begin: 3, reslength: 2 },
    { begin: 5, reslength: 2 },
    { begin: 7, reslength: 2 }
  ]
  var commonds2 = [
    { begin: 3, reslength: 2 }
  ]

  var pars = {}
  for (var o = 0; o < parameters.length; o++) {
    pars[parameters[o].key] = parameters[o].value
  }

  var readTime = parseInt(pars['读取周期']).toString(16)
  var upTime = parseInt(pars['Heartbeat']).toString(16)
  while (readTime.length < 4) {
    readTime = '0' + readTime
  }
  while (upTime.length < 4) {
    upTime = '0' + upTime
  }
  function isNumber(val) {
    var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
    if (regPos.test(val)) {
      return true
    } else {
      return false
    }
  }
  function paramData(cmd, commonds, parameter, port, orderNo, cmds, type) {
    orderNo = orderNo.toString(16)
    while (orderNo.length < 2) {
      orderNo = '0' + orderNo
    }
    var allcs = ''
    commonds.forEach(function(commond) {
      var params = parameter.split(',')
      if (type === 'dy') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 0.01
        } else if (parseFloat(params[1]) < 0.01) {
          params[1] = 0.01
        } else if (parseFloat(params[1]) > 1) {
          params[1] = 1
        }
        params[1] = parseFloat(params[1]) * 100
        if (params[2] === undefined || !isNumber(params[2])) {
          params[2] = 1
        } else if (parseInt(commond.reslength) < parseInt(params[2])) {
          params[2] = commond.reslength
        }
        if (params[3] === undefined || !isNumber(params[3])) {
          params[3] = 0
        } else if (parseFloat(params[3]) >= 380) {
          params[3] = 0
        }
        params[3] = parseFloat(params[3]) * 100
        if (params[4] === undefined || !isNumber(params[4])) {
          params[4] = 380
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 380
        } else if (parseFloat(params[4]) > 380) {
          params[4] = 380
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'dl') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 0.01
        } else if (parseFloat(params[1]) < 0.01) {
          params[1] = 0.01
        } else if (parseFloat(params[1]) > 1) {
          params[1] = 1
        }
        params[1] = parseFloat(params[1]) * 100
        if (params[2] === undefined || !isNumber(params[2])) {
          params[2] = 1
        } else if (parseInt(commond.reslength) < parseInt(params[2])) {
          params[2] = commond.reslength
        }
        if (params[3] === undefined || !isNumber(params[3])) {
          params[3] = 0
        } else if (parseFloat(params[3]) >= 10) {
          params[3] = 0
        }
        params[3] = parseFloat(params[3]) * 100
        if (params[4] === undefined || !isNumber(params[4])) {
          params[4] = 10
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 10
        } else if (parseFloat(params[4]) > 10) {
          params[4] = 10
        }
        params[4] = parseFloat(params[4]) * 100
      }
      if (type === 'dn') {
        if (params[0] === undefined || !isNumber(params[0])) {
          params[0] = 200
        }
        if (params[1] === undefined || !isNumber(params[1])) {
          params[1] = 0.1
        } else if (parseFloat(params[1]) < 0.1) {
          params[1] = 0.1
        } else if (parseFloat(params[1]) > 1) {
          params[1] = 1
        }
        params[1] = parseFloat(params[1]) * 100
        if (params[2] === undefined || !isNumber(params[2])) {
          params[2] = 1
        } else if (parseInt(commond.reslength) < parseInt(params[2])) {
          params[2] = commond.reslength
        }
        if (params[3] === undefined || !isNumber(params[3])) {
          params[3] = 0
        } else if (parseFloat(params[3]) >= 10) {
          params[3] = 0
        }
        params[3] = parseFloat(params[3]) * 100
        if (params[4] === undefined || !isNumber(params[4])) {
          params[4] = 20000
        } else if (parseFloat(params[4]) < parseFloat(params[3])) {
          params[4] = 20000
        } else if (parseFloat(params[4]) > 10) {
          params[4] = 20000
        }
        params[4] = parseFloat(params[4]) * 100
      }
      console.log(JSON.stringify(params))
      let changecycle = parseInt(params[0]).toString(16)
      while (changecycle.length < 2) {
        changecycle = '0' + changecycle
      }
      let rangeofchange = parseInt(params[1]).toString(16)
      while (rangeofchange.length < 2) {
        rangeofchange = '0' + rangeofchange
      }
      if (parseInt(params[2]) > 1) {
        commond.reslength = parseInt(commond.reslength) - parseInt(params[2]) + 1
      }
      var resth = parseInt(commond.reslength * 2)
      let lowerLimitValue = parseInt(params[3]).toString(16)
      while (lowerLimitValue.length < resth) {
        lowerLimitValue = '0' + lowerLimitValue
      }

      let upperlimitvalue = parseInt(params[4]).toString(16)
      while (upperlimitvalue.length < resth) {
        upperlimitvalue = '0' + upperlimitvalue
      }

      commond.begin = commond.begin.toString(16)
      while (commond.begin.length < 2) {
        commond.begin = '0' + commond.begin
      }

      commond.reslength = commond.reslength.toString(16)
      while (commond.reslength.length < 2) {
        commond.reslength = '0' + commond.reslength
      }

      var cscmd = commond.begin + commond.reslength + changecycle + rangeofchange + lowerLimitValue + upperlimitvalue
      // 计算单条数据参数的指令长度
      var wlength = (parseInt(cscmd.length / 2) + 1).toString(16)
      while (wlength.length < 2) {
        wlength = '0' + wlength
      }
      cscmd = wlength + cscmd
      allcs = allcs + cscmd
    })

    var alength = parseInt(allcs.length / 2).toString(16)
    while (alength.length < 2) {
      alength = '0' + alength
    }
    var allNumber = commonds.length.toString(16)
    while (allNumber.length < 2) {
      allNumber = '0' + allNumber
    }
    var ncmd = '00' + port + readTime + upTime + alength + allNumber + allcs + cmd
    if (ncmd.length > 128) {
      // 计算指令截成几段
      let i = 1
      var j = parseInt(ncmd.length / 128) + 1
      var xh = i + '' + j
      while (ncmd.length > 128) {
        var mm = ncmd.substr(0, 128)
        ncmd = ncmd.substr(128)
        xh =
          cmds.push(addr + orderNo + xh + mm)
        i = i + 1
      }
      if (ncmd.length > 0) {
        cmds.push(addr + orderNo + j + '' + j + ncmd)
      }
    } else {
      cmds.push(addr + orderNo + '11' + ncmd)
    }
    return cmds
  }
  var cmds = []
  cmds = paramData(cmd1, commonds, pars['dy'], port, 0, cmds, 'dy')
  cmds = paramData(cmd2, commonds, pars['dl'], port, 1, cmds, 'dl')
  cmds = paramData(cmd3, commonds2, pars['dn'], port, 2, cmds, 'dn')
  return {
    cmd: cmds.join(','),
    try: 5
  }
}
/**
 * 简析主动上报指令，并且生成一个数组
 */
Relay.prototype.decode = function(result) {
  var ret = {}
  if (result.length === 26 || result.length === 22) {
    var code = result.substr(2, 2)
    let data = ''
    if (code === '00' || code === '01') {
      data = result.substr(10, 12)
      const valid = this.validate.crc16(result.substr(4, 18)).toUpperCase()
      if (valid !== result.substr(4, 22).toUpperCase()) {
        return null
      }
      if (code === '00') {
        const j = 50
        for (let i = 0; i < 3; i++) {
          const code = parseInt(j) + i
          let d = data.substr(i * 4, 4)
          const analysis = this['analysis' + code.toString(16)]
          var analyze = null
          if (analysis) {
            eval(analysis)
          }
          if (analyze) {
            d = analyze(d)
          }
          ret[code.toString(16)] = d
        }
      }
      if (code === '01') {
        const j = 56
        for (let i = 0; i < 3; i++) {
          const code = parseInt(j) + i
          let d = data.substr(i * 4, 4)
          const analysis = this['analysis' + code.toString(16)]
          var analyze = null
          if (analysis) {
            eval(analysis)
          }
          if (analyze) {
            d = analyze(d)
          }
          ret[code.toString(16)] = d
        }
      }
    }
    if (code === '02') {
      data = result.substr(10, 8)
      const valid = this.validate.crc16(result.substr(4, 14)).toLowerCase()
      if (valid !== result.substr(4, 18).toLowerCase()) {
        return null
      }
      const code = 'a'
      var analysis = this['analysis' + code]
      var analyze = null
      if (analysis) {
        eval(analysis)
      }
      if (analyze) {
        data = analyze(data)
      }
      ret[code] = data
    }
    return ret
  } else {
    return null
  }
}

Relay.prototype.navi = function(result) {
  if (result) {
    const ret = result.substr(0, 2)
    return ret
  }
  return null
}

module.exports = Relay
