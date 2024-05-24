/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react'
import PostService from '../../services/PostService'
import styles from './Posts.module.css'
import PostCard from '../PostCard/PostCard'
import PostDialog from '../PostDialog/PostDialog'
import useAuth from '../../hooks/useAuth'
import { observer } from 'mobx-react-lite'

const MAX_PAGES_TO_DISPLAY = 4

function Posts() {
    const [posts, setPosts] = useState([])
    const [createDialogShow, setCreateDialogShow] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)
    const store = useAuth()
    const [isAuth, setIsAuth] = useState(store.isAuth)

    const [currentPage, setCurrentPage] = useState(1)
    const [countOfPages, setCountOfPages] = useState(0)
    const [visiblePages, setVisiblePages] = useState([1])
    const [currentLimit, setCurrentLimit] = useState(5)
    const [countOfPosts, setCountOfPosts] = useState(0)

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
            setCountOfPages(Math.ceil(response.data.count / currentLimit))
            setCountOfPosts(response.data.count)
        }
        getPosts()
        setIsUpdated(false)
    }, [isUpdated, currentPage, currentLimit])



    const handlePageClick = (page) => {
        setCurrentPage(page)
    }

    const updateVisiblePages = () => {
        const startPage = Math.max(1, currentPage - 1)
        const endPage = Math.min(startPage + 3, countOfPages)
        const pagesToShow = Array.from({ length: 4 }, (_, i) => startPage + i)

        if (countOfPages <= MAX_PAGES_TO_DISPLAY) {
            setVisiblePages(Array.from({ length: countOfPages }, (_, i) => i + 1))
        } else if (startPage < 2) {
            setVisiblePages(Array.from({ length: 4 }, (_, i) => i + 1))
        } else if (endPage > countOfPages - 1) {
            setVisiblePages(Array.from({ length: 4 }, (_, i) => countOfPages - i).reverse().slice(0, 4))
        } else {
            setVisiblePages(pagesToShow)
        }
    }

    useEffect(() => {
        if (currentPage > 1 && posts.length === 0) {
            const page = Math.ceil(countOfPosts / currentLimit)
            setCurrentPage(page)
        }
        updateVisiblePages()
    }, [currentPage, countOfPages])

    const showMore = () => {
        setCurrentLimit(currentLimit + 5)
    }

    const goToFirstPage = () => {
        setCurrentPage(1)
    }

    const goToLastPage = () => {
        setCurrentPage(countOfPages)
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
            {
                posts.length > 0 && 
                (Math.ceil(countOfPosts / currentLimit) > currentPage)
                ?
                <button className={styles.button} onClick={showMore}>Показать еще</button>
                :
                <></>
            }
            </div>
            {
                posts.length > 0
                ?
                <>
                
                <div className={styles.pages}>
                    <button onClick={goToFirstPage} className={styles.pageBtn}>&lt;&lt;</button>
                    {
                        visiblePages.map(pageNum => {
                            return pageNum === currentPage 
                            ?
                            <button className={styles.activePageBtn} key={pageNum}>{pageNum}</button>
                            :
                            <button className={styles.pageBtn} onClick={() => handlePageClick(pageNum)} key={pageNum}>{pageNum}</button>
                        })    
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