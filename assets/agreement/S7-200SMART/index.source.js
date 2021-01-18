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

// 去掉最后两位信号强度
function rmDb(result) {
  // if (result.length > 2) {
  //   result = result.substr(0, result.length - 2)
  // }
  return result
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
  var commond = ''
  while (addr <= end) {
    var addrS = addr.toString(16)
    while (addrS.length < 2) {
      addrS = '0' + addrS
    }
    commond += this.validate.crc16(addrS + '0100000001') + ','
    addr++
  }
  // console.log(startAddr)
  // console.log(endAddr)
  // console.log(commond)
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  return {
    cmd: commond.substr(0, commond.length - 1),
    resolve: function(result, success, error) {
      result = rmDb(result)
      if (result.length < 12) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata.toLowerCase()  !== result.toLowerCase() ) {
        return error(401)
      }
      var func = result.substr(2, 2)
      if (func !== '01') {
        return error(402)
      }
      var address = result.substr(0, 2)
      var json = {
        shortAddress: address,
        name: devicename + address,
        checks: defaultCheck,
        attribute: attribute
      }
      return success(json)
    },
    changeAddr: false // 改变地址
  }
}
/**
     * 改变设备地址
     * 回调 【addr】  返回
     */
Relay.prototype.changeAddr = function(options) {
  // if (typeof options.shortAddress === 'number')options.shortAddress = options.shortAddress.toString(16)
  // while (options.shortAddress.length < 2) {
  //   options.shortAddress = '0' + options.shortAddress
  // }
  // if (typeof options.oldAddr === 'number')options.oldAddr = options.oldAddr.toString(16)
  // while (options.oldAddr.length < 2) {
  //   options.oldAddr = '0' + options.oldAddr
  // }

  // var commond = options.oldAddr + '10000600010200' + options.shortAddress
  // commond = this.validate.crc16(commond)
  // var validate = this.validate
  // var devicename = this.options.name
  // var defaultCheck = this.options.defaultCheck
  // var attribute = []
  // if (this.options.attribute !== undefined) {
  //   attribute = this.options.attribute
  // }
  // return {
  //   cmd: commond,
  //   resolve: function(result, success, error) {
  //     result = rmDb(result)
  //     if (result.length < 16) {
  //       return error(400)
  //     }
  //     var data = result.substr(0, result.length - 4)
  //     var validatedata = validate.crc16(data)
  //     if (validatedata.toUpperCase() !== result.toUpperCase()) {
  //       return error(401)
  //     }
  //     var func = result.substr(2, 2)
  //     if (func !== '10') {
  //       return error(402)
  //     }
  //     var json = {
  //       shortAddress: options.shortAddress,
  //       name: devicename + options.shortAddress,
  //       checks: defaultCheck,
  //       attribute: attribute
  //     }
  //     return success(json)
  //   }
  // }
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
  var commond1 = this.validate.crc16(addr + '0100000001')   //变频器1启停
  var commond2 = this.validate.crc16(addr + '0100010001')   //变频器2启停
  var commond3 = this.validate.crc16(addr + '0100020001')   //综合运行
  var commond4 = this.validate.crc16(addr + '0100030001')   //综合故障
  var commond5 = this.validate.crc16(addr + '0100080001')   //本地远程
  var commond6 = this.validate.crc16(addr + '0100090001')   //远程启停
  // var commond7 = this.validate.crc16(addr + '01000A0001')   //远程复位
  // var commond8 = this.validate.crc16(addr + '01000B0001')   //变频器手自动
  var commond9 = this.validate.crc16(addr + '0200000001')   //变频器1运行
  var commond10 = this.validate.crc16(addr + '0200010001')  //变频器1故障
  var commond11 = this.validate.crc16(addr + '0200020001')  //变频器2运行
  var commond12 = this.validate.crc16(addr + '0200030001')  //变频器2故障
  var commond13 = this.validate.crc16(addr + '0200040001')  //安全信号
  var commond14 = this.validate.crc16(addr + '0200080001')  //远程启停中继
  var commond15 = this.validate.crc16(addr + '0200090001')  //致命故障
  var commond16 = this.validate.crc16(addr + '02000A0001')  //压力传感器故障
  // var commond17 = this.validate.crc16(addr + '0300000001')  //时间设定_远程
  var commond18 = this.validate.crc16(addr + '0300010002')  //运行频率1
  var commond19 = this.validate.crc16(addr + '0300030002')  //运行频率2
  var commond20 = this.validate.crc16(addr + '0300050002')  //实时压力值
  // var commond21 = this.validate.crc16(addr + '0300070001')  //压力设定_远程
  // var commond22 = this.validate.crc16(addr + '0300090001')  //手动频率1_远程
  // var commond23 = this.validate.crc16(addr + '03000B0001')  //手动频率2_远程
  var cmd = []
  if(code.indexOf('11')>-1){
    cmd.push(commond1)
    // console.log('commond1='+commond1)
  }
  if(code.indexOf('12')>-1){
    cmd.push(commond2)
    // console.log('commond2='+commond2)
  }
  if(code.indexOf('13')>-1){
    cmd.push(commond3)
    // console.log('commond3='+commond3)
  }
  if(code.indexOf('14')>-1){
    cmd.push(commond4)
    // console.log('commond4='+commond4)
  }
  if(code.indexOf('15')>-1){
    cmd.push(commond5)
    // console.log('commond5='+commond5)
  }
  if(code.indexOf('16')>-1){
    cmd.push(commond6)
    // console.log('commond6='+commond6)
  }
  // if(code.indexOf('17')>-1){
  //   cmd.push(commond7)
    // console.log('commond7='+commond7)
  // }
  // if(code.indexOf('18')>-1){
  //   cmd.push(commond8)
    // console.log('commond8='+commond8)
  // }
  if(code.indexOf('21')>-1){
    cmd.push(commond9)
    // console.log('commond9='+commond9)
  }
  if(code.indexOf('22')>-1){
    cmd.push(commond10)
    // console.log('commond10='+commond10)
  }
  if(code.indexOf('23')>-1){
    cmd.push(commond11)
    // console.log('commond11='+commond11)
  }
  if(code.indexOf('24')>-1){
    cmd.push(commond12)
    // console.log('commond12='+commond12)
  }
  if(code.indexOf('25')>-1){
    cmd.push(commond13)
    // console.log('commond13='+commond13)
  }
  if(code.indexOf('26')>-1){
    cmd.push(commond14)
    // console.log('commond14='+commond14)
  }
  if(code.indexOf('27')>-1){
    cmd.push(commond15)
    // console.log('commond15='+commond15)
  }
  if(code.indexOf('28')>-1){
    cmd.push(commond16)
    // console.log('commond16='+commond16)
  }
  // if(code.indexOf('31')>-1){
  //   cmd.push(commond17)
    // console.log('commond17='+commond17)
  // }
  if(code.indexOf('32')>-1){
    cmd.push(commond18)
    // console.log('commond18='+commond18)
  }
  if(code.indexOf('33')>-1){
    cmd.push(commond19)
    // console.log('commond19='+commond19)
  }
  if(code.indexOf('34')>-1){
    cmd.push(commond20)
    // console.log('commond20='+commond20)
  }
  // if(code.indexOf('35')>-1){
  //   cmd.push(commond21)
    // console.log('commond21='+commond21)
  // }
  // if(code.indexOf('36')>-1){
  //   cmd.push(commond22)
    // console.log('commond22='+commond22)
  // }
  // if(code.indexOf('37')>-1){
  //   cmd.push(commond23)
    // console.log('commond23='+commond23)
  // }
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
      for (var i = 0; i < data.length; i++) {
        var item = data[i]
        item = item.substr(0, item.length - 4)
        // console.log(item)
        var validatedata = validate.crc16(item)
        // console.log(validatedata)
        if (validatedata.toLowerCase() !== data[i].toLowerCase()) {
          return error(401)
        }
        var addrback = item.substr(0, 2)
        if (addrback !== addr.toLowerCase()) {
          return error(403)
        }
        var func = item.substr(2, 2)
          // if (func !== '03') {
          //   return error(402)
          // }
        if (cmd[i] === commond1 && func == '01') {
          allChecks['11'] = item.substr(6, 2)
        }else if (cmd[i] === commond2 && func == '01') {
          allChecks['12'] = item.substr(6, 2)
        }else if (cmd[i] === commond3 && func == '01') {
          allChecks['13'] = item.substr(6, 2)
        }else if (cmd[i] === commond4 && func == '01') {
          allChecks['14'] = item.substr(6, 2)
        }else if (cmd[i] === commond5 && func == '01') {
          allChecks['15'] = item.substr(6, 2)
        }else if (cmd[i] === commond6 && func == '01') {
          allChecks['16'] = item.substr(6, 2)
        }
        // else if (cmd[i] === commond7 && func == '01') {
        //   allChecks['17'] = item.substr(6, 2)
        // }else if (cmd[i] === commond8 && func == '01') {
        //   allChecks['18'] = item.substr(6, 2)
        // }
        else if (cmd[i] === commond9 && func == '02') {
          allChecks['21'] = item.substr(6, 2)
        }else if (cmd[i] === commond10 && func == '02') {
          allChecks['22'] = item.substr(6, 2)
        }else if (cmd[i] === commond11 && func == '02') {
          allChecks['23'] = item.substr(6, 2)
        }else if (cmd[i] === commond12 && func == '02') {
          allChecks['24'] = item.substr(6, 2)
        }else if (cmd[i] === commond13 && func == '02') {
          allChecks['25'] = item.substr(6, 2)
        }else if (cmd[i] === commond14 && func == '02') {
          allChecks['26'] = item.substr(6, 2)
        }else if (cmd[i] === commond15 && func == '02') {
          allChecks['27'] = item.substr(6, 2)
        }else if (cmd[i] === commond16 && func == '02') {
          allChecks['28'] = item.substr(6, 2)
        }
        // else if (cmd[i] === commond17 && func == '03') {
        //   allChecks['31'] = item.substr(6, 4)
        // }
        else if (cmd[i] === commond18 && func == '03') {
          allChecks['32'] = item.substr(6, 8)
        }else if (cmd[i] === commond19 && func == '03') {
          allChecks['33'] = item.substr(6, 8)
        }else if (cmd[i] === commond20 && func == '03') {
          allChecks['34'] = item.substr(6, 8)
        }
        // else if (cmd[i] === commond21 && func == '03') {
        //   allChecks['35'] = item.substr(6, 4)
        // }else if (cmd[i] === commond22 && func == '03') {
        //   allChecks['36'] = item.substr(6, 4)
        // }else if (cmd[i] === commond23 && func == '03') {
        //   allChecks['37'] = item.substr(6, 4)
        // }
        // console.log(allChecks['1'])
        // var db = parseInt(result.substr(18, 2), 16)
        // res['0']= db
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

//写
Relay.prototype.write = function(addr, code, state) { // 01 05 00 03 FF 00 7C 3A 线圈4 01 05 00 03 00 00 3D CA
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var validate = this.validate
  while (code.length < 3) {
    code = '0' + code
  }
  while (state.length < 4) {
    state = '0' + state
  }
  // if (state === 1)state = 'ff'
  // else state = '00'
  var codeone=''
  if(code==='101'){
    codeone='050008'
  }else if(code==='102'){
    codeone='050009'
  }else if(code==='103'){
    codeone='05000A'
  }else if(code==='104'){
    codeone='05000B'
  }else if(code==='201'){
    codeone='060000'
  }else if(code==='202'){
    codeone='060007'
  }else if(code==='203'){
    codeone='060009'
  }else if(code==='204'){
    codeone='06000B'
  }
  var commond = validate.crc16(addr + codeone + state)
  return {
    cmd: commond,
    resolve: function(result, success, error) {
      // result = rmDb(result)
      if (result.length < 16) {
        return error(400)
      }
      var data = result.substr(0, result.length - 4)
      var validatedata = validate.crc16(data)
      if (validatedata !== result) {
        return error(401)
      }
      var addrback = result.substr(0, 2)
      if (addrback !== addr.toLowerCase()) {
        return error(403)
      }
      var func = result.substr(2, 2)
      if (func !== '05'&&func!=='06') {
        return error(402)
      }
      data = result.substr(8, 4)
      // if (data === 'ff')data = 1
      // else if (data === '00')data = 0
      return success(data)
    }
  }
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
      // console.log(JSON.stringify(params))
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