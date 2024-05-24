import api from '../api/postAPI'

export default class PostService {
    static fetchPosts(offset, limit) {
        return api.post('/posts', { limit: limit, offset: offset })
    }

    static createPost(title, body, userID ) {
        return api.post('/create-post', { title: title, body: body, userID: userID })
    }

    static editPost(title, body, postID, userID) {
        return api.post('/edit-post', {title: title, body: body, postID: postID, userID: userID})
    }

    static deletePost(postID, userID) {
        return api.post('/delete-post', { postID: postID, userID: userID })
    }
}