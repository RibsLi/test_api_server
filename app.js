const express = require('express')
const cors = require('cors')
const joi = require('joi')
const { expressjwt } = require("express-jwt") // 解析 token 的中间件
const config = require('./config')
const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo')
const articleCategory = require('./router/article_category')
const articles = require('./router/articles')

const app = express()
// cors 中间件解决跨域问题
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 处理响应数据的中间件
app.use((req, res, next) => {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
// app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))
app.use(expressjwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: ['/api/reguser', '/api/login'] }))

app.use('/api', [userRouter, userinfoRouter, articleCategory, articles])
// app.use('/api', userRouter)
// app.use('/my', userinfoRouter)
// app.use('/my', articleCategory)

// 错误级别中间件
app.use((err, req, res, next) => {
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})

app.listen(3000, function () {
  console.info('api server running at http://127.0.0.1:3000')
})