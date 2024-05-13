const userService = require('../services/UserService')

class UserController {
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body
            const userData = await userService.register(username, email, password)

            res.cookie('refreshToken', userData.refreshToken, 
                {
                    maxAge: 60 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                }
            )
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body
            const userData = await userService.login(username, password)
            
            res.cookie('refreshToken', userData.refreshToken, 
                {
                    maxAge: 60 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                }
            )
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (e) {
            next(e)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            
            res.cookie('refreshToken', userData.refreshToken, 
                {
                    maxAge: 60 * 24 * 60 * 60 * 1000,
                    httpOnly: true
                }
            )
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link

            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()