import {makeAutoObservable} from 'mobx'
import AuthService from '../services/AuthService'
import axios from 'axios'
import { API_URL } from '../api/api'

import { triggerNotification } from '../hoc/NotificationProvider'

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

            //alert(e.response?.data?.message)
            triggerNotification('Ошибка', `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`)
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

            //alert(e.response?.data?.message)
            triggerNotification('Ошибка', `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`)
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
            
            triggerNotification('Ошибка', `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`)
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

    async changeUsername(username, password) {
        try {
            if (this.isAuth) {
                const response = await AuthService.changeUsername(username, password)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            triggerNotification('Ошибка', `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`)
            return false
        }
    }

    async changeEmail(email, password) {
        try {
            if (this.isAuth) {
                const response = await AuthService.changeEmail(email, password)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            triggerNotification('Ошибка', `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`)
            return false
        }
    }

    async changePassword(password, currentPassword) {
        try {
            if (this.isAuth) {
                const response = await AuthService.changePassword(password, currentPassword)
                localStorage.setItem('token', response.data.accessToken)
                this.setUser(response.data.user)
                return true
            }
        } catch (e) {
            triggerNotification('Ошибка', `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`)
            return false
        }
    }
}