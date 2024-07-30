const bcrypt = require('bcrypt')
const uuid = require('uuid')
const userModel = require('../models/UserModel')
const roleModel = require('../models/RoleModel')
const mailService = require('./MailService')
const tokenService = require('./TokenService')
const UserDTO = require('../data_transfer_objects/UserDTO')
const ApiError = require('../AuthAPIError')

class UserService {
    async register(username, email, password) {
        this.checkUsername(username)
        this.checkEmail(email)
        this.checkPassword(password)

        const candidate = await userModel.findOne({ 
            $or: [
                { username: username },
                { email: email }
            ]
        })

        if (candidate) {
            if (candidate.username === username) {
                throw ApiError.BadRequest('Пользователь с таким логином уже существует')
            } else if (candidate.email === email) {
                throw ApiError.BadRequest('Пользователь с таким Email уже существует')
            }
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

        return this.createResponse(user)
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

        const user = await userModel.findById(userData.id)
        return this.createResponse(user)
    }

    async activate(activationLink) {
        const user = await userModel.findOneAndUpdate(
            { activationLink: activationLink },
            { isActivated: true },
            { new: true }
        )

        if (!user) {
            throw ApiError.BadRequest('Неизвестная ссылка')
        }
    }

    async getAllUsers() {
        const users = await userModel.find()
        return users
    }

    async changeUsername(id, username, password) {
        this.checkUsername(username)

        const candidate = await userModel.findOne({ username: username })
        if (candidate) {
            throw ApiError.BadRequest('Пользователь с таким логином уже существует')
        }

        const user = await userModel.findOne({_id: id})
        if (!user) {
            throw new ApiError.BadRequest('Пользователь не найден')
        }

        const isCorrectPassword = bcrypt.compareSync(password, user.password)
        if (!isCorrectPassword) {
            throw ApiError.BadRequest('Указан неверный пароль')
        }

        user.username = username
        await user.save()
        
        return this.createResponse(user)
    }

    async changeEmail(id, email, password) {
        this.checkEmail(email)

        let candidate = await userModel.findOne({ email: email })
        if (candidate) {
            throw ApiError.BadRequest('Пользователь с таким email уже существует')
        }

        const user = await userModel.findOne({_id: id})
        if (!user) {
            throw new ApiError.BadRequest('Пользователь не найден')
        }

        const isCorrectPassword = bcrypt.compareSync(password, user.password)
        if (!isCorrectPassword) {
            throw ApiError.BadRequest('Указан неверный пароль')
        }

        user.email = email
        const activationLink = uuid.v4()
        user.activationLink = activationLink
        user.isActivated = false
        await user.save()
        mailService.sendMail(email, `${process.env.HOST}/auth/activate/${activationLink}`)

        return this.createResponse(user)
    }

    async changePassword(id, password, currentPassword) {
        this.checkPassword(password)

        const user = await userModel.findOne({_id: id})
        if (!user) {
            throw new ApiError.BadRequest('Пользователь не найден')
        }

        const isCorrectPassword = bcrypt.compareSync(currentPassword, user.password)
        if (!isCorrectPassword) {
            throw ApiError.BadRequest('Указан неверный пароль')
        }

        const hashPassword = bcrypt.hashSync(password, 6)
        user.password = hashPassword
        await user.save()

        return this.createResponse(user)
    }

    async createResponse(user) {
        const dto = new UserDTO(user)
        const tokens = tokenService.generateTokens({ ...dto })
        await tokenService.saveToken(dto.id, tokens.refreshToken)

        return { ...tokens, user: dto }
    }

    checkUsername(username) {
        if (!username || username === '') throw ApiError.BadRequest('Имя пользователя пусто')
        else if (username.length < 5) throw ApiError.BadRequest('Имя пользователя должно содержать минимум 5 символов')
    }
    
    checkEmail(email) {
        if (!email || email === '') throw ApiError.BadRequest('Email пуст')
        else if (!(new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)).test(email)) throw ApiError.BadRequest('Email некорректен')
    }

    checkPassword(password) {
        if (!password || password === '') throw ApiError.BadRequest('Пароль пуст')
        else if (!(new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).test(password))
            throw ApiError.BadRequest('Пароль должен содержать от 8 символов, хотя бы одну заглавную латинскую букву, одну строчную латинскую букву, одну цифру и один специальный символ')
    }
}

module.exports = new UserService()