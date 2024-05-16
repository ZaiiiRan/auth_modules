import { useEffect, useState } from 'react'
import AdminService from '../../services/AdminService'
import styles from './AdminPanel.module.css'
import AdminUserCard from '../AdminUserCard/AdminUserCard'

export default function AdminPanel() {
    const [users, setUsers] = useState([])
    const [isChanged, setIsChanged] = useState(false) 

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
                {
                    users.map(user => 
                        <AdminUserCard key={user.username}
                            user={user} setIsChanged={setIsChanged}/>
                    )
                }
            </div>
            
        </>
    )
}