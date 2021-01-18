function Relay(options, validate) {
  this.addrmin = 1 // 地址最小
  this.addrmax = 10 // 地址最大
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
  var commond = ''
  while (addr <= end) {
    var addrS = addr.toString(16)
    while (addrS.length < 2) {
      addrS = '0' + addrS
    }
    commond += this.validate.crc16(addrS + '0400000001') + ','
    addr++
  }
  var validate = this.validate
  var devicename = this.options.name
  var defaultCheck = this.options.defaultCheck
  var defaultOperates=this.options.defaultOperate
  var attribute = []
  if (this.options.attribute !== undefined) {
    attribute = this.options.attribute
  }
  console.log("cmd="+commond)
  return {
    cmd: commond.substr(0, commond.length - 1),
    resolve: function(result, success, error) {
      console.log(result+"-----"+result.length)
      if (result.length < 14) {
        return error(400)
      }
      var func = result.substr(2, 2)
      console.log("func="+func)
      if (func != '04') {
        return error(402)
      }
      var address = result.substr(0, 2)
      console.log("address="+address)
      var json = {
        shortAddress: address,
        name: devicename + address,
        checks: defaultCheck,
        operates: defaultOperates,
        attribute: attribute
      }
      console.log(json)
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
}

/**
     * 读取数据
     */
Relay.prototype.read = function(addr, code) {
  if (code == null){
  	code = this.checksAddress
  }
  else if (typeof code == 'string'){
  	code = [code]
  }
  var cmd = []
  if (typeof addr == "number")
    addr = addr.toString(16);
  while (addr.length < 2) {
    addr = '0' + addr
  }
  var analysis = []
  var _this = this
  code.forEach(function(item) {
    analysis.push(_this['analysis' + item])
  })
  var addr1=''
  var validate = this.validate
  if (code.indexOf('101') > -1 || code.indexOf('201') > -1 || code.indexOf('301') > -1 || code.indexOf('401') > -1 ) {
    addr1 = '07D0'
	var commond1 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond1)
  }
  if (code.indexOf('102') > -1 || code.indexOf('202') > -1 || code.indexOf('302') > -1 || code.indexOf('402') > -1 ) {
    addr1 = '07D6'
	var commond2 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond2)
  }
  if (code.indexOf('103') > -1 || code.indexOf('203') > -1 || code.indexOf('303') > -1 || code.indexOf('403') > -1 ) {
    addr1 = '07DC'
	var commond3 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond3)
  }
  if (code.indexOf('104') > -1 || code.indexOf('204') > -1 || code.indexOf('304') > -1 || code.indexOf('404') > -1 ) {
    addr1 = '07E2'
	var commond4 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond4)
  }
  if (code.indexOf('105') > -1 || code.indexOf('205') > -1 || code.indexOf('305') > -1 || code.indexOf('405') > -1 ) {
    addr1 = '07E8'
	var commond5 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond5)
  }
  if (code.indexOf('106') > -1 || code.indexOf('206') > -1 || code.indexOf('306') > -1 || code.indexOf('406') > -1 ) {
    addr1 = '07EE'
	var commond6 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond6)
  }
  if (code.indexOf('107') > -1 || code.indexOf('207') > -1 || code.indexOf('307') > -1 || code.indexOf('407') > -1 ) {
    addr1 = '07F4'
	var commond7 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond7)
  }
  if (code.indexOf('108') > -1 || code.indexOf('208') > -1 || code.indexOf('308') > -1 || code.indexOf('408') > -1 ) {
    addr1 = '07FA'
	var commond8 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond8)
  }
  if (code.indexOf('109') > -1 || code.indexOf('209') > -1 || code.indexOf('309') > -1 || code.indexOf('409') > -1 ) {
    addr1 = '0800'
	var commond9 = this.validate.crc16(addr + '04' + addr1 + '0006')
    cmd.push(commond9)
  }
  console.log("cmd="+ cmd)
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
        if (item.length < 34) {
            return error(400);
        }
        var func = item.substr(2, 2);
        if (func != '04') {
            return error(401);
        }
        var addrback = item.substr(0, 2);
        if (addrback != addr.toLowerCase()) {
            return error(403);
        }
        var func2 = item.substr(4, 2);
        if (func2 != '0c') {
            return error(402);
        }
        // allChecks['101'] = item.substr(6, 12) 
  		if(cmd[i] === commond1){
  			allChecks['101']=item.substr(6,2)				//风速
			allChecks['201']=item.substr(8,2)				//开关
			allChecks['301']=item.substr(12,2)				//模式
			allChecks['401']=item.substr(14,4)				//温度
  		}
  		if(cmd[i] === commond2){
  			allChecks['102']=item.substr(6,2)				//风速
			allChecks['202']=item.substr(8,2)				//开关
			allChecks['302']=item.substr(12,2)				//模式
			allChecks['402']=item.substr(14,4)				//温度
  		}
  		if(cmd[i] === commond3){
  			allChecks['103']=item.substr(6,2)				//风速
			allChecks['203']=item.substr(8,2)				//开关
			allChecks['303']=item.substr(12,2)				//模式
			allChecks['403']=item.substr(14,4)				//温度
  		}
  		if(cmd[i] === commond4){
  			allChecks['104']=item.substr(6,2)				//风速
			allChecks['204']=item.substr(8,2)				//开关
			allChecks['304']=item.substr(12,2)				//模式
			allChecks['404']=item.substr(14,4)				//温度
  		}
  		if(cmd[i] === commond5){
  			allChecks['105']=item.substr(6,2)				//风速
			allChecks['205']=item.substr(8,2)				//开关
			allChecks['305']=item.substr(12,2)				//模式
			allChecks['405']=item.substr(14,4)				//温度
  		}
  		if(cmd[i] === commond6){
  			allChecks['106']=item.substr(6,2)				//风速
			allChecks['206']=item.substr(8,2)				//开关
			allChecks['306']=item.substr(12,2)				//模式
			allChecks['406']=item.substr(14,4)				//温度
  		}
  		if(cmd[i] === commond7){
  			allChecks['107']=item.substr(6,2)				//风速
			allChecks['207']=item.substr(8,2)				//开关
			allChecks['307']=item.substr(12,2)				//模式
			allChecks['407']=item.substr(14,4)				//温度
  		}
  		if(cmd[i] === commond8){
  			allChecks['108']=item.substr(6,2)				//风速
			allChecks['208']=item.substr(8,2)				//开关
			allChecks['308']=item.substr(12,2)				//模式
			allChecks['408']=item.substr(14,4)				//温度
  		} 
  		if(cmd[i] === commond9){
  			allChecks['109']=item.substr(6,2)				//风速
			allChecks['209']=item.substr(8,2)				//开关
			allChecks['309']=item.substr(12,2)				//模式
			allChecks['409']=item.substr(14,4)				//温度
  		}
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

