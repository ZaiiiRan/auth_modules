import styles from './AdminUserCard.module.css'
import AdminService from '../../services/AdminService'

function AdminUserCard({user, setIsChanged}) {

    const changeToUser = () => {
        AdminService.updateToUser(user.id)
        setIsChanged(true)
    }

    const changeToAdmin = () => {
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
            {
                user.roles.includes('ADMIN') 
                    ?
                    <button className={styles.changeRoleBtn} onClick={changeToUser}>Снять роль администратора</button>
                    :
                    <button className={styles.changeRoleBtn} onClick={changeToAdmin}>Назначить администатором</button>
            }
        </div>
    )
}

export default AdminUserCard