{Promise} = require 'q'
fs = require 'fs'
oauth = require 'oauth'
request = require 'request'
wsse = require 'wsse'
xml2js = require 'xml2js'

# Hatena::Blog AtomPub API wrapper
#
# - GET    CollectionURI       (/<username>/<blog_id>/atom/entry)
#   => Blog#index
# - POST   CollectionURI       (/<username>/<blog_id>/atom/entry)
#   => Blog#create
# - GET    MemberURI           (/<username>/<blog_id>/atom/entry/<entry_id>)
#   => Blog#show
# - PUT    MemberURI           (/<username>/<blog_id>/atom/entry/<entry_id>)
#   => Blog#update
# - DELETE MemberURI           (/<username>/<blog_id>/atom/entry/<entry_id>)
#   => Blog#destroy
# - GET    ServiceDocumentURI  (/<username>/<blog_id>/atom)
#   => None
# - GET    CategoryDocumentURI (/<username>/<blog_id>/atom/category)
#   => None
class Blog

  # constructor
  # params:
  #   options: (required)
  #   - type     : authentication type. default `'wsse'`
  #   - username : user name. (required)
  #   - blogId   : blog id. (required)
  #   (type 'wsse')
  #   - apikey   : wsse authentication apikey. (required)
  #   (type 'oauth')
  #   - consumerKey       : oauth consumer key. (required)
  #   - consumerSecret    : oauth consumer secret. (required)
  #   - accessToken       : oauth access token. (required)
  #   - accessTokenSecret : oauth access token secret. (required)
  constructor: ({
    type
    username
    userName
    blogid
    blogId
    apikey
    apiKey
    consumerkey
    consumerKey
    consumersecret
    consumerSecret
    accesstoken
    accessToken
    accesstokensecret
    accessTokenSecret
  }) ->
    @_type = type ? 'wsse'
    @_username = userName ? username
    @_blogId = blogId ? blogid
    @_apiKey = apiKey ? apikey
    @_consumerKey = consumerKey ? consumerkey
    @_consumerSecret = consumerSecret ? consumersecret
    @_accessToken = accessToken ? accesstoken
    @_accessTokenSecret = accessTokenSecret ? accesstokensecret
    @_baseUrl = 'https://blog.hatena.ne.jp'

  # POST CollectionURI (/<username>/<blog_id>/atom/entry)
  # params:
  #   options: (required)
  #   - title      : 'title'. entry title.default `''`.
  #   - content    : 'content'. entry content. default `''`.
  #   - updated    : 'updated'. default `undefined`
  #   - categories : 'category' '@term'. default `undefined`.
  #   - draft      : 'app:control' > 'app:draft'. default `undefined`.
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  create: ({ title, content, updated, categories, draft }, callback) ->
    title = title ? ''
    content = content ? ''
    method = 'post'
    path = "/#{@_username}/#{@_blogId}/atom/entry"
    body = entry:
      $:
        xmlns: 'http://www.w3.org/2005/Atom'
        'xmlns:app': 'http://www.w3.org/2007/app'
      title:
        _: title
      content:
        $:
          type: 'text/plain'
        _: content
    body.entry.updated = _: updated if updated?
    body.entry.category = categories.map((c) -> $: { term: c }) if categories?
    body.entry['app:control'] = { 'app:draft': { _: 'yes' } } if draft ? false
    statusCode = 201
    @_request { method, path, body, statusCode }, callback


  # PUT MemberURI (/<username>/<blog_id>/atom/entry/<entry_id>)
  # params:
  #   options: (required)
  #   - id         : entry id. (required)
  #   - title      : 'title'. entry title. default `undefined`.
  #   - content    : 'content'. entry content. (required).
  #   - updated    : 'updated'. default `undefined`
  #   - categories : 'category' '@term'. default `undefined`.
  #   - draft      : 'app:control' > 'app:draft'. default `undefined`.
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  update: ({ id, title, content, updated, categories, draft }, callback) ->
    return @_reject('options.id is required', callback) unless id?
    return @_reject('options.content is required', callback) unless content?
    method = 'put'
    path = "/#{@_username}/#{@_blogId}/atom/entry/#{id}"
    body = entry:
      $:
        xmlns: 'http://www.w3.org/2005/Atom'
        'xmlns:app': 'http://www.w3.org/2007/app'
      content:
        $:
          type: 'text/plain'
        _: content
    body.entry.title = _: title if title?
    body.entry.updated = _: updated if updated?
    body.entry.category = categories.map((c) -> $: { term: c }) if categories?
    body.entry['app:control'] = { 'app:draft': { _: 'yes' } } if draft ? false
    statusCode = 200
    @_request { method, path, body, statusCode }, callback

  # DELETE MemberURI (/<username>/<blog_id>/atom/entry/<entry_id>)
  # params:
  #   options: (required)
  #   - id: entry id. (required)
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  destroy: ({ id }, callback) ->
    return @_reject('options.id is required', callback) unless id?
    method = 'delete'
    path = "/#{@_username}/#{@_blogId}/atom/entry/#{id}"
    statusCode = 200
    @_request { method, path, statusCode }, callback

  # GET MemberURI (/<username>/<blog_id>/atom/entry/<entry_id>)
  # params:
  #   options: (required)
  #   - id: entry id. (required)
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  show: ({ id }, callback) ->
    return @_reject('options.id is required', callback) unless id?
    method = 'get'
    path = "/#{@_username}/#{@_blogId}/atom/entry/#{id}"
    statusCode = 200
    @_request { method, path, statusCode }, callback

  # GET CollectionURI (/<username>/<blog_id>/atom/entry)
  # params:
  #   options:
  #   - pageId: page id.
  #   callback:
  #   - err: error
  #   - res: response
  # returns:
  #   Promise
  index: (options, callback) ->
    method = 'get'
    unless callback?
      callback = options
      options = null
    pageId = options?.pageId
    pathWithoutQuery = "/#{@_username}/#{@_blogId}/atom/entry"
    query = (if pageId? then "?page=#{pageId}" else '')
    path = pathWithoutQuery + query
    statusCode = 200
    @_request { method, path, statusCode }, callback

  _reject: (message, callback) ->
    try
      e = new Error(message)
      callback(e) if callback?
      Promise.reject(e)
    catch
      Promise.reject(e)

  _request: ({ method, path, body, statusCode }, callback) ->
    callback = callback ? (->)
    params = {}
    params.method = method
    params.url = @_baseUrl + path
    if @_type is 'oauth'
      params.oauth =
        consumer_key: @_consumerKey
        consumer_secret: @_consumerSecret
        token: @_accessToken
        token_secret: @_accessTokenSecret
    else # @_type is 'wsse'
      token = wsse().getUsernameToken @_username, @_apiKey, nonceBase64: true
      params.headers =
        'Authorization': 'WSSE profile="UsernameToken"'
        'X-WSSE': 'UsernameToken ' + token
    promise = if body? then @_toXml(body) else Promise.resolve(null)
    promise
      .then (body) =>
        params.body = body if body?
        @_requestPromise params
      .then (res) =>
        if res.statusCode isnt statusCode
          throw new Error("HTTP status code is #{res.statusCode}")
        @_toJson res.body
      .then (json) ->
        callback(null, json)
        json
      .then null, (err) ->
        callback(err)
        throw err

  _requestPromise: (params) ->
    new Promise (resolve, reject) =>
      @_rawRequest params, (err, res) ->
        if err?
          reject err
        else
          resolve res

  _toJson: (xml) ->
    new Promise (resolve, reject) ->
      parser = new xml2js.Parser explicitArray: false, explicitCharkey: true
      parser.parseString xml, (err, result) ->
        if err?
          reject err
        else
          resolve result

  _toXml: (json) ->
    builder = new xml2js.Builder()
    try
      xml = builder.buildObject json
      Promise.resolve xml
    catch e
      Promise.reject e

  _rawRequest: request

module.exports = Blog
