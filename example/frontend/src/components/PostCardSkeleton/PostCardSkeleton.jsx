/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import styles from '../PostCard/PostCard.module.css'
import ContentLoader from "react-content-loader"

export default function PostCardSkeleton() {

    return (
        <>
        <div className={styles.postCard}>
            <ContentLoader 
                speed={0.7}
                className={styles.credentials}
                backgroundColor="#979797"
                foregroundColor="#ecebeb"
            >
                <rect width="150" rx="7" ry="7" height="18" />
                <rect width="100" rx="7" ry="7" y="30" height="14" />
                <rect width="180" rx="7" ry="7" y="56" height="14" />
                <rect width="35vw" rx="7" ry="7" y="96" height="18" />
                <rect width="35vw" rx="7" ry="7" y="126" height="18" />
            </ContentLoader>
        </div>
        </>
        
    )
}