const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('a blog can be added ', async () => {
    const newBlog = {
        title: 'new title',
        author: 'axel',
        url: 'www.fi',
        likes: 6,
    }

    const blogs = await Blog.find({})

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAfter = await Blog.find({})
    expect(blogsAfter.length).toBe(blogs.length + 1)
    const lastTitle = blogsAfter[blogsAfter.length - 1].title
    expect(lastTitle).toContain('new title')
})

afterAll(() => {
    mongoose.connection.close()
})
