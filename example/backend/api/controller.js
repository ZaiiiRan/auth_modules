const PostModel = require('./models/postModel')
const UserModel = require('../authAPI/mongoDB_models/UserModel')
const ApiError = require('../authAPI/AuthAPIError')

class Controller {
    async getPosts(req, res, next) {
        try {
            const posts = await PostModel.find()

            return res.json(posts)
        } catch (e) {
            next(e)
        }
    }

    async createPost(req, res, next) {
        try {
            const { title, body, userID } = req.body
            const user = await UserModel.findById(userID)
            if (!user) throw ApiError.BadRequest('Пользователь не найден')
            const post = await PostModel.create({ user: userID, author: user.username, title: title, body: body })
            return res.json(post)
        } catch (e) {
            next(e)
        }
    }

    async editPost(req, res, next) {
        try {
            const { title, body, postID } = req.body
            const post = await PostModel.findById(postID)
            if (!post) throw ApiError.BadRequest('Пост не найден')
            post.title = title
            post.body = body
            post.lastEditDate = Date.now()
            await post.save()
            return res.json(post)
        } catch (e) {
            next(e)
        }
    }

    async deletePost(req, res, next) {
        try {
            const { postID } = req.body
            const post = await PostModel.findById(postID)
            if (!post) throw ApiError.BadRequest('Пост не найден')
            await PostModel.deleteOne({ _id: postID })
            return res.json('Удаление успешно завершено')
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new Controller()