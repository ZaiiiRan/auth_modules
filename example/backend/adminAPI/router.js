const Router = require('express').Router
const rolesMiddleware = require('./rolesMiddleware')
const controller = require('./controller')

const adminRouter = new Router()

adminRouter.get('/users', rolesMiddleware, controller.getUsers)
adminRouter.post('/update-role', rolesMiddleware, controller.updateRole)

module.exports = adminRouter