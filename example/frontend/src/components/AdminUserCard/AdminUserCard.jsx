/* eslint-disable react/prop-types */
import styles from './AdminUserCard.module.css'
import AdminService from '../../services/AdminService'
import useAuth from '../../hooks/useAuth'

function AdminUserCard({user, setIsChanged}) {
    const store = useAuth()

    const changeToUser = async () => {
        if (user.isBlocked) return
        if (store.user.id === user.id) {
            alert('Нельзя сменить роль себе')
            return
        }
        await AdminService.updateToUser(user.id)
        setIsChanged(prev => !prev)
    }

    const changeToAdmin = async () => {
        if (user.isBlocked) return
        if (store.user.id === user.id) {
            alert('Нельзя сменить роль себе')
            return
        }
        await AdminService.updateToAdmin(user.id)
        setIsChanged(prev => !prev)
    }

    const ban = async () => {
        if (store.user.id === user.id) {
            alert('Нельзя заблокировать себя')
            return
        }
        await AdminService.banUser(user.id)
        setIsChanged(prev => !prev)
    }

    const unban = async () => {
        if (store.user.id === user.id) {
            alert('Нельзя заблокировать себя')
            return
        }
        await AdminService.unbanUser(user.id)
        setIsChanged(prev => !prev)
    }

    return (
        <div className={styles.UserCard}>
            <div className={styles.username}>Имя пользователя: {user.username}</div>
            <div>Email: {user.email}</div>
            <div>Статус: {user.isBlocked ? 'Заблокирован' : 'Активен'}</div>
            <div className={styles.roles}>
                <div>Роли:</div>
                {
                    user.roles.map(role => <div key={role}>{role}</div>)
                }
            </div>
            <div className={styles.buttons}>
            { store.user.id !== user.id 
                ?
                    (user.roles.includes('ADMIN') 
                        ?
                        <button className={styles.button} onClick={changeToUser} disabled={user.isBlocked}>Снять роль администратора</button>
                        :
                        <button className={styles.button} onClick={changeToAdmin} disabled={user.isBlocked}>Назначить администатором</button>
                    )
                :   
                    <></>
            }
            { store.user.id !== user.id 
                ?
                    (user.isBlocked 
                        ?
                        <button className={styles.button} onClick={unban}>Разблокировать</button>
                        :
                        <button className={styles.button} onClick={ban}>Заблокировать</button>
                    )
                :   
                    <></>
            }
            </div>
        </div>
    )
}

export default AdminUserCard