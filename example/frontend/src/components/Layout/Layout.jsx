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
                    <div className={styles.title}>Auth Example</div>
                    <nav className={styles.navigation}>
                        <NavLink to={'/'} className={styles.navLink}>Главная</NavLink>
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
