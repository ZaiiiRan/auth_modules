/* eslint-disable react/prop-types */
import styles from './AdminUserCard.module.css'
import AdminService from '../../services/AdminService'
import useAuth from '../../hooks/useAuth'
import { useNotification } from '../../hooks/useNotification'

function AdminUserCard({user, setIsChanged}) {
    const { setMessage } = useNotification()
    const store = useAuth()

    const changeToUser = async () => {
        if (user.isBlocked) return
        if (store.user.id === user.id) {
            //alert('Нельзя сменить роль себе')
            setMessage({
                title: 'Ошибка',
                text: 'Нельзя сменить роль себе'
            })
            return
        }
        try {
            await AdminService.updateToUser(user.id)
            setIsChanged(prev => !prev)

            setMessage({
                title: 'Успех',
                text: 'У пользователя отозваны права администратора'
            })
        } catch (e) {
            setMessage({
                title: 'Ошибка',
                text: `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`
            })
        }
    }

    const changeToAdmin = async () => {
        if (user.isBlocked) return
        if (store.user.id === user.id) {
            //alert('Нельзя сменить роль себе')
            setMessage({
                title: 'Ошибка',
                text: 'Нельзя сменить роль себе'
            })
            return
        }
        try {
            await AdminService.updateToAdmin(user.id)
            setIsChanged(prev => !prev)

            setMessage({
                title: 'Успех',
                text: 'Пользователю выданы права администратора'
            })
        } catch (e) {
            setMessage({
                title: 'Ошибка',
                text: `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`
            })
        }
    }

    const ban = async () => {
        if (store.user.id === user.id) {
            //alert('Нельзя заблокировать себя')
            setMessage({
                title: 'Ошибка',
                text: 'Нельзя заблокировать себя'
            })
            return
        }
        try {
            await AdminService.banUser(user.id)
            setIsChanged(prev => !prev)

            setMessage({
                title: 'Успех',
                text: 'Пользователь заблокирован'
            })
        } catch (e) {
            setMessage({
                title: 'Ошибка',
                text: `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`
            })
        }
    }

    const unban = async () => {
        if (store.user.id === user.id) {
            alert('Нельзя разблокировать себя')
            setMessage({
                title: 'Ошибка',
                text: 'Нельзя разблокировать себя'
            })
            return
        } 
        try {
            await AdminService.unbanUser(user.id)
            setIsChanged(prev => !prev)

            setMessage({
                title: 'Успех',
                text: 'Пользователь разблокирован'
            })
        } catch (e) {
            setMessage({
                title: 'Ошибка',
                text: `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`
            })
        }
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