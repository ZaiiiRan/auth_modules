const ApiError = require('../authAPI/AuthAPIError')
const UserDTO = require('../authAPI/data_transfer_objects/UserDTO')
const tokenService = require('../authAPI/services/TokenService')
const userService = require('../authAPI/services/UserService')
const db = require('../db')

class Controller {
    async getUsers(req, res, next) {
        try {
            const {isBlocked, isAdmin, username, limit, offset} = req.body

            let query = `
                SELECT u.*, COUNT(u.*) OVER() AS total_count
                FROM users u
                JOIN roles_for_users rfu ON u._id = rfu."userID"
                WHERE TRUE
            `
            let queryParams = []

            if (isBlocked === true) {
                query += ` AND u."isBlocked" = TRUE`
            }
            if (isAdmin === true) {
                const adminRole = await db.query('SELECT _id FROM roles WHERE value = \'ADMIN\';')
                query += ` AND rfu."roleID" = ${adminRole.rows[0]._id}`
            }
            if (username && username.trim() !== '') {
                query += ` AND (LOWER(u.username) LIKE $${queryParams.length + 1} OR LOWER(u.email) LIKE $${queryParams.length + 1})`
                queryParams.push(username.trim().toLowerCase() + '%')
            }

            query += ` GROUP BY u._id LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`
            queryParams.push(limit, offset)

            const users = await db.query(query, queryParams)

            const count = users.rows.length > 0 ? users.rows[0].total_count : 0

            const usersDTO = []
            for (let i = 0; i < users.rows.length; i++) {
                const roles = await userService.getUserRoles(users.rows[i]._id)

                usersDTO.push(new UserDTO({...users.rows[i], roles: roles}))
            }
            return res.json({ users: usersDTO, count: count })
        } catch (e) {
            next(e)
        }
    }

    async updateRole(req, res, next) {
        try {
            const { role, id } = req.body
            const user = await userService.getUserById(id)
            if (!user) throw ApiError.BadRequest('Пользователь не найден')
            
            let roles = await userService.getUserRoles(id)

            if (role === 'ADMIN') {
                if (!roles.includes('ADMIN')) {
                    const adminID = await db.query('SELECT _id FROM roles WHERE value = \'ADMIN\';')
                    await db.query('INSERT INTO roles_for_users ("userID", "roleID") VALUES ($1, $2);', [id, adminID.rows[0]._id])
                }
            } else if (role === 'USER') {
                if (roles.includes('ADMIN')){
                    const adminID = await db.query('SELECT _id FROM roles WHERE value = \'ADMIN\';')
                    await db.query('DELETE FROM roles_for_users WHERE "userID" = $1 AND "roleID" = $2;', [id, adminID.rows[0]._id])
                }
            }

            roles = await userService.getUserRoles(id)

            const dto = new UserDTO({ ...user, roles: roles })
            
            const tokenData = await db.query('SELECT * FROM tokens WHERE "userID" = $1;', [id])
            if (tokenData.rows[0]?.refreshToken !== null && tokenData.rows[0]?.refreshToken !== undefined) {
                const newTokens = tokenService.generateTokens({...dto})
                tokenService.saveToken(user.id, newTokens.refreshToken)
            }

            return res.json(dto)
        } catch (e) {
            next(e)
        }
    }

    async blockUser(req, res, next) {
        try {
            const { id } = req.body
            let user = await userService.getUserById(id)
            if (!user) throw ApiError.BadRequest('Пользователь не найден')

            user = await db.query('UPDATE users SET "isBlocked" = true WHERE _id = $1 RETURNING *;', [id])

            const roles = await userService.getUserRoles(id)

            const dto = new UserDTO({...user.rows[0], roles: roles})

            const tokenData = await db.query('SELECT * FROM tokens WHERE "userID" = $1;', [id])
            if (tokenData.rows[0]?.refreshToken !== null && tokenData.rows[0]?.refreshToken !== undefined) {
                const newTokens = tokenService.generateTokens({...dto})
                tokenService.saveToken(user.id, newTokens.refreshToken)
            }

            return res.json(dto)
        } catch (e) {
            next(e)
        }
    }

    async unblockUser(req, res, next) {
        try {
            const { id } = req.body
            let user = await userService.getUserById(id)
            if (!user) throw ApiError.BadRequest('Пользователь не найден')
            
            user = await db.query('UPDATE users SET "isBlocked" = false WHERE _id = $1 RETURNING *;', [id])

            const roles = await userService.getUserRoles(id)

            const dto = new UserDTO({...user.rows[0], roles: roles})

            const tokenData = await db.query('SELECT * FROM tokens WHERE "userID" = $1;', [id])
            if (tokenData.rows[0]?.refreshToken !== null && tokenData.rows[0]?.refreshToken !== undefined) {
                const newTokens = tokenService.generateTokens({...dto})
                tokenService.saveToken(user.id, newTokens.refreshToken)
            }

            return res.json(dto)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new Controller()