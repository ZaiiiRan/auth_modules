const Router = require('express').Router
const rolesMiddleware = require('./rolesMiddleware')
const controller = require('./controller')

const adminRouter = new Router()

adminRouter.post('/users', rolesMiddleware, controller.getUsers)
adminRouter.post('/update-role', rolesMiddleware, controller.updateRole)
adminRouter.post('/block', rolesMiddleware, controller.blockUser)
adminRouter.post('/unblock', rolesMiddleware, controller.unblockUser)

module.exports = adminRouter