import PostService from '../../services/PostService'

export async function create(data, store, setData, setDailogShow, setIsUpdated) {
    try {
        await PostService.createPost(data.title, data.body, store.user.id)
        setData({
            title: '',
            body: ''
        })
        setDailogShow(false)
        setIsUpdated(prev => !prev)
    } catch {
        alert('Ошибка связи с сервером')
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
    } catch {
        alert('Ошибка связи с сервером')
    }
}