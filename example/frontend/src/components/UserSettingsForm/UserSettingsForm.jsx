/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef         } from 'react'
import useAuth from '../../hooks/useAuth'
import styles from './UserSettingsForm.module.css'
import ConfirmPasswordDialog from '../ConfirmPasswordDialog/ConfirmPasswordDialog'

export default function UserSettingsForm() {
    const store = useAuth()
    const [password, setPassword] = useState('')
    const [operation, setOperation] = useState(null)
    const [confirmShow, setConfirmShow] = useState(false)
    const [data, setData] = useState({
        username: store.user.username,
        email: store.user.email,
        password: '',
        repeatPassword: ''
    })
    const [isPasswordsHidden, setIsPasswordHidden] = useState({
        password: true,
        repeatPassword: true
    })
    const passwordRef = useRef()
    const repeatPasswordRef = useRef()

    useEffect(() => {
        if (isPasswordsHidden.password) {
            passwordRef.current.type = 'password'
        } else {
            passwordRef.current.type = 'text'
        }
    }, [isPasswordsHidden.password])

    useEffect(() => {
        if (isPasswordsHidden.repeatPassword) {
            repeatPasswordRef.current.type = 'password'
            
        } else {
            repeatPasswordRef.current.type = 'text'
        }
    }, [isPasswordsHidden.repeatPassword])

    useEffect(() => {
        if (password !== '') {
            operation(password)
            setOperation(null)
            setPassword('')
        }
    }, [password])


    const saveUsername = async (e) => {
        e.preventDefault()
        if (data.username === store.user.username) {
            alert('Веденное имя пользователя совпадает с текущим именем пользователя')
            return
        }
        if (data.username !== '') {
            setConfirmShow(true)
            setOperation(() => saveUsernameRequest)
        }
        if (data.username === '') {
            alert('Имя пользователя пусто')
        }
        
    }

    const saveUsernameRequest = async (password) => {
        const success = await store.changeUsername(data.username, password)
        if (success) {
            setData({...data, username: store.user.username})
            alert('Имя пользователя успешно изменено')
        }
        else return
    }

    const saveEmail = async (e) => {
        e.preventDefault()
        if (data.email === store.user.email) {
            alert('Веденный Email совпадает с текущим Email пользователя')
            return
        }
        if (data.email !== '')
            if (!(new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/)).test(data.email)) {
                alert('Email некорректен')
                return
            }
        if (data.email !== '') {
            setConfirmShow(true)
            setOperation(() => saveEmailRequest)
        }
        if (data.email === '') {
            alert('Email пуст')
        }
    }

    const saveEmailRequest = async (password) => {
        const success = await store.changeEmail(data.email, password)
        if (success) {
            setData({...data, email: ''})
            setData({...data, email: store.user.email})
            alert('Email успешно изменен')
        } 
        else return
    }

    const savePassword = async (e) => {
        e.preventDefault()
        if (data.password !== '') 
            if (!(new RegExp(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)).test(data.password)) {
                alert('Пароль должен содержать от 8 символов, хотя бы одну заглавную латинскую букву, одну строчную латинскую букву, одну цифру и один специальный символ')
                return
            }
        if (data.password !== '' && data.repeatPassword !== data.password) {
            alert('Пароли должны совпвдать')
            return
        }
        if (data.password !== '') {
            setConfirmShow(true)
            setOperation(() => savePasswordRequest)
        }
        if (data.password === '') {
            alert('Пароль пуст')
        } 
    }

    const savePasswordRequest = async (password) => {
        const success = await store.changePassword(data.password, password)
        if (success) {
            setData({...data, password: '', repeatPassword: ''})
            alert('Пароль успешно изменен')
        } 
        else return
    }

    return (
        <>
        <form className={styles.form}>
            <div className={styles.flexTitle}>
                <h1>Настройки пользователя </h1>
            </div>
            <div className={styles.flexColumn}>
                <label>Новое имя пользователя: </label>
            </div>
            <div className={styles.flexRow}>
                <div className={styles.inputForm}>
                    <svg height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="4" stroke="#000000" strokeWidth="1.5"></circle> <path d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z" stroke="#000000" strokeWidth="1.5"></path> </g></svg>
                    <input type="text" className={styles.input} placeholder="Имя пользователя" 
                        onChange={(e) => setData({...data, username: e.target.value})} value={data.username}/>
                </div>
                <button className={styles.buttonSubmit} onClick={saveUsername}>Сохранить</button>
            </div>

            <div className={styles.flexColumn}>
                <label>Новый Email </label>
            </div>
            <div className={styles.flexRow}>
                <div className={styles.inputForm}>
                    <svg height="20" viewBox="0 0 32 32" width="20" xmlns="http://www.w3.org/2000/svg"><g id="Layer_3" data-name="Layer 3"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path></g></svg>
                    <input type="text" className={styles.input} placeholder="Email" 
                        onChange={(e) => setData({...data, email: e.target.value})} value={data.email}/>
                </div>
                <button className={styles.buttonSubmit} onClick={saveEmail}>Сохранить</button>
            </div>
            <div className={styles.flexColumn}>
                <label>Новый Пароль </label>
            </div>
            <div className={styles.flexRow}>
                <div className={styles.passwords}>
                    <div className={styles.inputForm}>

                        <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path></svg>        
                        <input ref={passwordRef} type="password" className={styles.input} placeholder="Введите пароль" 
                            onChange={(e) => setData({...data, password: e.target.value})} value={data.password}/>

                        {
                            isPasswordsHidden.password
                                ? 
                                <svg onClick={() => setIsPasswordHidden({...isPasswordsHidden, password: false})} height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                :
                                <svg onClick={() => setIsPasswordHidden({...isPasswordsHidden, password: true})} height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        }
                    </div>
                    <div className={styles.inputForm}>
                        <svg height="20" viewBox="-64 0 512 512" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path><path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path></svg>        

                        <input ref={repeatPasswordRef} type="password" className={styles.input} placeholder="Повторите пароль" 
                            onChange={(e) => setData({...data, repeatPassword: e.target.value})} value={data.repeatPassword}/>

                        {
                            isPasswordsHidden.repeatPassword 
                                ? 
                                <svg onClick={() => setIsPasswordHidden({...isPasswordsHidden, repeatPassword: false})} height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73324 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94291 16.4788 5 12.0012 5Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                :
                                <svg onClick={() => setIsPasswordHidden({...isPasswordsHidden, repeatPassword: true})} height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        }
                    </div>
                </div>
                <button className={styles.buttonSubmit} onClick={savePassword}>Сохранить</button>
            </div>
        </form>
        <ConfirmPasswordDialog setDialogShow={setConfirmShow} dialogShow={confirmShow} setOutput={setPassword}/>
        </>
        
    )
}