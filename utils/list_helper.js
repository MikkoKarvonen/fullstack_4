const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.reduce((a, b) => a + b.likes, 0)
    return likes
}

const favoriteBlog = (blogs) => {
    const best = blogs.reduce(function (prev, current) {
        return prev.likes > current.likes ? prev : current
    })
    const val = {
        title: best.title,
        author: best.author,
        likes: best.likes,
    }
    return val
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}
