const express = require('express')
const expressJoi = require('@escook/express-joi')
const userinfoHandler = require('../router_handler/userinfo')
const { update_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user')

const router = express.Router()

// 获取用户信息
router.get('/getUserinfo', userinfoHandler.getUserinfo)

// 更新用户的基本信息
router.post('/updateUserinfo', expressJoi(update_userinfo_schema), userinfoHandler.updateUserinfo)

// 重置用户密码
router.post('/updatePassword', expressJoi(update_password_schema), userinfoHandler.updatePassword)

// 更新用户头像
router.post('/updateAvatar', expressJoi(update_avatar_schema), userinfoHandler.updateAvatar)

module.exports = router