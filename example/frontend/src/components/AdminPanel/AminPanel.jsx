/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import AdminService from '../../services/AdminService'
import styles from './AdminPanel.module.css'
import AdminUserCard from '../AdminUserCard/AdminUserCard'
import useAuth from '../../hooks/useAuth'
import AdminUserCardSkeleton from '../AdminUserCardSkeleton/AdminUserCardSkeleton'

const MAX_PAGES_TO_DISPLAY = 4

export default function AdminPanel() {
    const [users, setUsers] = useState([])
    const [isChanged, setIsChanged] = useState(false) 
    const [searchData, setSearchData] = useState({
        username: '',
        isBlocked: false,
        isAdmin: false
    })
    const store = useAuth()

    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [countOfPages, setCountOfPages] = useState(0)
    const [visiblePages, setVisiblePages] = useState([1])
    const [currentLimit, setCurrentLimit] = useState(5)
    const [countOfUsers, setCountOfUsers] = useState(0)



    useEffect(() => {
        store.checkAuth()
    }, [store])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchData])

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
        const getUsers = async () => {
            try {
                setIsLoading(true)
                let offset = 0
                if (currentPage !== 1) offset = (currentPage - 1) * currentLimit 
    
                const response = await AdminService.fetchUsers(searchData.username, searchData.isBlocked, 
                    searchData.isAdmin, currentLimit, offset)
                setUsers(response.data.users)
                setCountOfPages(Math.ceil(response.data.count / currentLimit))
                setCountOfUsers(response.data.count)
                setTimeout(() => setIsLoading(false), 1000)
            } catch {
                alert('Ошибка при получении данных')
                setUsers([])
                setIsLoading(false)
            }
            
        }
        getUsers()
        updateVisiblePages()
    }, [isChanged, currentPage])

    useEffect(() => {
        if (currentPage > 1 && users.length === 0) {
            const page = Math.ceil(countOfUsers / currentLimit)
            setCurrentPage(page)
        }
        updateVisiblePages()
    }, [currentPage, countOfPages])

    const goToFirstPage = () => {
        if (currentPage === 1) return
        setCurrentPage(1)
    }

    const goToLastPage = () => {
        if (currentPage === countOfPages) return
        setCurrentPage(countOfPages)
    }

    const handlePageClick = (page) => {
        setCurrentPage(page)
    }

    return (
        <div className={styles.wrapper}>
            <div>
                <form className={styles.form} >
                    <div className={styles.flexTitle}>
                        <h1>Фильтры </h1>
                    </div>  
                    <div className={styles.inputForm}>
                        
                        <svg height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <input type="text" className={styles.input} placeholder="Имя пользователя или Email" 
                            onChange={(e) => { setSearchData({...searchData, username: e.target.value}); currentPage === 1 ? setIsChanged(!isChanged) : null; }}
                            value={searchData.username}
                        />

                    </div>
                    <div className={styles.flexRow}>
                        <div>

                            <input type="checkbox" id="admins" className={styles.uiCheckbox} 
                                checked={searchData.isAdmin} 
                                onChange={(e) => {setSearchData({...searchData, isAdmin: e.target.checked}); currentPage === 1 ? setIsChanged(!isChanged) : null;}}
                            />
                            
                            <label htmlFor='admins'> Администраторы </label>
                        </div>
                    </div>
                    <div className={styles.flexRow}>
                        <div>

                            <input type="checkbox" id="blocked" className={styles.uiCheckbox}
                                checked={searchData.isBlocked} 
                                onChange={(e) => {setSearchData({...searchData, isBlocked: e.target.checked}); currentPage === 1 ? setIsChanged(!isChanged) : null;}}
                            />
                            
                            <label htmlFor='blocked'> Заблокированные </label>
                        </div>
                    </div>
                </form>
            </div>
            <div className={styles.AdminPanel}>
                <div className={styles.users}>
                    {   
                        !isLoading &&
                        (users.length > 0 
                        ?
                        users.map(user => 
                            <AdminUserCard key={user.username}
                                user={user} setIsChanged={setIsChanged}/>
                        )
                        :
                        <div>Пользователи не найдены</div>)
                    }
                    {
                        isLoading 
                        ?
                        Array.from({length: currentLimit}).map((_, index) => <AdminUserCardSkeleton key={index} />)
                        :
                        <></>
                    }
                </div>
                {
                    users.length > 0
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
        </div>
    )
}