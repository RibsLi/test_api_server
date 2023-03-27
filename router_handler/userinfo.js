const bcrypt = require('bcryptjs')
const db = require('../database/index')

// 获取用户信息
exports.getUserinfo = (req, res) => {
  const sql = 'SELECT id, username, nickname, email, avatar FROM ev_users WHERE id=?'
  // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
  db.query(sql, req.auth.id, (err, result) => {
    if (err) return res.cc(err)
    if (!result.length) return res.cc('获取用户信息失败！')
    res.send({
      status: 0,
      message: '获取用户基本信息成功！',
      data: result[0]
    })
  })
}

// 更新用户信息
exports.updateUserinfo = (req, res) => {
  const sql = 'UPDATE ev_users SET ? WHERE id=?'
  // 注意此处使用的 id 是 token 中的id，为了安全不应该前端传用户id
  db.query(sql, [req.body, req.auth.id], (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('修改信息失败！')
    res.cc('修改信息成功！', 0)
  })
}

// 重置用户密码
exports.updatePassword = (req, res) => {
  // 根据 id 查询用户是否存在
  const sql1 = 'SELECT * FROM ev_users WHERE id=?'
  db.query(sql1, req.auth.id, (err1, result1) => {
    if (err1) return res.cc(err1)
    // 检查指定 id 的用户是否存在
    if (!result1.length) return res.cc('用户不存在！')
    // 判断提交的 旧密码 是否正确
    // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
    // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
    if (!bcrypt.compareSync(req.body.oldPassword, result1[0].password)) return res.cc('原密码错误！')
    
    const sql2 = 'UPDATE ev_users SET password=? WHERE id=?'
    // 对新密码进行 bcrypt 加密之后，更新到数据库中
    const newPwd = bcrypt.hashSync(req.body.newPassword, 10)
    // 注意此处使用的 id 是 token 中的id，为了安全不应该前端传用户id
    db.query(sql2, [newPwd, req.auth.id], (err2, result2) => {
      if (err2) return res.cc(err2)
      if (result2.affectedRows !== 1) return res.cc('修改密码失败！')
      res.cc('修改密码成功！', 0)
    })
  })
}

// 更新用户头像
exports.updateAvatar = (req, res) => {
  // 根据 id 查询用户是否存在
  const sql1 = 'SELECT * FROM ev_users WHERE id=?'
  db.query(sql1, req.auth.id, (err1, result1) => {
    if (err1) return res.cc(err1)
    // 检查指定 id 的用户是否存在
    if (!result1.length) return res.cc('用户不存在！')

    const sql2 = 'UPDATE ev_users SET avatar=? WHERE id=?'
    // 注意此处使用的 id 是 token 中的id，为了安全不应该前端传用户id
    db.query(sql2, [req.body.avatar, req.auth.id], (err2, result2) => {
      if (err2) return res.cc(err2)
      if (result2.affectedRows !== 1) return res.cc('修改头像失败！')
      res.cc('修改头像成功！', 0)
    })
  })
}
