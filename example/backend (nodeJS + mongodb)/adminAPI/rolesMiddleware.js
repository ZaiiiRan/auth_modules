const ApiError = require('../authAPI/AuthAPIError')
const tokenService = require('../authAPI/services/TokenService')
const userModel = require('../authAPI/models/UserModel')

module.exports = async function (req, res, next) {
    try {
        const userData = req.user

        //просмотрим роль в БД, потому что пользователь мог воспользоваться
        //старым токеном со старой ролью
        const user = await userModel.findById(userData.id)
        if (!user) return next(ApiError.UnauthorizedError())
        else if (!user.roles.includes('ADMIN')) return next(ApiError.UnauthorizedError())
        else if (user.isBlocked) return next(ApiError.UnauthorizedError())

        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}