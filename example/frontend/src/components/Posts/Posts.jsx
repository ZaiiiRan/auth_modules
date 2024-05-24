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

    const [currentPage, setCurrentPage] = useState(0)
    const [countOfPages, setCountOfPages] = useState(0)
    const [visiblePages, setVisiblePages] = useState([1])
    const [currentLimit, setCurrentLimit] = useState(5)

    useEffect(() => {
        setIsAuth(store.isAuth)
    }, [store.isAuth])

    useEffect(() => {
        const getPosts = async () => {
            let offset
            if (currentPage === 0 || currentPage === 1) offset = 0
            else offset = (currentPage - 1) * currentLimit
            const response = await PostService.fetchPosts(offset, currentLimit)
            setPosts(response.data.posts)
            console.log(Math.ceil(response.data.count / currentLimit))
            setCountOfPages(Math.ceil(response.data.count / currentLimit))
        }
        getPosts()
        setIsUpdated(false)
    }, [isUpdated])



    const showMore = () => {
        setCurrentLimit(currentLimit + 5)
        setIsUpdated(true)
    }

    const goToFirstPage = () => {
        setCurrentPage(1)
        setIsUpdated(true)
    }

    const goToLastPage = () => {
        setCurrentPage(countOfPages)
        setIsUpdated(true)
    }

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
                    (
                        posts.map(post => <PostCard key={post._id} 
                            postData={post} setIsUpdated={setIsUpdated}/>)
                    )
                :
                    <div>Посты не найдены</div>
            }
            </div>
            {
                posts.length > 0
                ?
                <>
                <button className={styles.button} onClick={showMore}>Показать еще</button>
                <div className={styles.pages}>
                    <button onClick={goToFirstPage} className={styles.pageBtn}>&lt;&lt;</button>
                    {
                        visiblePages.map(pageNum => 
                            <button className={styles.activePageBtn} key={pageNum}>{pageNum}</button>)
                    }
                    <button onClick={goToLastPage} className={styles.pageBtn}>&gt;&gt;</button>
                </div>
                </>
                
                :
                <></>
            }
            <PostDialog setDialogShow={setCreateDialogShow} dialogShow={createDialogShow} 
                setIsUpdated={setIsUpdated} createMode={true}/>
        </div>
    )
}

export default observer(Posts)