/*
     状态码转命令
     */
function state_to_cmd(state) {
  state = state.split('_')// 状态数组，0为开关，1为模式，2为温度，3为风速
  var command = ''
  var fs = parseInt(state[3]).toString(2)
  if (fs.length < 2) {
    fs = '0' + fs
  }
  var status = parseInt('00' + state[1] + state[0] + '00' + fs, 2).toString(16)
  var temp = parseInt(state[2]).toString(16)
  while (temp.length < 2) {
    temp = '0' + temp
  }
  while (status.length < 2) {
    status = '0' + status
  }
  command = status + '00' + temp + '00'
  return command
}

//写设备
Relay.prototype.write = function (addr,code,state,operates) {
	var maxtemp = 30// 暖风的上限可调，下限10
	  var mintemp = 16// 冷风的下限可调，上限30
	  addr = addr.toString(16)
	  while (addr.length < 2) { // 地址
	    addr = '0' + addr
	  }
	  var launch = 0; var moshi = 0; var fan = 0; var set_temp = 25
	  operates.forEach(function(item) {
	    if (item.shortAddress === '1')launch = item.value || 0
	    else if (item.shortAddress === '2')moshi = item.value || 0
	    else if (item.shortAddress === '3')fan = item.value || 0
	    else if (item.shortAddress === '4')set_temp = item.value || 25
	  })
        var state2=state;
        var cold=25;
        var power=0;
        var fen=0;
        var mo = 0;
        if(state==2){             //开机
            state="FF61";
        }else if(state==0){      //关机
            state="FF60";
        }else if(state==3){     //温度+
        	// set_temp++;
            state="";
        }else if(state==4){     //温度-
        	// set_temp--;
            state="";
        }else if(state==5){     //风速1
            state="10FF";
        }else if(state==6){     //风速2
            state="20FF";
        }else if(state==7){     //风速3
            state="30FF";
        }else if(state==8){     //风速4
            state="40FF";
        }else if(state==9){     //风速5
            state="50FF";
        }else if(state==10){     //制冷
            state="0002";
        }else if(state==11){     //制热
            state="0001";
        }else if(state==12){     //除湿
            state="0007";
        }else if(state==13){     //自动
            state="0000";
        }else if(state==14){     //当前状态查询
            state="0003";
        }
        if (set_temp > maxtemp)set_temp = maxtemp
		if (set_temp < mintemp)set_temp = mintemp
        var add1 = 2000+(code-1)*3;
        add1 = add1.toString(16);
        while (add1.length<4){
            add1="0"+add1;
        }

        var add2 =2001+(code-1)*3;
        add2 = add2.toString(16);
        while (add2.length<4){
            add2="0"+add2;
        }

        addr=addr.toString(16);
        while (addr.length<2){
            addr="0"+addr;
        }
        var add3 =2002+(code-1)*3;
        add3 = add3.toString(16);
        while (add3.length<4){
            add3="0"+add3;
        }
        validate=this.validate;
        if(state2==0){
            var commond=addr+"06"+add1+state+"FFFF";
        }else if(state2==2){
            var commond=addr+"06"+add1+state+"FFFF";
        }
        else if(state2==5||state2==6||state2==7||state2==8||state2==9){
            var commond=addr+"06"+add1+state+"FFFF";
        }else if(state2==10||state2==11||state2==12||state2==13){
            var commond=addr+"06"+add2+state+"FFFF";
        }else if(state2==14){
            var commond=addr+"0400010004FFFF";
        }else if(state2==3){
	        var wen = (set_temp+1)*10;
	        wen=wen.toString(16);
	        cold= set_temp+1;
	        while (wen.length<4){
	            wen="0"+wen;
	        }
	        var commond=addr+"06"+add3+wen+"FFFF";   
        }else if(state2==4){
            var wen = (set_temp-1)*10;
            wen=wen.toString(16);
            cold= set_temp-1;
            while (wen.length<4){
                wen="0"+wen;
            }
            var commond=addr+"06"+add3+wen+"FFFF";
        }
        console.log(commond)
        //commond=this.validate(commond);
        return {
            cmd:commond,
            resolve:function (result,success,error) {
        	    if(result.length<16){
                    return error(400);
                }
                var data=result.substr(0,2);
                if(data!=addr){
                    return error(401);
                }
                var func=result.substr(2,2);
                if(func!='06'){
                    return error(402);
                }
                var state1=result.substr(8,4);
                if(state2==2||state2==0){              //开关机
                    if(state1=='ff60'){
                    	state2=0;
                    }else if(state1=='ff61'){
                    	state2=2;
                    }
                    success(state2);
                }else if(state2==5||state2==6||state2==7||state2==8||state2==9){      //风速
                	if(state1=='10ff'){
                    	state2=5;
                    }else if(state1=='20ff'){
                    	state2=6;
                    }else if(state1=='30ff'){
                    	state2=7;
                    }else if(state1=='40ff'){
                    	state2=8;
                    }else if(state1=='50ff'){
                    	state2=9;
                    }
                    // let state3=state2-5;
                    success(state2);
                }else if(state2==10||state2==11||state2==12||state2==13){            //模式
                	if(state1=='0002'){
                    	state2=10;
                    }else if(state1=='0001'){
                    	state2=11;
                    }else if(state1=='0007'){
                    	state2=12;
                    }else if(state1=='0000'){
                    	state2=13;
                    }
                    // let state3=state2-10;
                    success(state2);
                }else if(state2==3||state2==4){              //温度
                    state1 = parseInt(state1,16)/10;
                    if(state1!=set_temp+1 && state2==3) {
                    	return error(403);
                    }else if(state1!=set_temp-1 && state2==4){
                    	return error(403);
                    }
                    success(cold);
                }
                // else if(state2==14){                 //当前状态查询
                //     success({cold,power,mo})
                // }
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
  var upTime = parseInt(pars['上报周期']).toString(16)
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

