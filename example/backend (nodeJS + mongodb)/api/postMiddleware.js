const ApiError = require('../authAPI/AuthAPIError')
const tokenService = require('../authAPI/services/TokenService')
const UserModel = require('../authAPI/models/UserModel')

module.exports = async function (req, res, next) {
    try {
        const userData = req.user

        const user = await UserModel.findById(userData.id)
        if (!user) return next(ApiError.UnauthorizedError())

        if (user.isBlocked === true) next(ApiError.UnauthorizedError())
        if (!user.isActivated) next(ApiError.UnauthorizedError())

        const { userID } = req.body
        
        //если был получен id другого пользователя и отправлявший пользователь
        //не является админом, то ошибка
        if (!user.roles.includes('ADMIN') && userID !== userData.id) 
            next(ApiError.UnauthorizedError())

        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}