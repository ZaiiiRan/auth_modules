import styles from './PostCard.module.css'
import useAuth from '../../hooks/useAuth'
import { Navigate } from 'react-router'

export default function PostCard({title, body, postID, authorID, author}) {
    const store = useAuth()

    const deletePost = async () => {
        const response = await PostService.deletePost(postID, authorID)
        
    }

    return (
        <div className={styles.postCard}>
            {
                store.user.id === authorID || store.user.roles.includes('ADMIN')
                ?
                <div className={styles.buttons}>
                    <button className={styles.button}>Редактировать</button>
                    <button className={styles.button}>Удалить</button>
                </div>
                :
                <></>
            }
            <div className={styles.credentials}>
                <div className={styles.title}>{title}</div>
                <div className={styles.author}>{author}</div>
            </div>
            <div className={styles.body}>{body}</div>
        </div>
    )
}