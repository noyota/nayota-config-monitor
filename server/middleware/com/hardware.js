// 保存设备和采集/控制
const mongoose = require('mongoose')
// const LoraSlave = mongoose.model('LoraSlave')
const Control = mongoose.model('Control')
const Check = mongoose.model('Check')
const Operate = mongoose.model('Operate')
const Hardware = mongoose.model('Hardware')

exports.createHardware = async function(options) {
  let hardware = await Hardware.findOne({ address: options.address })
  const control = await Control.findOne({ number: options.lora.netAddr })
  if (hardware !== null) {
    await Check.remove({ hardware: hardware._id })
    await Operate.remove({ hardware: hardware._id })
    await Hardware.remove({ _id: hardware._id })
  }
  hardware = new Hardware()
  hardware.name = options.name
  hardware.control = control._id
  hardware.address = options.address
  await hardware.save()
  if (options.test !== undefined) {
    options.test.map(check => function() {
      check.hardware = hardware._id
      check.control = control._id
      if (hardware.loraSlave) {
        check.loraSlave = hardware.loraSlave
        check.type = 0
      } else {
        check.type = 1
      }
      check.line = true
    })
    Check.create(options.test)
  }
  if (options.button !== undefined) {
    options.button.map(operate => function() {
      operate.hardware = hardware._id
      operate.control = control._id
      if (hardware.loraSlave) {
        operate.loraSlave = hardware.loraSlave
        operate.type = 0
      } else {
        operate.type = 1
      }
      operate.line = true
    })
    Operate.create(options.button)
  }
}
