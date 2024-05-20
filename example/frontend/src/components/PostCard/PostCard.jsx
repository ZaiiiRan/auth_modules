/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import styles from './PostCard.module.css'
import useAuth from '../../hooks/useAuth'
import PostService from '../../services/PostService'
import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'

function PostCard({title, body, postID, authorID, author, setIsUpdated}) {
    const store = useAuth()
    const [isAuth, setIsAuth] = useState(store.isAuth)

    useEffect(() => {
        setIsAuth(store.isAuth)
    }, [store.isAuth])

    const deletePost = async () => {
        await PostService.deletePost(postID, authorID)
        setIsUpdated(true)
    }

    return (
        <div className={styles.postCard}>
            {
                isAuth && (store.user.id === authorID || store.user.roles.includes('ADMIN'))
                ?
                <div className={styles.buttons}>
                    <button className={styles.button}>Редактировать</button>
                    <button className={styles.button} onClick={deletePost}>Удалить</button>
                </div>
                :
                <></>
            }
            <div className={styles.credentials}>
                <div className={styles.title}>{title}</div>
                <div className={styles.author}>Автор: {author}</div>
            </div>
            <div className={styles.body}>{body}</div>
        </div>
    )
}

export default observer(PostCard)