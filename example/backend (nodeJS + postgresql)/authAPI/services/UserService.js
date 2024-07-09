const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./MailService')
const tokenService = require('./TokenService')
const UserDTO = require('../data_transfer_objects/UserDTO')
const ApiError = require('../AuthAPIError')
const db = require('../../db')

class UserService {
    async register(username, email, password) {
        let candidate = await db.query('SELECT * FROM users WHERE username = $1;', [username])
        if (candidate.rows[0]) {
            throw ApiError.BadRequest('Пользователь с таким логином уже существует')
        }
        candidate = await db.query('SELECT * FROM users WHERE email = $1;', [email])
        if (candidate.rows[0]) {
            throw ApiError.BadRequest('Пользователь с таким Email уже существует')
        }

        const hashPassword = bcrypt.hashSync(password, 6)
        const activationLink = uuid.v4()
        const userRole = await db.query('SELECT * FROM roles WHERE value = $1', ['USER'])

        const user = await db.query('INSERT INTO users (username, email, password, "activationLink") VALUES ($1, $2, $3, $4) RETURNING *;', [username, email, hashPassword, activationLink])
        await db.query('INSERT INTO roles_for_users ("userID", "roleID") VALUES ($1, $2);', [user.rows[0]._id, userRole.rows[0]._id])


        mailService.sendMail(email, `${process.env.HOST}/auth/activate/${activationLink}`)

        const dto = new UserDTO({...user.rows[0], roles: ['USER']})
        const tokens = tokenService.generateTokens({ ...dto })
        await tokenService.saveToken(dto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: dto
        }
    }

    async login(username, password) {
        const user = await db.query('SELECT * FROM users WHERE username = $1;', [username])
        if (!user.rows[0]) {
            throw ApiError.BadRequest('Пользователь не найден')
        }

        const isCorrectPassword = bcrypt.compareSync(password, user.rows[0].password)
        if (!isCorrectPassword) {
            throw ApiError.BadRequest('Указан неверный пароль')
        }
        
        const rolesIds = await db.query('SELECT "roleID" FROM roles_for_users WHERE "userID" = $1;', [user.rows[0]._id])
        let roles = []
        for (let i = 0; i < rolesIds.rows.length; i++) {
            const value = await db.query('SELECT value FROM roles WHERE _id = $1;', [rolesIds.rows[i].roleID])
            roles.push(value.rows[0].value)
        }
        const dto = new UserDTO({...user.rows[0], roles: roles})
        const tokens = tokenService.generateTokens({ ...dto })
        await tokenService.saveToken(dto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: dto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }

        const userData = tokenService.validateRefreshToken(refreshToken)
        const DBToken = await tokenService.findToken(refreshToken)
        if (!userData || !DBToken) {
            throw ApiError.UnauthorizedError()
        }

        const user = await db.query('SELECT * FROM users WHERE _id = $1', [userData.id])
        const rolesIds = await db.query('SELECT "roleID" FROM roles_for_users WHERE "userID" = $1;', [userData.id])
        let roles = []
        for (let i = 0; i < rolesIds.rows.length; i++) {
            const value = await db.query('SELECT value FROM roles WHERE _id = $1;', [rolesIds.rows[i].roleID])
            roles.push(value.rows[0].value)
        }
        const dto = new UserDTO({...user.rows[0], roles: roles})
        const tokens = tokenService.generateTokens({ ...dto })
        await tokenService.saveToken(dto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: dto
        }
    }

    async activate(activationLink) {
        const user = await db.query('SELECT * FROM users WHERE "activationLink" = $1;', [activationLink])
        if (!user.rows[0]) {
            throw ApiError.BadRequest('Неизвестная ссылка')
        } else {
            await db.query('UPDATE users SET "isActivated" = true WHERE _id = $1;', [user.rows[0]._id])
        }
    }

    async getAllUsers() {
        const users = await db.query('SELECT * FROM users;')
        return users.rows
    }

    async changeUsername(id, username) {
        let candidate = await db.query('SELECT * FROM users WHERE username = $1;', [username])
        if (candidate.rows[0]) {
            throw ApiError.BadRequest('Пользователь с таким логином уже существует')
        }
        let user = await db.query('SELECT FROM users WHERE _id = $1', [id])
        if (!user.rows[0]) {
            throw new ApiError.BadRequest('Пользователь не найден')
        } else {
            user = await db.query('UPDATE users SET username = $1 WHERE _id = $2 RETURNING *;', [username, id])
            
            const rolesIds = await db.query('SELECT "roleID" FROM roles_for_users WHERE "userID" = $1;', [id])
            let roles = []
            for (let i = 0; i < rolesIds.rows.length; i++) {
                const value = await db.query('SELECT value FROM roles WHERE _id = $1;', [rolesIds.rows[i].roleID])
                roles.push(value.rows[0].value)
            }

            const dto = new UserDTO({...user.rows[0], roles: roles})
            const tokens = tokenService.generateTokens({ ...dto })
            await tokenService.saveToken(dto.id, tokens.refreshToken)

            return {
                ...tokens,
                user: dto
            }
        }
    }

    async changeEmail(id, email) {
        let candidate = await db.query('SELECT * FROM users WHERE email = $1;', [email])
        if (candidate.rows[0]) {
            throw ApiError.BadRequest('Пользователь с таким email уже существует')
        }
        let user = await db.query('SELECT FROM users WHERE _id = $1', [id])
        if (!user.rows[0]) {
            throw new ApiError.BadRequest('Пользователь не найден')
        } else {
            const activationLink = uuid.v4()
            
            user = await db.query('UPDATE users SET email = $1, "activationLink" = $2, "isActivated" = false WHERE _id = $3 RETURNING *;', [email, activationLink, id])
            
            const rolesIds = await db.query('SELECT "roleID" FROM roles_for_users WHERE "userID" = $1;', [id])
            let roles = []
            for (let i = 0; i < rolesIds.rows.length; i++) {
                const value = await db.query('SELECT value FROM roles WHERE _id = $1;', [rolesIds.rows[i].roleID])
                roles.push(value.rows[0].value)
            }

            mailService.sendMail(email, `${process.env.HOST}/auth/activate/${activationLink}`)

            const dto = new UserDTO({...user.rows[0], roles: roles})
            const tokens = tokenService.generateTokens({ ...dto })
            await tokenService.saveToken(dto.id, tokens.refreshToken)

            return {
                ...tokens,
                user: dto
            }
        }
    }

    async changePassword(id, password) {
        let user = await db.query('SELECT FROM users WHERE _id = $1', [id])
        if (!user.rows[0]) {
            throw new ApiError.BadRequest('Пользователь не найден')
        } else {
            const hashPassword = bcrypt.hashSync(password, 6)
            
            user = await db.query('UPDATE users SET password = $1 WHERE _id = $2 RETURNING *;', [hashPassword, id])

            const rolesIds = await db.query('SELECT "roleID" FROM roles_for_users WHERE "userID" = $1;', [id])
            let roles = []
            for (let i = 0; i < rolesIds.rows.length; i++) {
                const value = await db.query('SELECT value FROM roles WHERE _id = $1;', [rolesIds.rows[i].roleID])
                roles.push(value.rows[0].value)
            }

            const dto = new UserDTO({...user.rows[0], roles: roles})
            const tokens = tokenService.generateTokens({ ...dto })
            await tokenService.saveToken(dto.id, tokens.refreshToken)

            return {
                ...tokens,
                user: dto
            }
        }
    }
}

module.exports = new UserService()