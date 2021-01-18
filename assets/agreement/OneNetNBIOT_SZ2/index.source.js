function Relay(options, validate) {
  this.validate = validate
  this.options = options // options.defaulttest  options.defaultbutton
  var _this = this
  _this.checksAddress = []
  options.defaultCheck.forEach(function(test) {
    _this['analysis' + test.address] = test.analysis// test.analysis 解析函数
    _this.checksAddress.push(test.address)
  })
  options.defaultOperate.forEach(function(operate) {
    _this['analysis' + operate.address] = operate.analysis// test.analysis 解析函数
  })
}

Relay.prototype.config = function(model) {
  const imei = model.attribute.filter(item => item.key === 'imei')[0].value
  const obj_id = model.attribute.filter(item => item.key === 'obj_id')[0].value
  const obj_inst_id = model.attribute.filter(item => item.key === 'obj_inst_id')[0].value
  const res_id = model.attribute.filter(item => item.key === 'res_id')[0].value
  const SLEEPTIME = model.attribute.filter(item => item.key === 'SLEEPTIME')[0].value
  const SENDTIME = model.attribute.filter(item => item.key === 'SENDTIME')[0].value
  const type = model.attribute.filter(item => item.key === 'type')[0].value
  const tds = model.attribute.filter(item => item.key === 'tds')[0].value.split(',').map(item => parseInt(item))
  const yl = model.attribute.filter(item => item.key === 'yl')[0].value.split(',').map(item => parseInt(item))
  const yw = model.attribute.filter(item => item.key === 'yw')[0].value.split(',').map(item => parseInt(item))
  const EMC = [['0001', '00A00000A0', ...tds], ['0101', '010300000001840A', ...yl], ['0202', '020300040001C5F8', ...yw]]
  return {
    imei,
    obj_id,
    obj_inst_id,
    res_id,
    val: JSON.stringify({ EMC, TYPE: parseInt(type), SLEEPTIME: parseInt(SLEEPTIME), SENDTIME: parseInt(SENDTIME), STATE: 2 }),
    config: true
  }
}

Relay.prototype.write = function(model, code, state) {
  const imei = model.attribute.filter(item => item.key === 'imei')[0].value
  const obj_id = model.attribute.filter(item => item.key === 'obj_id')[0].value
  const obj_inst_id = model.attribute.filter(item => item.key === 'obj_inst_id')[0].value
  const res_id = model.attribute.filter(item => item.key === 'res_id')[0].value

  return {
    imei,
    obj_id,
    obj_inst_id,
    res_id,
    val: JSON.stringify({ GNSS: '?' })
  }
}
const tdsLib = [{
  bz: 0,
  value: 0
}, {
  bz: 106,
  value: 56
}, {
  bz: 210,
  value: 100
}, {
  bz: 311,
  value: 144
}, {
  bz: 419,
  value: 186
}, {
  bz: 519,
  value: 225
}, {
  bz: 630,
  value: 260
}, {
  bz: 718,
  value: 300
}, {
  bz: 841,
  value: 398
}, {
  bz: 950,
  value: 459
}, {
  bz: 1018,
  value: 520
}, {
  bz: 1146,
  value: 552
}, {
  bz: 1251,
  value: 583
}, {
  bz: 1431,
  value: 653
}, {
  bz: 1573,
  value: 705
}]
Relay.prototype.decode = function(result) {
  try {
    const data = JSON.parse(result)
    let min = null
    let max = null
    const tds = data['0001'][0]
    for (let i = 0; i < tdsLib.length; i++) {
      if (min == null && tdsLib[i].value > tds) {
        min = tdsLib[i - 1]
        max = tdsLib[i]
        break
      }
    }
    let v = tds * 2.2312
    if (min && max)v = (tds - min.value) * (max.bz - min.bz) / (max.value - min.value) + min.bz
    const valueAt = Date.now() - (data.GAPTIME ? data.GAPTIME : 0) * 1000
    return {
      0: data.V,
      4: data.E,
      3: data.N,
      1: parseFloat(v.toFixed(2)),
      2: data['0001'][1],
      yuliang: data['0101'],
      yewei: data['0202'],
      ESQ: data.ESQ,
      valueAt
    }
  } catch (e) {
    return null
  }
}

module.exports = Relay
