const Router = require('express').Router
const userController = require('./controllers/UserController')
const authMiddleware = require('./middleware/authMiddleware')
const checkUserMiddleware = require('./middleware/checkUserMiddleware')

const authRouter = new Router()


authRouter.post('/register', userController.register)
authRouter.post('/login', userController.login)
authRouter.post('/logout', userController.logout)
authRouter.post('/change-username', authMiddleware, checkUserMiddleware, userController.changeUsername)
authRouter.post('/change-email', authMiddleware, checkUserMiddleware, userController.changeEmail)
authRouter.post('/change-password', authMiddleware, checkUserMiddleware, userController.changePassword)
authRouter.get('/refresh', userController.refresh)
authRouter.get('/activate/:link', userController.activate)

module.exports = authRouter