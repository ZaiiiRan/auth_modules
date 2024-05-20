/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import './NewPostDialog.css'
import PostService from '../../services/PostService'
import useAuth from '../../hooks/useAuth'

export default function NewPostDialog({setCreateDialogShow, createDialogShow, setIsUpdated}) {
    const [data, setData] = useState({
        title: '',
        body: ''
    })
    const titleRef = useRef()
    const bodyRef = useRef()
    const store = useAuth()

    const create = async (e) => {
        e.preventDefault()
        let error = false
        if (data.title === '') {
            titleRef.current.className = "inputForm error"
            error = true
        } else {
            titleRef.current.className = "inputForm"
        }
        if (data.body === '') {
            bodyRef.current.className = "textarea error"
            error = true
        } else {
            bodyRef.current.className = "textarea"
        }
        
        if (!error) {
            setData({
                title: '',
                body: ''
            })
            await PostService.createPost(data.title, data.body, store.user.id)
            setCreateDialogShow(false)
            setIsUpdated(true)
        }
    }

    const cancel = (e) => {
        e.preventDefault()
        setData({
            title: '',
            body: ''
        })
        setCreateDialogShow(false)
    }

    return (
        <div className={`${createDialogShow ? 'dialogWrapper show' :  'dialogWrapper'}`}>
            <form className="form">
            <div className="flexTitle">
                <h1>Новый пост </h1>
            </div>
            <div className="flexColumn">
                <label>Заголовок </label>
            </div>
            <div ref={titleRef} className="inputForm">
            <svg  height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M4 8H20M4 16H12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>        
                <input type="text" className="input" placeholder="Заголовок" 
                    value={data.title} onChange={(e) => { setData({...data, title: e.target.value}) }}/>
            </div>
            <div className="flexColumn">
                <label>Текст </label>
            </div>
            <textarea ref={bodyRef} className="textarea" value={data.body} onChange={(e) => { setData({...data, body: e.target.value}) }}></textarea>
            <div className="buttons">
                <button className="buttonSubmit" onClick={create}>Опубликовать</button>
                <button className="buttonSubmit" onClick={cancel}>Отмена</button>
            </div>
        </form>
        </div>
    )
}