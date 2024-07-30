const PostModel = require('./models/postModel')
const UserModel = require('../authAPI/models/UserModel')
const ApiError = require('../authAPI/AuthAPIError')

class Controller {
    async getPosts(req, res, next) {
        try {
            const { offset, limit, username, title } = req.body

            const pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $unwind: '$author'
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        body: 1,
                        date: 1,
                        lastEditDate: 1,
                        author: '$author.username'
                    }
                }
            ]

            if (username && username.trim() !== '') {
                pipeline.push({
                    $match: {
                        'author': { $regex: `^${username.trim()}`, $options: 'i'}
                    }
                })
            }

            if (title && title.trim() !== '') {
                pipeline.push({
                    $match: {
                        'title': { $regex: `^${title.trim()}`, $options: 'i' }
                    }
                })
            }

            pipeline.push({ $sort: { date: -1 } })

            const totalPosts = await PostModel.aggregate([
                ...pipeline,
                { $count: "count" }
            ])

            const count = totalPosts.length > 0 ? totalPosts[0].count: 0

            pipeline.push({ $skip: offset })
            pipeline.push({ $limit: limit })

            const posts = await PostModel.aggregate(pipeline)

            return res.json({ posts, count})
        } catch (e) {
            next(e)
        }
    }

    async createPost(req, res, next) {
        try {
            const { title, body } = req.body

            checkTitle(title)
            checkBody(body)

            const user = req.user
            const post = await PostModel.create({ user: user.id, title: title, body: body })
            return res.json({ ...post, author: user.username })
        } catch (e) {
            next(e)
        }
    }

    async editPost(req, res, next) {
        try {
            const { title, body, postID } = req.body

            checkTitle(title)
            checkBody(body)

            const post = await PostModel.findById(postID)
            if (!post) throw ApiError.BadRequest('Пост не найден')

            post.title = title
            post.body = body
            post.lastEditDate = Date.now()
            await post.save()

            const user = req.user

            return res.json({ ...post, author: user.username })
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

function checkTitle(title) {
    if (!title || title === '') throw ApiError.BadRequest('Заголовок пуст')
    else if (title.length < 5) throw ApiError.BadRequest('Заголовок должен сожержать минимум 5 символов')
    else if (title.length > 30) throw ApiError.BadRequest('Заголовок должен содержать не более 30 символов')
}

function checkBody(body) {
    if (!body || body === '') throw ApiError.BadRequest('Тело поста пусто')
    else if (body.length < 20) throw ApiError.BadRequest('Тело поста должно содержать минимум 20 символов')
    else if (body.length > 2000) throw ApiError.BadRequest('Тело поста должно содержать не более 2000 символов')
}