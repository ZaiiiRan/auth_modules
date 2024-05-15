/* eslint-disable react-refresh/only-export-components */
import { Link } from 'react-router-dom'
import styles from './Login.module.css'
import { useContext, useState } from 'react'
import { AuthContext } from '../hoc/AuthProvider'
import { observer } from 'mobx-react-lite'

function Login() {
    const [data, setData] = useState({
        username: '',
        password: ''
    })
    const {store} = useContext(AuthContext)

    const submitForm = (e) => {
        e.preventDefault()
        if (data.username !== '' && data.password !== '') {
            return store.login(data.username, data.password)
        }
        return
    }

    return (
        <div className={styles.LoginBlock}>
            <form className={styles.form} onSubmit={submitForm}>
                <input className={styles.input} type="text" name='username' placeholder='Имя пользователя' 
                    value={data.username} onChange={e => setData({...data, username: e.target.value})}/>

                <input className={styles.input} type="password" name='password' placeholder='Пароль' 
                    value={data.password} onChange={e => setData({...data, password: e.target.value})}/>

                <input className={styles.button} type="submit" value='Войти' />
                <Link to='/register' className={styles.navLink}>Зарегистрироваться</Link>
            </form>
        </div>
    )
}

export default observer(Login)