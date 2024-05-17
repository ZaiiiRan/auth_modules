import useAuth from '../../hooks/useAuth'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './LoginForm.module.css'

export default function LoginForm() {
    const store = useAuth()
    const [data, setData] = useState({
        username: '',
        password: ''
    })

    const submitForm = (e) => {
        e.preventDefault()
        if (data.username !== '' && data.password !== '') {
            return store.login(data.username, data.password)
        }
        return
    }

    return (
        <form className={styles.form} onSubmit={submitForm}>
            <input className={styles.input} type="text" name='username' placeholder='Имя пользователя' 
                value={data.username} onChange={e => setData({...data, username: e.target.value})}/>

            <input className={styles.input} type="password" name='password' placeholder='Пароль' 
                value={data.password} onChange={e => setData({...data, password: e.target.value})}/>

            <input className={styles.button} type="submit" value='Войти' />
            <Link to='/register' className={styles.navLink}>Зарегистрироваться</Link>
        </form>
    )

}