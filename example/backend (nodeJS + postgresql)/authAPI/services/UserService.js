const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./MailService')
const tokenService = require('./TokenService')
const UserDTO = require('../data_transfer_objects/UserDTO')
const ApiError = require('../AuthAPIError')
const db = require('../../db')

class UserService {
    async register(username, email, password) {
        const candidate = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2 LIMIT 1;', [username, email])
        if (candidate.rows[0]) {
            throw ApiError.BadRequest(candidate.rows[0].username === username ? 'Пользователь с таким логином уже существует' 
                : 'Пользователь с таким Email уже существует')
        }

        const hashPassword = bcrypt.hashSync(password, 6)
        const activationLink = uuid.v4()
        const userRole = await db.query('SELECT * FROM roles WHERE value = $1;', ['USER'])

        const user = await db.query('INSERT INTO users (username, email, password, "activationLink") VALUES ($1, $2, $3, $4) RETURNING *;', [username, email, hashPassword, activationLink])
        await db.query('INSERT INTO roles_for_users ("userID", "roleID") VALUES ($1, $2);', [user.rows[0]._id, userRole.rows[0]._id])


        mailService.sendMail(email, `${process.env.HOST}/auth/activate/${activationLink}`)

        return this.createResponse(user.rows[0])
    }

    async login(username, password) {
        const user = await this.getUserByUsername(username)
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }

        const isCorrectPassword = bcrypt.compareSync(password, user.password)
        if (!isCorrectPassword) {
            throw ApiError.BadRequest('Указан неверный пароль')
        }

        return this.createResponse(user)
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

        const user = await this.getUserById(userData.id)
        return this.createResponse(user)
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
        await this.checkUsernameAvailability(username)

        let user = await this.getUserById(id)
        if (!user) {
            throw new ApiError.BadRequest('Пользователь не найден')
        } else {
            user = await db.query('UPDATE users SET username = $1 WHERE _id = $2 RETURNING *;', [username, id])
            
            return this.createResponse(user.rows[0])
        }
    }

    async changeEmail(id, email) {
        await this.checkEmailAvailability(email)

        let user = await this.getUserById(id)
        if (!user.rows[0]) {
            throw new ApiError.BadRequest('Пользователь не найден')
        } else {
            const activationLink = uuid.v4()
            
            user = await db.query('UPDATE users SET email = $1, "activationLink" = $2, "isActivated" = false WHERE _id = $3 RETURNING *;', [email, activationLink, id])

            mailService.sendMail(email, `${process.env.HOST}/auth/activate/${activationLink}`)

            return this.createResponse(user.rows[0])
        }
    }

    async changePassword(id, password) {
        let user = await this.getUserById(id)
        if (!user.rows[0]) {
            throw new ApiError.BadRequest('Пользователь не найден')
        } else {
            const hashPassword = bcrypt.hashSync(password, 6)
            
            user = await db.query('UPDATE users SET password = $1 WHERE _id = $2 RETURNING *;', [hashPassword, id])

            return this.createResponse(user.rows[0])
        }
    }



    async getUserById(id) {
        const user = await db.query('SELECT * FROM users WHERE _id = $1;', [id])
        return user.rows[0]
    }

    async getUserByUsername(username) {
        const user = await db.query('SELECT * FROM users WHERE username = $1;', [username])
        return user.rows[0]
    }

    async getUserRoles(userId) {
        const rolesRows = await db.query('SELECT value FROM roles_for_users rfu JOIN roles r ON rfu."roleID" = r._id WHERE rfu."userID" = $1;', [userId])
        return rolesRows.rows.map(row => row.value)
    }

    async createResponse(user) {
        const roles = await this.getUserRoles(user._id)
        const dto = new UserDTO({...user, roles})
        const tokens = tokenService.generateTokens({...dto})
        await tokenService.saveToken(dto.id, tokens.refreshToken)

        return {...tokens, user: dto}
    }

    async checkUsernameAvailability(username) {
        const candidate = await db.query('SELECT * FROM users WHERE username = $1;', [username])
        if (candidate.rows.length > 0) {
            throw ApiError.BadRequest('Пользователь с таким логином уже существует')
        }
    }

    async checkEmailAvailability(email) {
        const candidate = await db.query('SELECT * FROM users WHERE email = $1;', [email])
        if (candidate.rows.length > 0) {
            throw ApiError.BadRequest('Пользователь с таким email уже существует')
        }
    }
}

module.exports = new UserService()