/* eslint-disable react/prop-types */
import styles from './AdminUserCard.module.css'
import AdminService from '../../services/AdminService'
import { useContext } from 'react'
import { AuthContext } from '../../hoc/AuthProvider'

function AdminUserCard({user, setIsChanged}) {
    const { store } = useContext(AuthContext)

    const changeToUser = () => {
        if (store.user.id === user.id) {
            alert('Нельзя сменить роль себе')
            return
        }
        AdminService.updateToUser(user.id)
        setIsChanged(true)
    }

    const changeToAdmin = () => {
        if (store.user.id === user.id) {
            alert('Нельзя сменить роль себе')
            return
        }
        AdminService.updateToAdmin(user.id)
        setIsChanged(true)
    }

    return (
        <div className={styles.UserCard}>
            <div className={styles.username}>Имя пользователя: {user.username}</div>
            <div>Email: {user.email}</div>
            <div className={styles.roles}>
                <div>Роли:</div>
                {
                    user.roles.map(role => <div key={role}>{role}</div>)
                }
            </div>
            { store.user.id !== user.id 
                ?
                    (user.roles.includes('ADMIN') 
                        ?
                        <button className={styles.changeRoleBtn} onClick={changeToUser}>Снять роль администратора</button>
                        :
                        <button className={styles.changeRoleBtn} onClick={changeToAdmin}>Назначить администатором</button>
                    )
                :   
                    <></>
            }
            
        </div>
    )
}

export default AdminUserCard