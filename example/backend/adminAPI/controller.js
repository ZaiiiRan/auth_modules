const userModel = require('../authAPI/mongoDB_models/UserModel')
const tokenModel = require('../authAPI/mongoDB_models/TokenModel')
const ApiError = require('../authAPI/AuthAPIError')
const UserDTO = require('../authAPI/data_transfer_objects/UserDTO')
const tokenService = require('../authAPI/services/TokenService')

class Controller {
    async getUsers(req, res, next) {
        try {
            const users = await userModel.find()
            const usersDTO = []
            for (let i = 0; i < users.length; i++) {
                usersDTO.push(new UserDTO(users[i]))
            }
            return res.json(usersDTO)
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
            if (tokenData.refreshToken) {
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