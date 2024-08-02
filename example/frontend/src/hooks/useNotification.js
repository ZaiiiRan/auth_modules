import { useContext } from "react"
import { NotificationContext } from "../hoc/NotificationProvider"

export const useNotification = () => {
    const { message, setMessage } = useContext(NotificationContext)
    return { message, setMessage }
}