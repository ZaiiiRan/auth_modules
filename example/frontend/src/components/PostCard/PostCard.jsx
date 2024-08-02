/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import styles from './PostCard.module.css'
import useAuth from '../../hooks/useAuth'
import PostService from '../../services/PostService'
import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import PostDialog from '../PostDialog/PostDialog'
import { useNotification } from '../../hooks/useNotification'


function PostCard({postData, setIsUpdated}) {
    const { setMessage } = useNotification()
    const store = useAuth()
    const [isEditDialogShow, setIsEditDialogShow] = useState(false)

    const deletePost = async () => {
        try {
            await PostService.deletePost(postData._id, postData.user)
            setIsUpdated(prev => !prev)

            setMessage({
                title: 'Успех',
                text: 'Пост успешно удален'
            })
        } catch (e) {
            if (e.response.status !== 500) {
                //alert(e.response.data.message)
                setMessage({
                    title: 'Ошибка',
                    text: `${e.response.data.message}`
                })
            } else {
                //alert('Ошибка связи с сервером')
                setMessage({
                    title: 'Ошибка',
                    text: 'Ошибка связи с сервером'
                })
            }
        }
        
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