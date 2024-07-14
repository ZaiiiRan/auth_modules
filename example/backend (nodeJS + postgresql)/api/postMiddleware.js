const ApiError = require('../authAPI/AuthAPIError')
const db = require('../db')

module.exports = async function (req, res, next) {
    try {
        const userData = req.user

        const user = await db.query('SELECT * FROM users WHERE _id = $1;', [userData.id])
        if (!user.rows[0]) return next(ApiError.UnauthorizedError())

        if (user.rows[0].isBlocked === true) next(ApiError.UnauthorizedError())
        if (!user.rows[0].isActivated) next(ApiError.UnauthorizedError())
        
        const rolesRows = await db.query('SELECT value FROM roles_for_users rfu JOIN roles r ON rfu."roleID" = r._id WHERE rfu."userID" = $1;', [userData.id])
        const roles = rolesRows.rows.map(row => row.value)

        const { userID } = req.body
        
        //если был получен id другого пользователя и отправлявший пользователь
        //не является админом, то ошибка
        if (!roles.includes('ADMIN') && userID !== userData.id) 
            next(ApiError.UnauthorizedError())

        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}