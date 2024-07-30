const userModel = require('../authAPI/models/UserModel')
const tokenModel = require('../authAPI/models/TokenModel')
const ApiError = require('../authAPI/AuthAPIError')
const UserDTO = require('../authAPI/data_transfer_objects/UserDTO')
const tokenService = require('../authAPI/services/TokenService')
const RoleModel = require('../authAPI/models/RoleModel')
const UserModel = require('../authAPI/models/UserModel')

class Controller {
    async getUsers(req, res, next) {
        try {
            const {isBlocked, isAdmin, username, limit, offset} = req.body

            const pipeline = []

            if (isBlocked === true) {
                pipeline.push({
                    $match: { isBlocked: true }
                })
            }

            if (isAdmin === true) {
                const adminRole = await RoleModel.findOne({ value: 'ADMIN' })
                pipeline.push({
                    $match: { roles: adminRole.value }
                })
            }

            if (username && username.trim() !== '') {
                const regex = new RegExp(`^${username.trim()}`, 'i')
                pipeline.push({
                    $match: {
                        $or: [
                            { username: regex },
                            { email: regex }
                        ]
                    }
                })
            }

            const countPipeline = await UserModel.aggregate([...pipeline, { $count: 'count' }])
            const count = countPipeline.length > 0 ? countPipeline[0].count : 0

            pipeline.push({ $skip: offset })
            pipeline.push({ $limit: limit })
            
            let users = await userModel.aggregate(pipeline)

            const usersDTO = users.map(user => new UserDTO(user))

            return res.json({ users: usersDTO, count })
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
                if (!user.roles.includes('ADMIN')) {
                    const admineRole = await RoleModel.findOne({ value: 'ADMIN' })
                    user.roles.push(admineRole.value)
                } 
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