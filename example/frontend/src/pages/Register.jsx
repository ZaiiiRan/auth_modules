/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom'
import styles from './Login.module.css'
import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { AuthContext } from '../hoc/AuthProvider'

function Register() {
    const { store } = useContext(AuthContext)
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    })

    const submitForm = (e) => {
        e.preventDefault()

        if (data.username === '') {
            alert('Имя пользователя пусто')
            return
        }

        if (data.email === '') {
            alert('Email пуст')
            return
        } else if (! (new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)).test(data.email)) {
            alert('Email некорректен')
            return
        }

        if (data.password === '') {
            alert('Пароль пуст')
            return
        } else if (! (new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).test(data.password)) {
            alert('Пароль должен содержать от 8 символов, хотя бы одну заглавную латинскую букву, одну строчную латинскую букву, одну цифру и один специальный символ')
            return
        }

        if (data.repeatPassword !== data.password) {
            alert('Пароли должны совпвдать')
            return
        }

        return store.register(data.username, data.email, data.password)
    }

    return (
        <div className={styles.LoginBlock}>
            <form className={styles.form} onSubmit={submitForm}>
                <input className={styles.input} type="text" placeholder='Имя пользователя'  name='username'
                    value={data.username} onChange={e => setData({...data, username: e.target.value.trim()})}/>

                <input className={styles.input} type="text" placeholder='Email'  name='email'
                    value={data.email} onChange={e => setData({...data, email: e.target.value.trim()})}/>

                <input className={styles.input} type="password" placeholder='Пароль' name='password'
                    value={data.password} onChange={e => setData({...data, password: e.target.value.trim()})}/>

                <input className={styles.input} type="password" placeholder='Повторите пароль' name='repeatPassword'
                    value={data.repeatPassword} onChange={e => setData({...data, repeatPassword: e.target.value.trim()})}/>

                <input className={styles.button} type="submit" value='Зарегистрироваться' />

                <Link to='/login' className={styles.navLink}>Войти</Link>
            </form>
        </div>
    )
}

export default observer(Register)