const ApiError = require('../authAPI/AuthAPIError')
const tokenService = require('../authAPI/services/TokenService')
const db = require('../db')

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

        //просмотрим роль в БД, потому что пользователь мог воспользоваться
        //старым токеном со старой ролью
        const user = await db.query('SELECT * FROM users WHERE _id = $1;', [userData.id])
        if (!user.rows[0]) 
            return next(ApiError.UnauthorizedError())

        const rolesRows = await db.query('SELECT value FROM roles_for_users rfu JOIN roles r ON rfu."roleID" = r._id WHERE rfu."userID" = $1;', [userData.id])
        const roles = rolesRows.rows.map(row => row.value)

        if (!roles.includes('ADMIN')) 
            return next(ApiError.UnauthorizedError())

        if (user.rows[0].isBlocked) 
            return next(ApiError.UnauthorizedError())

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}