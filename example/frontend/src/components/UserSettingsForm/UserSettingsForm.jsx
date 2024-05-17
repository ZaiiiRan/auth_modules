import { useState, useContext } from 'react'
import useAuth from '../../hooks/useAuth'
import styles from './UserSettingsForm.module.css'

export default function UserSettingsForm() {
    const store = useAuth()
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    })

    const submitForm = async (e) => {
        e.preventDefault()

        if (data.email !== '')
            if (!(new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)).test(data.email)) {
                alert('Email некорректен')
                return
            }

        if (data.password !== '') 
            if (!(new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).test(data.password)) {
                alert('Пароль должен содержать от 8 символов, хотя бы одну заглавную латинскую букву, одну строчную латинскую букву, одну цифру и один специальный символ')
                return
            }

        if (data.password !== '' && data.repeatPassword !== data.password) {
            alert('Пароли должны совпвдать')
            return
        }

        if (data.username === store.user.username) {
            alert('Веденное имя пользователя совпадает с текущим именем пользователя')
            return
        }
        if (data.email === store.user.email) {
            alert('Веденное имя пользователя совпадает с текущим именем пользователя')
            return
        }


        

        if (data.username !== '') {
            const success = await store.changeUsername(data.username)
            if (success) setData({...data, username: ''})
            else return
        }
        if (data.email !== '') {
            const success = await store.changeEmail(data.email)
            if (success) setData({...data, email: ''})
            else return
        }
        if (data.password !== '') {
            const success = await store.changePassword(data.password)
            if (success) setData({...data, password: '', repeatPassword: ''})
            else return
        }

        alert('Данные успешно изменены')
    }

    return (
        <form className={styles.form} onSubmit={submitForm}>
            <input className={styles.input} type="text" placeholder='Новое ммя пользователя'  name='username'
                value={data.username} onChange={e => setData({...data, username: e.target.value.trim()})}/>

            <input className={styles.input} type="text" placeholder='Новый Email'  name='email'
                value={data.email} onChange={e => setData({...data, email: e.target.value.trim()})}/>

            <input className={styles.input} type="password" placeholder='Новый Пароль' name='password'
                value={data.password} onChange={e => setData({...data, password: e.target.value.trim()})}/>

            <input className={styles.input} type="password" placeholder='Повторите новый пароль' name='repeatPassword'
                value={data.repeatPassword} onChange={e => setData({...data, repeatPassword: e.target.value.trim()})}/>

            <input className={styles.button} type="submit" value='Сохранить' />
        </form>
    )
}