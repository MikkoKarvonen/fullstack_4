const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs.map((b) => b.toJSON()))
})

blogsRouter.get('/:id', (request, response) => {
    Blog.findById(request.params.id).then((blog) => {
        if (blog) {
            response.json(blog.toJSON())
        } else {
            response.status(404).end()
        }
    })
})

blogsRouter.post('/', async (request, response, next) => {
    const body = new Blog(request.body)
    const token = getTokenFrom(request)

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes == undefined ? 0 : body.likes,
        user: user._id,
    })

    const save = await blog.save()
    user.blogs = user.blogs.concat(save._id)
    await user.save()

    response.json(save.toJSON())
})

blogsRouter.delete('/:id', (request, response) => {
    Blog.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

module.exports = blogsRouter
