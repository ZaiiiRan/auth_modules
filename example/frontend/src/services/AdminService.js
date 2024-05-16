import api from '../api/adminAPI'

export default class AdminService {
    static fetchUsers() {
        return api.get('/users')
    }

    static updateToAdmin(id) {
        return api.post('/update-role', { id, role: 'ADMIN' })
    }

    static updateToUser(id) {
        return api.post('/update-role', { id, role: 'USER' })
    }
}