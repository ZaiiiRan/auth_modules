const ApiError = require('../authAPI/AuthAPIError')
const UserDTO = require('../authAPI/data_transfer_objects/UserDTO')
const tokenService = require('../authAPI/services/TokenService')
const userService = require('../authAPI/services/UserService')
const db = require('../db')

class Controller {
    async getUsers(req, res, next) {
        try {
            const {isBlocked, isAdmin, username, limit, offset} = req.body
            let users = await db.query('SELECT * FROM users;')
            users = users.rows

            if (isBlocked === true) {
                users = users.filter(user => user.isBlocked === true)
            }
            if (isAdmin === true) {
                const rolePromises = users.map(user => 
                    db.query('SELECT value FROM roles_for_users rfu JOIN roles r ON rfu."roleID" = r._id WHERE rfu."userID" = $1;', [user._id])
                        .then(rolesRows => rolesRows.rows.map(row => row.value))
                        .then(roles => roles.includes('ADMIN'))
                )
            
                Promise.all(rolePromises)
                    .then(results => {
                        users = users.filter((_, index) => results[index])
                    })
            }
            if (username && username.trim() !== '') {
                users = users.filter(user => user.username.toLowerCase().startsWith(username.trim().toLowerCase())
                || user.email.toLowerCase().startsWith(username.trim().toLowerCase()))
            }

            const usersDTO = []
            for (let i = offset; i < offset + limit; i++) {
                if (!users[i]) break

                const roles = await userService.getUserRoles(users[i]._id)

                usersDTO.push(new UserDTO({...users[i], roles: roles}))
            }
            return res.json({ users: usersDTO, count: users.length })
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