/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react'
import PostService from '../../services/PostService'
import styles from './Posts.module.css'
import PostCard from '../PostCard/PostCard'
import PostDialog from '../PostDialog/PostDialog'
import useAuth from '../../hooks/useAuth'
import { observer } from 'mobx-react-lite'

function Posts() {
    const [posts, setPosts] = useState([])
    const [createDialogShow, setCreateDialogShow] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)
    const store = useAuth()
    const [isAuth, setIsAuth] = useState(store.isAuth)

    useEffect(() => {
        setIsAuth(store.isAuth)
    }, [store.isAuth])

    useEffect(() => {
        const getPosts = async () => {
            const response = await PostService.fetchPosts()
            setPosts(response.data)
        }
        getPosts()
        setIsUpdated(false)
    }, [isUpdated])

    return (
        <div className={styles.postsBlock}>
            <div><h1>Посты</h1></div>
            {
                isAuth
                ?
                <button className={styles.button} onClick={() => setCreateDialogShow(true)}>Новый пост</button>
                :
                <></>
            }
            
            <div className={styles.posts}>
            {
                posts.length > 0
                ?
                    posts.map(post => <PostCard key={post._id} 
                        postData={post} setIsUpdated={setIsUpdated}/>)
                :
                    <div>Посты не найдены</div>
            }
            </div>
            <PostDialog setDialogShow={setCreateDialogShow} dialogShow={createDialogShow} 
                setIsUpdated={setIsUpdated} createMode={true}/>
        </div>
    )
}

export default observer(Posts)