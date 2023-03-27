const express = require('express')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const { add_cate_schema, delete_cate_schema, update_cate_schema } = require('../schema/article_category')
const categoryHandler = require('../router_handler/article_category')

const router = express.Router()

// 获取文章分类列表
router.get('/getCategory', categoryHandler.getCategory)

// 新增文章分类
router.post('/addCategory', expressJoi(add_cate_schema), categoryHandler.addCategory)

// 根据 Id 删除文章分类
router.post('/deleteCategory', expressJoi(delete_cate_schema), categoryHandler.deleteCategory)

// 根据 Id 获取文章分类
router.post('/getCategoryById', expressJoi(delete_cate_schema), categoryHandler.getCategoryById)

// 根据 Id 修改文章分类
router.post('/updateCategoryById', expressJoi(update_cate_schema), categoryHandler.updateCategoryById)

module.exports = router