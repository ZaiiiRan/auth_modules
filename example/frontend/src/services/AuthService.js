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

    static async changeUsername(id, username) {
        return api.post('/change-username', {id, username})
    }

    static async changeEmail(id, email) {
        return api.post('/change-email', {id, email})
    }

    static async changePassword(id, password) {
        return api.post('/change-password', {id, password})
    }
}