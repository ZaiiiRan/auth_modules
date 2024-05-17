/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import AdminService from '../../services/AdminService'
import styles from './AdminPanel.module.css'
import AdminUserCard from '../AdminUserCard/AdminUserCard'
import useAuth from '../../hooks/useAuth'

export default function AdminPanel() {
    const [users, setUsers] = useState([])
    const [isChanged, setIsChanged] = useState(false) 
    const [searchUsername, setSearchUsername] = useState('')
    const store = useAuth()

    useEffect(() => {
        store.checkAuth()
    }, [store])

    useEffect(() => {
        const getUsers = async () => {
            const response = await AdminService.fetchUsers()
            console.log(response.data)
            setUsers(response.data)
        }
        getUsers()
        setIsChanged(false)
    }, [isChanged])


    return (
        <>
            <div className={styles.AdminPanel}>
                <h1>Панель администратора</h1>

                <input placeholder='Поиск по имени пользователя' className={styles.usernameInput} 
                    value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} />

                {
                    users.filter(user => user.username.toLowerCase().startsWith(searchUsername.trim().toLowerCase())
                        || user.email.toLowerCase().startsWith(searchUsername.trim().toLowerCase()))
                    .map(user => 
                        <AdminUserCard key={user.username}
                            user={user} setIsChanged={setIsChanged}/>
                    )
                }
            </div>
            
        </>
    )
}