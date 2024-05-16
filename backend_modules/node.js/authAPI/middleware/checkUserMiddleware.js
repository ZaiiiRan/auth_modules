const ApiError = require('../AuthAPIError')
const tokenService = require('../services/TokenService')

//проверка авторизации и конкретного пользователя (реально ли он посылает запрос)
//используется для изменения данных в учетной записи
module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) return next(ApiError.UnauthorizedError())
        
        const accessToken = authorizationHeader.split(' ')[1]

        if (!accessToken) return next(ApiError.UnauthorizedError())

        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        const { id } = req.body

        if (userData.id !== id) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}