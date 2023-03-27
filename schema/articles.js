// 导入定义验证规则的模块
const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const content = joi.string().required().allow('')
// const status = joi.string().valid('发布', '存草稿').required()
const status = joi.number().integer().min(0).required()
const categoryId = joi.number().integer().min(1).required()

// 校验规则对象 - 添加分类
exports.publish_article_schema = {
  body: {
    title,
    content,
    coverImg: title,
    status,
    categoryId
  }
}