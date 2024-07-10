const Router = require('express').Router
const postMiddleware = require('./postMiddleware')
const authMiddleware = require('../authAPI/middleware/authMiddleware')
const controller = require('./controller')

const APIRouter = new Router()

APIRouter.post('/posts', controller.getPosts)
APIRouter.post('/create-post', postMiddleware, controller.createPost)
APIRouter.post('/edit-post', postMiddleware, controller.editPost)
APIRouter.post('/delete-post', postMiddleware, controller.deletePost)


module.exports = APIRouter