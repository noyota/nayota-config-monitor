const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autopopulate = require('mongoose-autopopulate')

var RouterSchema = new Schema({
  type: {
    type: String,
    enum: ['menu', 'api']
  },
  name: {
    type: String
  },
  path: {
    type: String
  },
  level: {
    type: Number
  },
  sort: {
    type: Number
  },
  children: [{
    type: Schema.Types.ObjectId, ref: 'Router',
    autopopulate: { maxDepth: 5, sort: { 'sort': 1 }}
  }],
  method: {
    type: String,
    enum: ['', 'all', 'get', 'post', 'put', 'delete']
  },
  desc: {
    type: String
  },
  roles: [{
    type: Schema.Types.ObjectId, ref: 'Role',
    autopopulate: { maxDepth: 1 }
  }]

}, {
  timestamps: true
})

RouterSchema.plugin(autopopulate)

module.exports = mongoose.model('Router', RouterSchema)
