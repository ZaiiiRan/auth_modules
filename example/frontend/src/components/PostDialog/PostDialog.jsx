/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react'
import './PostDialog.css'
import { create, edit } from './PostEventHandlers'
import useAuth from '../../hooks/useAuth'

export default function PostDialog({setDialogShow, dialogShow, setIsUpdated, createMode, postData}) {
    const [data, setData] = useState({
        title: '',
        body: ''
    })
    const backRef = useRef() 
    const titleRef = useRef()
    const bodyRef = useRef()
    const store = useAuth()

    useEffect(() => {
        if (!createMode && dialogShow) {
            setData({
                title: postData.title,
                body: postData.body
            })
        }
    }, [dialogShow])

    const validate = () => {
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

        return error
    }

    const submit = (e) => {
        e.preventDefault()
        const err = validate()
        if (!err) {
            if (createMode) create(data, store, setData, setDialogShow, setIsUpdated)
            else {
                if (data.title === postData.title && data.body === postData.body) {
                    setDialogShow(false)
                    return
                } else edit(postData._id, data, store, setData, setDialogShow, setIsUpdated)
            } 
        } else return
    }

    const cancel = (e) => {
        e.preventDefault()
        setData({
            title: '',
            body: ''
        })
        setDialogShow(false)
    }

    const click = (e) => {
        if (e.target === backRef.current) {
            setDialogShow(false)
        }
    }

    return (
        <div ref={backRef} onClick={click} className={`${dialogShow ? 'dialogWrapper show' :  'dialogWrapper'}`}>
            <form className="form">
            <div className="flexTitle">
                <h1>{createMode ? 'Новый пост' : 'Редактирование'} </h1>
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
                <button className="buttonSubmit" onClick={submit}>
                    {createMode ? 'Опубликовать' : 'Сохранить'}
                </button>
                <button className="buttonSubmit" onClick={cancel}>Отмена</button>
            </div>
        </form>
        </div>
    )
}