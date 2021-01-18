const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  sort: {
    type: Number
  },
  desc: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Role', RoleSchema)
