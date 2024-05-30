/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import styles from './PostCard.module.css'
import useAuth from '../../hooks/useAuth'
import PostService from '../../services/PostService'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import PostDialog from '../PostDialog/PostDialog'


function PostCard({postData, setIsUpdated}) {
    const store = useAuth()
    const [isEditDialogShow, setIsEditDialogShow] = useState(false)

    const deletePost = async () => {
        await PostService.deletePost(postData._id, postData.user)
        setIsUpdated(true)
    }

    const dateToString = (date) => {
        const d = new Date(date)
        return d.toLocaleString().slice(0, 17)
    }

    return (
        <>
        <div className={styles.postCard}>
            {
                store.isAuth && store.user.isActivated && (store.user.id === postData.user || store.user.roles.includes('ADMIN'))
                ?
                <div className={styles.buttons}>
                    <button className={styles.button} onClick={() => setIsEditDialogShow(true)}>Редактировать</button>
                    <button className={styles.button} onClick={deletePost}>Удалить</button>
                </div>
                :
                <></>
            }
            <div className={styles.credentials}>
                <div className={styles.title}>{postData.title}</div>
                <div className={styles.author}>Автор: {postData.author}</div>
                <div className={styles.author}>Дата публикации: {dateToString(postData.date)}</div>
                {
                    postData.lastEditDate
                    ?
                    <div className={styles.author}>Дата последнего изменения: {dateToString(postData.lastEditDate)}</div>
                    :
                    <></>
                }
                
            </div>
            <div className={styles.body}>{postData.body}</div>
        </div>
        <PostDialog dialogShow={isEditDialogShow} setDialogShow={setIsEditDialogShow}
            setIsUpdated={setIsUpdated} createMode={false} postData={postData}/>
        </>
        
    )
}

export default observer(PostCard)