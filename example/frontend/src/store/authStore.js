import {makeAutoObservable} from 'mobx'
import AuthService from '../services/AuthService'
import axios from 'axios'
import { API_URL } from '../api/api'

export default class Store {
    user = {}
    isAuth = false
    isLoading = false
    isBegin = true

    constructor() {
        makeAutoObservable(this)
    }

    setAuth(bool) {
        this.isAuth = bool
    }

    setUser(user) {
        this.user = user
    }

    setLoading(bool) {
        this.isLoading = bool
    }

    async login(username, password) {
        try {
            const response = await AuthService.login(username, password)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            //обработка ошибок при логине
            alert(e.response?.data?.message)
        }
    }

    async register(username, email, password) {
        try {
            const response = await AuthService.registration(username, email, password)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            //обработка ошибок при регистрации
            alert(e.response?.data?.message)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()
            localStorage.removeItem('token', response.data.accessToken)
            this.setAuth(false)
            this.setUser({})
        } catch (e) {
            //обработка ошибок при выходе
            alert('Ошибка связи с сервером')
        }
    }

    async checkAuth() {
        this.setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message)
        } finally {
            this.setLoading(false)
        }
    }

    async changeUsername(username) {
        try {
            if (this.isAuth) {
                const response = await AuthService.changeUsername(username)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            if (e.response.status === 400) {
                alert(e.response.data.message)
            } else {
                alert('Ошибка связи с сервером')
            }
            return false
        }
    }

    async changeEmail(email) {
        try {
            if (this.isAuth) {
                const response = await AuthService.changeEmail(email)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            if (e.response.status === 400) {
                alert(e.response.data.message)
            } else {
                alert('Ошибка связи с сервером')
            }
            return false
        }
    }

    async changePassword(password) {
        try {
            if (this.isAuth) {
                const response = await AuthService.changePassword(password)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            alert('Ошибка связи с сервером')
            return false
        }
    }
}