const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const blogsRouter = require('./controllers/blogs')
const Blog = require('./models/blog')
const usersRouter = require('./controllers/users')
const User = require('./models/user')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(express.json())
app.use('/api/login', loginRouter)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app
