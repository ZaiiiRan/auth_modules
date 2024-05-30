/* eslint-disable react/prop-types */
import styles from '../AdminUserCard/AdminUserCard.module.css'
import ContentLoader from "react-content-loader"

function AdminUserCard() {
    return (
        <div className={styles.UserCard}>
            <ContentLoader 
            
                speed={0.7}
                backgroundColor="#979797"
                foregroundColor="#ecebeb"
            >
                <rect width="150" rx="7" ry="7" height="20" />
                <rect width="200" rx="7" ry="7" y="28" height="14" />
                <rect width="170" rx="7" ry="7" y="50" height="14" />
                <rect width="130" rx="7" ry="7" y="72"  height="14" />
                <rect width="49%" x="0" rx="7" ry="7" y="95" height="45" />
                <rect width="49%" x="50%" rx="7" ry="7" y="95" height="45" />
            </ContentLoader>
        </div>
    )
}

export default AdminUserCard