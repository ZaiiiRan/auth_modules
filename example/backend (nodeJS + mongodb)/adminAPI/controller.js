const userModel = require('../authAPI/models/UserModel')
const tokenModel = require('../authAPI/models/TokenModel')
const ApiError = require('../authAPI/AuthAPIError')
const UserDTO = require('../authAPI/data_transfer_objects/UserDTO')
const tokenService = require('../authAPI/services/TokenService')

class Controller {
    async getUsers(req, res, next) {
        try {
            const {isBlocked, isAdmin, username, limit, offset} = req.body
            let users = await userModel.find()

            if (isBlocked === true) {
                users = users.filter(user => user.isBlocked === true)
            }
            if (isAdmin === true) {
                users = users.filter(user => user.roles.includes('ADMIN'))
            }
            if (username && username.trim() !== '') {
                users = users.filter(user => user.username.toLowerCase().startsWith(username.trim().toLowerCase())
                || user.email.toLowerCase().startsWith(username.trim().toLowerCase()))
            }

            const usersDTO = []
            for (let i = offset; i < offset + limit; i++) {
                if (!users[i]) break
                usersDTO.push(new UserDTO(users[i]))
            }
            return res.json({ users: usersDTO, count: users.length })
        } catch (e) {
            next(e)
        }
    }

    async updateRole(req, res, next) {
        try {
            const { role, id } = req.body
            const user = await userModel.findById(id)
            if (!user) throw ApiError.BadRequest('Пользователь не найден')
            if (role === 'ADMIN') {
                if (!user.roles.includes('ADMIN')) user.roles.push('ADMIN')
            } else if (role === 'USER') {
                if (user.roles.includes('ADMIN')) user.roles = user.roles.filter((role) => role === 'USER')
            }
            await user.save()

            const dto = new UserDTO(user)
            const tokenData = await tokenModel.findOne({ user: id })
            if (tokenData?.refreshToken !== null && tokenData?.refreshToken !== undefined) {
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
            const user = await userModel.findById(id)
            if (!user) throw ApiError.BadRequest('Пользователь не найден')
            user.isBlocked = true
            await user.save()

            const dto = new UserDTO(user)
            const tokenData = await tokenModel.findOne({ user: id })
            if (tokenData?.refreshToken !== null && tokenData?.refreshToken !== undefined) {
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
            const user = await userModel.findById(id)
            if (!user) throw ApiError.BadRequest('Пользователь не найден')
            user.isBlocked = false
            await user.save()

            const dto = new UserDTO(user)
            const tokenData = await tokenModel.findOne({ user: id })
            if (tokenData?.refreshToken !== null && tokenData?.refreshToken !== undefined) {
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