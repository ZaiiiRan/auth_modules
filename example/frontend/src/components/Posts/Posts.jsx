import { useState, useEffect } from 'react'
import PostService from '../../services/PostService'
import styles from './Posts.module.css'
import PostCard from '../PostCard/PostCard'

export default function Posts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        const getPosts = async () => {
            const response = await PostService.fetchPosts()
            setPosts(response.data)
        }
        getPosts()
    }, [])

    return (
        <div className={styles.postsBlock}>
            <div><h1>Посты</h1></div>
            <div className={styles.posts}>
            {
                posts.length > 0
                ?
                    posts.map(post => <PostCard key={post.id} postID={post.id} author={post.author} 
                        authorID={post.user} body={post.body} title={post.title}/>)
                :
                    <div>Посты не найдены</div>
            }
            </div>
        </div>
    )
}