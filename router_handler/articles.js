const db = require('../database/index')

// 获取文章分类列表
exports.publishArticle = (req, res) => {
  const sql = 'INSERT INTO ev_articles SET ?'
  const articleInfo = {
    ...req.body,
    publishDate: new Date(),
    authorId: req.auth.id
  }
  db.query(sql, articleInfo, (err, result) => {
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc(req.body.status ? '保存草稿失败！' : '发布文章失败！')
    res.cc(req.body.status ? '保存草稿成功！' : '发布文章成功！', 0)
  })
}