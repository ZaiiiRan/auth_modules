import PostService from '../../services/PostService'

import { triggerNotification } from '../../hoc/NotificationProvider'

export async function create(data, store, setData, setDailogShow, setIsUpdated) {
    try {
        await PostService.createPost(data.title, data.body, store.user.id)
        setData({
            title: '',
            body: ''
        })
        setDailogShow(false)
        setIsUpdated(prev => !prev)

        triggerNotification('Успех', 'Пост успешно создан')
    } catch (e) {
        triggerNotification('Ошибка', `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`)
    }
}

export async function edit(postID, data, store, setData, setDailogShow, setIsUpdated) {
    try {
        await PostService.editPost(data.title, data.body, postID, store.user.id)
        setData({
            title: '',
            body: ''
        })
        setDailogShow(false)
        setIsUpdated(prev => !prev)

        triggerNotification('Успех', 'Пост успешно изменен')
    } catch (e) {
        triggerNotification('Ошибка', `${e.response.data ? e.response.data.message : 'Что-то пошло не так'}`)
    }
}