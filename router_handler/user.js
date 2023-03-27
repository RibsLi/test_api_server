const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken') // 生成 Token 字符串
const db = require('../database/index')
const config = require('../config')

// 注册用户
exports.regUser = (req, res) => {
  const userinfo = req.body
  // 判断表单数据是否合法
  if (!userinfo.username || !userinfo.password) return res.cc('用户名或密码不能为空！')

  // 判断 SQL 数据库中用户名是否被占用
  const sql1 = 'SELECT * FROM ev_users WHERE username=?'
  db.query(sql1, userinfo.username, (err1, result1) => {
    // 执行 SQL 语句失败
    if (err1) return res.cc(err1)
    // 用户名被占用
    if (result1.length) return res.cc('用户名被占用，请更换其他用户名！')

    // 验证通过继续流程
    // 使用 bcryptjs 加密密码
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 将用户数据插入到 SQL 数据库中
    const sql2 = 'INSERT INTO ev_users SET ?'
    db.query(sql2, { username: userinfo.username, password: userinfo.password }, (err2, result2) => {
      // 执行 SQL 语句失败
      if (err2) return res.cc(err2)
      // SQL 语句执行成功，但影响行数不等于 1
      if (result2.affectedRows !== 1) return res.cc('注册用户失败，请稍后再试！')
      // 注册成功
      res.send({ status: 0, message: '注册成功！' })
    })
  })
}

// 登录
// 检测表单数据是否合法
// 根据用户名查询用户的数据
// 判断用户输入的密码是否正确
// 生成 JWT 的 Token 字符串
exports.login = (req, res) => {
  const userinfo = req.body
  const sql = 'SELECT * FROM ev_users WHERE username=?'
  db.query(sql, userinfo.username, (err, result) => {
    if (err) return res.cc(err)
    if (!result.length) return res.cc('登录失败')
    // 拿用户输入的密码，和数据库中存储的密码进行对比
    if(!bcrypt.compareSync(userinfo.password, result[0].password)) return res.cc('密码错误')
    
    // 剔除用户密码和头像
    delete result[0].password
    delete result[0].avatar
    const user = result[0]
    // 将用户信息生成 Token 字符串
    const tokenStr = jwt.sign({ ...user }, config.jwtSecretKey, { expiresIn: '24h' })
    res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: `Bearer ${tokenStr}`,
    })
  })
}

// 获取用户信息
exports.userinfo = (req, res) => {}