const Router = require('express').Router
const userController = require('./controllers/UserController')
const errorMiddleware = require('./middleware/errorMiddleware')
const checkUserMiddleware = require('./middleware/checkUserMiddleware')

const authRouter = new Router()
authRouter.use(errorMiddleware)

authRouter.post('/register', userController.register)
authRouter.post('/login', userController.login)
authRouter.post('/logout', userController.logout)
authRouter.post('/change-username', checkUserMiddleware, userController.changeUsername)
authRouter.post('/change-email', checkUserMiddleware, userController.changeEmail)
authRouter.post('/change-password', checkUserMiddleware, userController.changePassword)
authRouter.get('/refresh', userController.refresh)
authRouter.get('/activate/:link', userController.activate)

module.exports = authRouter