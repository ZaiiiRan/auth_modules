const jwt = require('jsonwebtoken')
const db = require('../../db')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '60d' })
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await db.query('SELECT * FROM tokens WHERE "userID" = $1;', [userId])
        if (tokenData.rows[0]) {
            const token = await db.query('UPDATE tokens SET "refreshToken" = $1 WHERE "userID" = $2 RETURNING *', [refreshToken, userId])
            return token.rows[0]
        }
        const token = await db.query('INSERT INTO tokens ("userID", "refreshToken") VALUES ($1, $2) RETURNING *;', [userId, refreshToken])
        return token.rows[0]
    }

    async removeToken(refreshToken) {
        const tokenData = await db.query('DELETE FROM tokens WHERE "refreshToken" = $1 RETURNING *;', [refreshToken])
        return tokenData
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }

    async findToken(refreshToken) {
        const tokenData = await db.query('SELECT * FROM tokens WHERE "refreshToken" = $1;', [refreshToken])
        return tokenData.rows[0]
    }
}

module.exports = new TokenService()