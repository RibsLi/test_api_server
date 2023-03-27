const db = require('../database/index')

// 获取文章分类列表
exports.getCategory = (req, res) => {
  // 获取所有未被删除的分类列表数据
  const sql = 'SELECT * FROM ev_article_cate WHERE isDelete=0 ORDER BY id'
  db.query(sql, (err, result) => {
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章分类列表成功！',
      data: result
    })
  })
}

// 新增文章分类
exports.addCategory = (req, res) => {
  const sql = 'INSERT INTO ev_article_cate SET ?'
  db.query(sql, req.body, (err, result) => {
    // SQL 语句执行失败
    if (err) return res.cc(err)
    // SQL 语句执行成功，但是影响行数不等于 1
    if (result.affectedRows !== 1) return res.cc('新增文章分类失败！')
    // 新增文章分类成功
    res.cc('新增文章分类成功！', 0)
  })

  // // 查询 分类名称 与 分类别名 是否被占用
  // const sql1 = 'SELECT * FROM ev_article_cate WHERE name=? OR alias=?'
  // db.query(sql1, [req.body.name, req.body.alias], (err1, result1) => {
  //   if (err1) return res.cc(err1)
  //   // 分类名称 和 分类别名 都被占用
  //   if (result1.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
  //   if (result1.length === 1 && result1[0].name === req.body.name && result1[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
  //   // 分类名称 或 分类别名 被占用
  //   if (result1.length === 1 && result1[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试！')
  //   if (result1.length === 1 && result1[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试！')

  //   const sql2 = 'INSERT INTO ev_article_cate SET ?'
  //   db.query(sql2, req.body, (err2, result2) => {
  //     // SQL 语句执行失败
  //     if (err2) return res.cc(err2)
  //     // SQL 语句执行成功，但是影响行数不等于 1
  //     if (result2.affectedRows !== 1) return res.cc('新增文章分类失败！')
  //     // 新增文章分类成功
  //     res.cc('新增文章分类成功！', 0)
  //   })
  // })
}

// 根据 Id 删除文章分类
exports.deleteCategory = (req, res) => {
  // 查询数据库中是否存在这条数据
  const sql1 = 'SELECT * FROM ev_article_cate WHERE id=?'
  db.query(sql1, req.body.id, (err1, result1) => {
    if (err1) return res.cc(err1)
    if (!result1.length) return res.cc('分类信息不存在！')

    // 修改 SQL 数据库对应分类的状态为1
    const sql2 = 'UPDATE ev_article_cate SET isDelete=1 WHERE id=?'
    db.query(sql2, req.body.id, (err2, result2) => {
      if (err2) return res.cc(err2)
      if (result2.affectedRows !== 1) return res.cc('删除文章分类失败！')
      res.cc('删除文章分类成功！', 0)
    })
  })
}

// 根据 Id 获取文章分类
exports.getCategoryById = (req, res) => {
  // 查询 分类名称 与 分类别名 是否被占用
  const sql1 = 'SELECT * FROM ev_article_cate WHERE id=?'
  db.query(sql1, req.body.id, (err, result) => {
    if (err) return res.cc(err)
    if (!result.length) return res.cc('分类信息不存在！')
    // 把数据响应给客户端
    res.send({
      status: 0,
      message: result[0].isDelete ? '文章分类已被删除！' : '获取文章分类数据成功！',
      data: result[0].isDelete ? {} : result[0]
    })
  })
}

// 根据 Id 修改文章分类
exports.updateCategoryById = (req, res) => {
  // 查询数据库中是否存在这条数据
  const sql1 = 'SELECT * FROM ev_article_cate WHERE id=?'
  db.query(sql1, req.body.id, (err1, result1) => {
    if (err1) return res.cc(err1)
    if (!result1.length) return res.cc('分类信息不存在！')

    // 修改 SQL 数据库对应分类的状态为1
    const sql2 = 'UPDATE ev_article_cate SET ? WHERE id=?'
    db.query(sql2, [req.body, req.body.id], (err2, result2) => {
      if (err2) return res.cc(err2)
      if (result2.affectedRows !== 1) return res.cc('修改文章分类失败！')
      res.cc('修改文章分类成功！', 0)
    })
  })
}
