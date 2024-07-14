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

    static async changeUsername(username) {
        return api.post('/change-username', {username})
    }

    static async changeEmail(email) {
        return api.post('/change-email', {email})
    }

    static async changePassword(password) {
        return api.post('/change-password', {password})
    }
}