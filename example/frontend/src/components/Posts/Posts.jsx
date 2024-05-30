/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react'
import PostService from '../../services/PostService'
import styles from './Posts.module.css'
import PostCard from '../PostCard/PostCard'
import PostCardSkeleton from '../PostCardSkeleton/PostCardSkeleton'
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
    const [isActivated, setIsActivated] = useState(store.user.isActivated)
    const [searchData, setSearchData] = useState({
        username: '',
        isMy: false,
        title: ''
    })

    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [countOfPages, setCountOfPages] = useState(0)
    const [visiblePages, setVisiblePages] = useState([1])
    const [currentLimit, setCurrentLimit] = useState(5)
    const [countOfPosts, setCountOfPosts] = useState(0)

    useEffect(() => {
        setIsAuth(store.isAuth)
    }, [store.isAuth])

    useEffect(() => {
        setIsActivated(store.user.isActivated)
    }, [store.user.isActivated])

    useEffect(() => {
        const getPosts = async () => {
            setIsLoading(true)
            let offset
            if (currentPage === 0 || currentPage === 1) offset = 0
            else offset = (currentPage - 1) * currentLimit

            let author = searchData.username
            if (store.isAuth && searchData.isMy) author = store.user.username
            const response = await PostService.fetchPosts(offset, currentLimit, author, searchData.title)
            setPosts(response.data.posts)
            setCountOfPages(Math.ceil(response.data.count / currentLimit))
            setCountOfPosts(response.data.count)
            setTimeout(() => setIsLoading(false), 1000)
        }
        getPosts()
    }, [isUpdated, currentPage, currentLimit])



    const handlePageClick = (page) => {
        if (isLoading) return
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
        if (isLoading) return
        setCurrentLimit(currentLimit + 5)
    }

    const goToFirstPage = () => {
        if (isLoading) return
        if (currentPage === 1) return
        setCurrentPage(1)
    }

    const goToLastPage = () => {
        if (isLoading) return
        if (currentPage === countOfPages) return
        setCurrentPage(countOfPages)
    }


    return (
        <div className={styles.wrapper}>
            <div className={styles.filters}>
                <form className={styles.form} >
                    <div className={styles.flexTitle}>
                        <h1>Фильтры </h1>
                    </div>  
                    <div className={styles.inputForm}>
                        <svg height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <input type="text" className={styles.input} placeholder="Заголовок" 
                            onChange={(e) => { setSearchData({...searchData, title: e.target.value}); setIsUpdated(!isUpdated); }} value={searchData.title}/>
                    </div>
                    <div className={styles.inputForm}>
                        <svg height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <input type="text" className={styles.input} placeholder="Имя автора" 
                            onChange={(e) => { setSearchData({...searchData, username: e.target.value}); setIsUpdated(!isUpdated);}} value={searchData.username}/>
                    </div>
                    {
                        store.isAuth &&
                        <div className={styles.flexRow}>
                        <div>
                            <input type="checkbox" id="myPosts" className={styles.uiCheckbox} 
                                checked={searchData.isMy} onChange={(e) => {setSearchData({...searchData, isMy: e.target.checked}); setIsUpdated(!isUpdated);}}/>
                            <label htmlFor='myPosts'> Мои посты </label>
                        </div>
                    </div>
                    }
                </form>
            </div>

            <div className={styles.postsBlock}>
            <div><h1>Посты</h1></div>
            {
                isAuth && isActivated
                ?
                <button className={styles.button} onClick={() => setCreateDialogShow(true)}>Новый пост</button>
                :
                <></>
            }
            
            <div className={styles.posts}>
            {
                isLoading 
                ?
                Array.from({length: currentLimit}).map((_, index) => <PostCardSkeleton key={index} />)
                :
                <></>
            }
            {
                !isLoading && (posts.length > 0
                ?
                    (
                        posts.map(post => <PostCard key={post._id} 
                            postData={post} setIsUpdated={setIsUpdated}/>)
                    )
                :
                    <div>Посты не найдены</div>)
            }
            {
                currentPage === 1 &&
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
        </div>
        <PostDialog setDialogShow={setCreateDialogShow} dialogShow={createDialogShow} 
                setIsUpdated={setIsUpdated} createMode={true} />
        </div>
    )
}

export default observer(Posts)