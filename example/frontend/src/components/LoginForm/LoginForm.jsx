import useAuth from '../../hooks/useAuth'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './LoginForm.module.css'

export default function LoginForm() {
    const store = useAuth()
    const [data, setData] = useState({
        username: '',
        password: ''
    })

    const [isPasswordsHidden, setIsPasswordHidden] = useState(true)
    const passwordRef = useRef()

    useEffect(() => {
        if (isPasswordsHidden) {
            passwordRef.current.type = 'password'
        } else {
            passwordRef.current.type = 'text'
        }
    }, [isPasswordsHidden])

    const submitForm = (e) => {
        e.preventDefault()
        if (data.username !== '' && data.password !== '') {
            return store.login(data.username, data.password)
        }
        return
    }

    return (
        <form className={styles.form} onSubmit={submitForm}>
            <div className={styles.flexTitle}>
                <h1>Авторизация </h1>
            </div>
            <div className={styles.flexColumn}>
                <label>Имя пользователя </label>
            </div>
            <div className={styles.inputForm}>
                
                <svg height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="4" stroke="#000000" strokeWidth="1.5"></circle> <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" stroke="#000000" strokeWidth="1.5"></path> </g></svg>
                <input type="text" className={styles.input} placeholder="Введите имя пользователя" 
                    onChange={(e) => setData({...data, username: e.target.value})} value={data.username}/>
            
            </div>

            <div className={styles.flexColumn}>
                <label>Пароль </label>
            </div>
            <div className={styles.inputForm}>
                
                <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path></svg>        
                <input ref={passwordRef} type="password" className={styles.input} placeholder="Введите пароль" 
                    onChange={(e) => setData({...data, password: e.target.value})} value={data.password}/>
                
                {
                    isPasswordsHidden
                        ? 
                        <svg onClick={() => setIsPasswordHidden(false)} height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        :
                        <svg onClick={() => setIsPasswordHidden(true)} height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                }
            </div>

            <button className={styles.buttonSubmit}>Войти</button>
            <p className={styles.text}>Еще не зарегистированы? <Link to="/register" className={styles.link}>Зарегистрироваться</Link></p>
        </form>
    )

}