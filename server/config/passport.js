const passport = require('passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const mongoose = require('mongoose')
const User = mongoose.model('User')
const config = require('./config')

const localLogin = new LocalStrategy({
  // username: 'email'
}, async(username, password, done) => {
  let user = await User.findOne({ username })
  if (!user || !user.authenticate(password)) {
    return done(null, false, { error: '登录账户密码错误.' })
  }
  user = user.toObject()
  delete user.salt
  delete user.password
  delete user.mqttPassword
  done(null, user)
})

const jwtLogin = new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}, async(payload, done) => {
  let user = await User.findById(payload._id)
  if (!user) {
    return done(null, false)
  }
  user = user.toObject()
  delete user.salt
  delete user.password
  done(null, user)
})

passport.use(jwtLogin)
passport.use(localLogin)

module.exports = passport
