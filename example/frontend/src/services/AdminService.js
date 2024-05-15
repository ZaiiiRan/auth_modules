import api from '../api/adminAPI'

export default class AdminService {
    static fetchUsers() {
        return api.get('/users')
    }
}