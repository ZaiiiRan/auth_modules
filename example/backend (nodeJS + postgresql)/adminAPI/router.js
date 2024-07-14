const Router = require('express').Router
const rolesMiddleware = require('./rolesMiddleware')
const authMiddleware = require('../authAPI/middleware/authMiddleware')
const controller = require('./controller')

const adminRouter = new Router()

adminRouter.post('/users', authMiddleware, rolesMiddleware, controller.getUsers)
adminRouter.post('/update-role', authMiddleware, rolesMiddleware, controller.updateRole)
adminRouter.post('/block', authMiddleware, rolesMiddleware, controller.blockUser)
adminRouter.post('/unblock', authMiddleware, rolesMiddleware, controller.unblockUser)

module.exports = adminRouter