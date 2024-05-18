import api from '../api/adminAPI'

export default class AdminService {
    static fetchUsers(username, isBlocked, isAdmin) {
        return api.post('/users', { isBlocked, isAdmin, username })
    }

    static updateToAdmin(id) {
        return api.post('/update-role', { id, role: 'ADMIN' })
    }

    static updateToUser(id) {
        return api.post('/update-role', { id, role: 'USER' })
    }

    static banUser(id) {
        return api.post('/block', { id })
    }

    static unbanUser(id) {
        return api.post('/unblock', { id })
    }
}