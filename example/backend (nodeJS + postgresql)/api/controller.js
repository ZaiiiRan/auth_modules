const ApiError = require('../authAPI/AuthAPIError')
const db = require('../db')

class Controller {
    async getPosts(req, res, next) {
        try {
            const { offset, limit, username, title } = req.body

            let query = `
                SELECT p._id, "user", title, body, "date", "lastEditDate", u.username AS author, COUNT(*) OVER() AS total_count
                FROM posts p
                JOIN users u ON p.user = u._id
                WHERE TRUE
            `
            let queryParams = []
            
            if (username && username.trim() !== '') {
                query += ` AND LOWER(u.username) LIKE $${queryParams.length + 1}`
                queryParams.push(`${username.trim().toLocaleLowerCase()}%`)
            }
            if (title && title.trim() !== '') {
                query += ` AND LOWER(p.title) LIKE $${queryParams.length + 1}`
                queryParams.push(`${title.trim().toLowerCase()}%`)
            }

            query += ` ORDER BY "date" DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`
            queryParams.push(limit, offset)

            const posts = await db.query(query, queryParams)

            const totalCount = posts.rows.length > 0 ? posts.rows[0].total_count : 0

            return res.json({ posts: posts.rows, count: totalCount })
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
            const post = await db.query('INSERT INTO posts ("user", title, body) VALUES ($1, $2, $3) RETURNING *;', [user.id, title, body])
            return res.json({...post.rows[0], author: user.username})
        } catch (e) {
            next(e)
        }
    }

    async editPost(req, res, next) {
        try {
            const { title, body, postID } = req.body

            checkTitle(title)
            checkBody(body)

            let post = await db.query('SELECT * FROM posts WHERE _id = $1;', [postID])
            if (!post.rows[0]) throw ApiError.BadRequest('Пост не найден')
            post = await db.query('UPDATE posts SET title = $1, body = $2, "lastEditDate" = CURRENT_TIMESTAMP WHERE _id = $3 RETURNING *;', [title, body, postID])

            const user = req.user

            return res.json({...post.rows[0], author: user.username})
        } catch (e) {
            next(e)
        }
    }

    async deletePost(req, res, next) {
        try {
            const { postID } = req.body
            const post = await db.query('SELECT * FROM posts WHERE _id = $1;', [postID])
            if (!post.rows[0]) throw ApiError.BadRequest('Пост не найден')
            await db.query('DELETE FROM posts WHERE _id = $1;', [postID])
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