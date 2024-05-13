const bcrypt = require('bcrypt')
const uuid = require('uuid')
const userModel = require('../mongoDB_models/UserModel')
const roleModel = require('../mongoDB_models/RoleModel')
const mailService = require('./MailService')
const tokenService = require('./TokenService')
const UserDTO = require('../data_transfer_objects/UserDTO')
const ApiError = require('../AuthAPIError')

class UserService {
    async register(username, email, password) {
        let candidate = await userModel.findOne({ username: username })
        if (candidate) {
            throw ApiError.BadRequest('Пользователь с таким логином уже существует')
        }
        candidate = await userModel.findOne({email: email})
        if (candidate) {
            throw ApiError.BadRequest('Пользователь с таким Email уже существует')
        }

        const hashPassword = bcrypt.hashSync(password, 6)
        const activationLink = uuid.v4()
        const userRole = await roleModel.findOne({value: "USER"})

        const user = await userModel.create(
            {
                username: username,
                email: email,
                password: hashPassword,
                activationLink: activationLink,
                roles: [userRole.value]
            }
        )

        mailService.sendMail(email, `${process.env.HOST}/auth/activate/${activationLink}`)

        const dto = new UserDTO(user)
        const tokens = tokenService.generateTokens({ ...dto })
        await tokenService.saveToken(dto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: dto
        }
    }

    async login(username, password) {
        const user = await userModel.findOne({ username })
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден')
        }

        const isCorrectPassword = bcrypt.compareSync(password, user.password)
        if (!isCorrectPassword) {
            throw ApiError.BadRequest('Указан неверный пароль')
        }
        
        const dto = new UserDTO(user)
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

        const user = await userModel.findById(userData.id)
        const dto = new UserDTO(user)
        const tokens = tokenService.generateTokens({ ...dto })
        await tokenService.saveToken(dto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: dto
        }
    }

    async activate(activationLink) {
        const user = await userModel.findOne({ activationLink: activationLink })
        if (!user) {
            throw ApiError.BadRequest('Неизвестная ссылка')
        } else {
            user.isActivated = true
            await user.save()
        }
    }
}

module.exports = new UserService()