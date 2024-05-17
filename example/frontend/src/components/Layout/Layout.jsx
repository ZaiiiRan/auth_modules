/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'
import useAuth from '../../hooks/useAuth'
import { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'

function Layout() {
    const store = useAuth()
    const [isAuthenticated, setIsAuthenticated] = useState(store.isAuth)

    useEffect(() => {
        setIsAuthenticated(store.isAuth)
    }, [store.isAuth])

    return (
        <>
            <header>
                <div className={styles.leftHeader}>
                    <NavLink to={'/'} className={styles.logo}><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21.0667 5C21.6586 5.95805 22 7.08604 22 8.29344C22 11.7692 19.1708 14.5869 15.6807 14.5869C15.0439 14.5869 13.5939 14.4405 12.8885 13.8551L12.0067 14.7333C11.272 15.465 11.8598 15.465 12.1537 16.0505C12.1537 16.0505 12.8885 17.075 12.1537 18.0995C11.7128 18.6849 10.4783 19.5045 9.06754 18.0995L8.77362 18.3922C8.77362 18.3922 9.65538 19.4167 8.92058 20.4412C8.4797 21.0267 7.30403 21.6121 6.27531 20.5876C6.22633 20.6364 5.952 20.9096 5.2466 21.6121C4.54119 22.3146 3.67905 21.9048 3.33616 21.6121L2.45441 20.7339C1.63143 19.9143 2.1115 19.0264 2.45441 18.6849L10.0963 11.0743C10.0963 11.0743 9.3615 9.90338 9.3615 8.29344C9.3615 4.81767 12.1907 2 15.6807 2C16.4995 2 17.282 2.15509 18 2.43738" stroke="#5900e7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M17.8851 8.29353C17.8851 9.50601 16.8982 10.4889 15.6807 10.4889C14.4633 10.4889 13.4763 9.50601 13.4763 8.29353C13.4763 7.08105 14.4633 6.09814 15.6807 6.09814C16.8982 6.09814 17.8851 7.08105 17.8851 8.29353Z" stroke="#5900e7" strokeWidth="1.5"></path> </g></svg></NavLink>
                    <nav className={styles.navigation}>
                        <NavLink to={'/'} className={styles.navLink}>Главная</NavLink>
                        <NavLink to={'/'} className={styles.navLink}>Посты</NavLink>
                        {
                            !store.isLoading 
                                ?
                                (
                                    isAuthenticated && store.user.roles.includes('ADMIN')
                                        ?
                                            <NavLink to={'/admin'} className={styles.navLink}>Админ панель</NavLink>
                                        :
                                            <></>
                                )
                                :
                                    <></>
                        }
                    </nav>
                </div>
                <div>
                    { 
                        !store.isLoading 
                            ? 
                                (isAuthenticated 
                                    ?  
                                        <div className={styles.userBlock}>
                                            <NavLink to='/user-settings' className={styles.navLink}> {store.user.username} </NavLink>
                                            <div onClick={() => {store.logout(); setIsAuthenticated(false)}} className={styles.navLink}>Выйти</div>
                                        </div>
                                    :
                                        <NavLink to={'/login' } className={styles.navLink}>Войти</NavLink>
                                )
                            :
                                <div>Загрузка</div>
                    }
                </div>
            </header>
            <main><Outlet/></main>
        </>
    )
}

export default observer(Layout)
