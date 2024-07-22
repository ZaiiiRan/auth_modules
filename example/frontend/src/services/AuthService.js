import api from '../api/api'

export default class AuthService {
    static async login(username, password) {
        return api.post('/login', {username, password})
    }

    static async registration(username, email, password) {
        return api.post('/register', {username, email, password})
    }

    static async logout() {
        return api.post('/logout')
    }

    static async changeUsername(username, password) {
        return api.post('/change-username', {username, password})
    }

    static async changeEmail(email, password) {
        return api.post('/change-email', {email, password})
    }

    static async changePassword(password, currentPassword) {
        return api.post('/change-password', {password, currentPassword})
    }
}