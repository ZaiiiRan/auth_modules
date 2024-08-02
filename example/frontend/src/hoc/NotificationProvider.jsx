/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'

let triggerNotification

export const NotificationContext = createContext()

export function NotificationProvider({ children }) {
    const [message, setMessage] = useState({ title: '', text: '' })

    triggerNotification = (title, text) => {
        setMessage({ title, text })
    }

    return (
        <NotificationContext.Provider value={{ message, setMessage }}>
            {children}
        </NotificationContext.Provider>
    )
}

export { triggerNotification }