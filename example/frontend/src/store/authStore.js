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
            console.log(response)
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
            alert(e.response?.data?.message)
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
                const response = await AuthService.changeUsername(this.user.id, username)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            alert(e.response?.data?.message)
            return false
        }
    }

    async changeEmail(email) {
        try {
            if (this.isAuth) {
                const response = await AuthService.changeEmail(this.user.id, email)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            alert(e.response?.data?.message)
            return false
        }
    }

    async changePassword(password) {
        try {
            if (this.isAuth) {
                const response = await AuthService.changePassword(this.user.id, password)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            alert(e.response?.data?.message)
            return false
        }
    }
}