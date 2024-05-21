import PostService from '../../services/PostService'

export async function create(data, store, setData, setDailogShow, setIsUpdated) {
    await PostService.createPost(data.title, data.body, store.user.id)
    setData({
        title: '',
        body: ''
    })
    setDailogShow(false)
    setIsUpdated(true)
}

export async function edit(postID, data, store, setData, setDailogShow, setIsUpdated) {
    await PostService.editPost(data.title, data.body, postID, store.user.id)
    setData({
        title: '',
        body: ''
    })
    setDailogShow(false)
    setIsUpdated(true)
}