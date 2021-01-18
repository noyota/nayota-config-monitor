// Todo
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ControlbuttonSchema = new Schema({
  name: {// 名称
    type: String
  }})

module.exports = ControlbuttonSchema
