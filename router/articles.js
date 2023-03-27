const express = require('express')
// 使用 express.urlencoded() 中间件无法解析 multipart/form-data 格式的请求体数据，当前项目，推荐使用 multer 来解析
// const multer  = require('multer')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const { publish_article_schema } = require('../schema/articles')
const articlesHandler = require('../router_handler/articles')

const router = express.Router()

// 发布文章
router.post('/publishArticle', expressJoi(publish_article_schema), articlesHandler.publishArticle)

module.exports = router