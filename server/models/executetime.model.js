const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')
// 时间子文档(exe)
const ExecutetimeSchema = new Schema({
  years: {// 年
    type: Number
  },
  months: {// 月
    type: Number
  },
  days: {// 日
    type: Number
  },
  weeks: [{
    type: Number
  }],
  hours: {// 时
    type: Number
  },
  minutes: {//  分
    type: Number
  },
  seconds: {//  秒
    type: Number
  }
})
ExecutetimeSchema.plugin(autopopulate)
module.exports = ExecutetimeSchema
