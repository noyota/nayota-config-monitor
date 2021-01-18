const express = require('express')
const passport = require('passport')
const authCtrl = require('../controllers/auth.controller')
const router = express.Router()
module.exports = router

/**
 * @api {post} /auth/login 用户登录
 * @apiDescription 用户登录
 * @apiName login
 * @apiGroup Auth
 * @apiParam {string} username 用户名
 * @apiParam {string} password 密码
 * @apiParamExample {json} example.js:
 * {username:'admin',password:'123456'}
 * @apiSuccess  user 返回user
 * @apiSuccess  token 返回token
 * @apiSuccessExample {json} Success-Response:
 *  {"code":0,data:{user:"",token:{}}}
 * @apiVersion 1.0.0
 */
// router.post('/login', passport.authenticate('local', { session: false }), login)
router.post('/login', (req, res, next) => {
  passport.authenticate('local', async function(err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.json({ code: 401, message: '你输入的账户名和密码不匹配！' })
    }
    // let iscloud = false
    // if (user.type === 1) {
    //   const father = await userCtrl.checkUser({ _id: mongoose.Types.ObjectId(user.father) })
    //   if (father !== null) {
    //     iscloud = father.cloudType === undefined ? true : father.cloudType
    //   }
    // } else {
    //   iscloud = user.cloudType === undefined ? true : user.cloudType
    // }
    // if ((iscloud === false) && process.env.ROLE === 'serve' && (user.username !== 'admin' || (user.roles !== null && !user.roles.some(role => role.name === 'admin')))) {
    //   return res.json({ code: 402, message: '当前账号未开通云服务,无法登陆！' })
    // }
    const token = authCtrl.generateToken({ _id: user._id, username: user.username })
    res.json({ code: 0, data: { user, token }})
  })(req, res, next)
})

router.get('/me', login)

router.post('/logout', (req, res) => {
  res.send({ code: 0, data: 'OK' })
})

function login(req, res) {
  const user = req.user
  const token = authCtrl.generateToken({ _id: user._id, username: user.username })
  res.json({ code: 0, data: { user, token }})
}
