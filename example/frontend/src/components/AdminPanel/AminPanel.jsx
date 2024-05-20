/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import AdminService from '../../services/AdminService'
import styles from './AdminPanel.module.css'
import AdminUserCard from '../AdminUserCard/AdminUserCard'
import useAuth from '../../hooks/useAuth'

export default function AdminPanel() {
    const [users, setUsers] = useState([])
    const [isChanged, setIsChanged] = useState(false) 
    const [searchData, setSearchData] = useState({
        username: '',
        isBlocked: false,
        isAdmin: false
    })
    const store = useAuth()

    useEffect(() => {
        store.checkAuth()
    }, [store])

    useEffect(() => {
        const getUsers = async () => {
            const response = await AdminService.fetchUsers(searchData.username, searchData.isBlocked, searchData.isAdmin)
            setUsers(response.data)
        }
        getUsers()
        setIsChanged(false)
    }, [isChanged])


    return (
        <div className={styles.wrapper}>
            <div>
                <form className={styles.form} >
                    <div className={styles.flexTitle}>
                        <h1>Фильтры </h1>
                    </div>  
                    <div className={styles.inputForm}>
                        <svg height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <input type="text" className={styles.input} placeholder="Имя пользователя или Email" 
                            onChange={(e) => { setSearchData({...searchData, username: e.target.value}); setIsChanged(true) }} value={searchData.username}/>
                    </div>
                    <div className={styles.flexRow}>
                        <div>
                            <input type="checkbox" id="admins" className={styles.uiCheckbox} 
                                checked={searchData.isAdmin} onChange={(e) => {setSearchData({...searchData, isAdmin: e.target.checked}); setIsChanged(true)}}/>
                            <label htmlFor='admins'> Администраторы </label>
                        </div>
                    </div>
                    <div className={styles.flexRow}>
                        <div>
                            <input type="checkbox" id="blocked" className={styles.uiCheckbox}
                                checked={searchData.isBlocked} onChange={(e) => {setSearchData({...searchData, isBlocked: e.target.checked}); setIsChanged(true)}}/>
                            <label htmlFor='blocked'> Заблокированные </label>
                        </div>
                    </div>
                </form>
            </div>
            <div className={styles.AdminPanel}>
                <div className={styles.users}>
                    {
                        users.map(user => 
                            <AdminUserCard key={user.username}
                                user={user} setIsChanged={setIsChanged}/>
                        )
                    }
                    {
                        users.length === 0
                            ?
                            <div>Пользователи не найдены</div>
                            :
                            <></>
                    }
                </div>
            </div>
        </div>
    )
}