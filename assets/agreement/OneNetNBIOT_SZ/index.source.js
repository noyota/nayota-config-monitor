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
  const TDS = model.attribute.filter(item => item.key === 'TDS')[0].value
  return {
    imei,
    obj_id,
    obj_inst_id,
    res_id,
    val: JSON.stringify({ TDSID: [0], TDS: TDS.split(',').map(i => parseInt(i)), TYPE: 1, SLEEPTIME: parseInt(SLEEPTIME), SENDTIME: parseInt(SENDTIME), STATE: 2 }),
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

Relay.prototype.decode = function(result) {
  try {
    const data = JSON.parse(result)
    return {
      0: data.V,
      4: data.E,
      3: data.N,
      1: data['0'][0],
      2: data['0'][1]
    }
  } catch (e) {
    return null
  }
}

module.exports = Relay
