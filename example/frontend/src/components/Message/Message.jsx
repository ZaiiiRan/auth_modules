/* eslint-disable react/prop-types */
import styles from './Message.module.css'

export default function Message({message}) {
    return (
        <div className={styles.Message}>
            {message}
        </div>
    )
}