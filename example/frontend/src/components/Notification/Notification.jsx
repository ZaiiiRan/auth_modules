import { useEffect, useState, useRef } from 'react'
import { useNotification } from '../../hooks/useNotification'
import './Notification.css'

function Notification() {
    const { message } = useNotification()
    const [show, setShow] = useState(false)
    const backRef = useRef()

    useEffect(() => {
        if (message && message.text !== '' && message.title !== '') {
            setShow(true)
        }
    }, [message])

    const close = () => {
        setShow(false)
    }

    const click = (e) => {
        if (e.target === backRef.current) {
            setShow(false)
        }
    }

    return (
        <div ref={backRef} onClick={click} className={`NotificationWrapper ${show ? `show` : ``}`}>
            <div className='Notification'>
                <div className='NotificationTitle'><h1>{message.title}</h1></div>
                <div>{message.text}</div>
                <button className="NotificationButton" onClick={close}>ОК</button>
            </div>
        </div>
    )
}

export default Notification