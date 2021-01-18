const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 检测/控制子文档(detCon)
const DetconSchema = new Schema({
  name: {// 名称
    type: String
  },
  company: {// 单位
    type: String
  },
  icon: { // 图标// 图标
    type: String
  },
  btn_type: {// 按钮类型
    type: String
  },
  analysis: {// 解析函数
    type: String
  },
  address: {// 地址
    type: String
  },
  sort: {// 排序
    type: Number
  },
  precision: {// 精度 判断值上报最小条件
    type: Number
  },
  interval: {//   区间 意 值 对应
    type: String// Array
  },
  chartModel: {// 图表模板？
    type: String
  },
  numericalValue: {// Number
    type: Number
  },
  exAnalysis: {// 异常函数
    type: String
  },
  intervalType: {// 区间类型
    type: Number
  },
  canRead: { // 是否可主动读取
    type: Boolean
  },
  boardConfigStr: {// 看板样式配置String
    type: String
  }

})

module.exports = DetconSchema
