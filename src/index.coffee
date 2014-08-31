Blog = require './blog'

module.exports = (options) ->
  new Blog(options)

module.exports.Blog = Blog
