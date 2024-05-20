const ApiError = require('../authAPI/AuthAPIError')
const tokenService = require('../authAPI/services/TokenService')
const UserModel = require('../authAPI/mongoDB_models/UserModel')

module.exports = async function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization

        if (!authorizationHeader) return next(ApiError.UnauthorizedError())
        
        const accessToken = authorizationHeader.split(' ')[1]

        if (!accessToken) return next(ApiError.UnauthorizedError())

        const userData = tokenService.validateAccessToken(accessToken)

        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        const user = await UserModel.findById(userData.id)
        if (!user) return next(ApiError.UnauthorizedError())

        if (user.isBlocked === true) next(ApiError.UnauthorizedError())

        const { userID } = req.body
        
        if (!user.roles.includes('ADMIN') && userID !== userData.id) 
            next(ApiError.UnauthorizedError())

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}