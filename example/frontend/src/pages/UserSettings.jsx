/* eslint-disable react-refresh/only-export-components */
import styles from './Login.module.css'
import { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { AuthContext } from '../hoc/AuthProvider'

function UserSettings() {
    const { store } = useContext(AuthContext)
    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    })

    const submitForm = (e) => {
        e.preventDefault()

        if (! (new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)).test(data.email)) {
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

        return store
    }

    return (
        <div className='user-settings'>
            <h1>Настройки пользователя</h1>
            <div>Измените только, то что нужно</div>
            <div className={styles.LoginBlock}>
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
            </div>
        </div>
    )
}

export default observer(UserSettings)