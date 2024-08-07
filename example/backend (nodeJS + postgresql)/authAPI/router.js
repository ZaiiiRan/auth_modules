const Router = require('express').Router
const userController = require('./controllers/UserController')
const authMiddleware = require('./middleware/authMiddleware')

const authRouter = new Router()


authRouter.post('/register', userController.register)
authRouter.post('/login', userController.login)
authRouter.post('/logout', userController.logout)
authRouter.post('/change-username', authMiddleware, userController.changeUsername)
authRouter.post('/change-email', authMiddleware, userController.changeEmail)
authRouter.post('/change-password', authMiddleware, userController.changePassword)
authRouter.get('/refresh', userController.refresh)
authRouter.get('/activate/:link', userController.activate)

module.exports = authRouter