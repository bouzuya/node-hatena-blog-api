assert = require 'power-assert'
path = require 'path'
sinon = require 'sinon'

Blog = require '../src/blog'

describe 'blog', ->
  beforeEach ->
    @sinon = sinon.sandbox.create()

  afterEach ->
    @sinon.restore()

  describe 'constructor', ->
    describe 'use wsse', ->
      describe 'lowercase', ->
        beforeEach ->
          @blog = new Blog
            username: 'username'
            blogid: 'blog id'
            apikey: 'api key'

        it 'works', ->
          assert @blog._type is 'wsse'
          assert @blog._username is 'username'
          assert @blog._apiKey is 'api key'
          assert @blog._blogId is 'blog id'

      describe 'camelcase', ->
        beforeEach ->
          @blog = new Blog
            userName: 'username'
            apiKey: 'api key'
            blogId: 'blog id'

        it 'works', ->
          assert @blog._type is 'wsse'
          assert @blog._username is 'username'
          assert @blog._apiKey is 'api key'
          assert @blog._blogId is 'blog id'

    describe 'use oauth', ->
      describe 'lowercase', ->
        beforeEach ->
          @blog = new Blog
            type: 'oauth'
            blogid: 'blog id'
            consumerkey: 'consumer key'
            consumersecret: 'consumer secret'
            accesstoken: 'access token'
            accesstokensecret: 'access token secret'

        it 'works', ->
          assert @blog._type is 'oauth'
          assert @blog._blogId is 'blog id'
          assert @blog._consumerKey is 'consumer key'
          assert @blog._consumerSecret is 'consumer secret'
          assert @blog._accessToken is 'access token'
          assert @blog._accessTokenSecret is 'access token secret'

      describe 'camelcase', ->
        beforeEach ->
          @blog = new Blog
            type: 'oauth'
            blogId: 'blog id'
            consumerKey: 'consumerKey'
            consumerSecret: 'consumerSecret'
            accessToken: 'accessToken'
            accessTokenSecret: 'accessTokenSecret'

        it 'works', ->
          assert @blog._type is 'oauth'
          assert @blog._blogId is 'blog id'
          assert @blog._consumerKey is 'consumerKey'
          assert @blog._consumerSecret is 'consumerSecret'
          assert @blog._accessToken is 'accessToken'
          assert @blog._accessTokenSecret is 'accessTokenSecret'

  describe 'create', ->
    beforeEach ->
      @request = @sinon.stub Blog.prototype, '_request', -> null
      @blog = new Blog
        type: 'wsse'
        username: 'username'
        blogId: 'example.hatenablog.com'
        apikey: 'apikey'

    describe 'default options', ->
      it 'works', ->
        @blog.create {}, -> null
        args = @request.firstCall.args[0]
        assert args.method is 'post'
        assert args.path is '/username/example.hatenablog.com/atom/entry'
        assert args.body.entry.title._ is ''
        assert args.body.entry.content._ is ''
        assert args.body.entry.updated is undefined
        assert args.body.entry.category is undefined
        assert args.body.entry['app:control'] is undefined

    describe 'all options', ->
      it 'works', ->
        @blog.create
          title: 'TITLE'
          content: 'CONTENT'
          updated: '2014-08-31T12:34:56Z'
          categories: ['hatena', 'blog', 'api']
          draft: true
        , -> null
        args = @request.firstCall.args[0]
        assert args.method is 'post'
        assert args.path is '/username/example.hatenablog.com/atom/entry'
        assert args.body.entry.title._ is 'TITLE'
        assert args.body.entry.content._ is 'CONTENT'
        assert args.body.entry.updated._ is '2014-08-31T12:34:56Z'
        assert args.body.entry.category[0].$.term is 'hatena'
        assert args.body.entry.category[1].$.term is 'blog'
        assert args.body.entry.category[2].$.term is 'api'
        assert args.body.entry['app:control']['app:draft']._ is 'yes'

  describe.skip 'update', ->
    beforeEach ->
      @request = @sinon.stub Blog.prototype, '_request', -> null
      @blog = new Blog
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no id options', ->
      it 'calls callback with error', (done) ->
        @blog.update {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'no title options', ->
      it 'calls callback with error', (done) ->
        @blog.update { id: 123 }, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'all options', ->
      it 'works', ->
        @blog.update { id: 123, title: 'TITLE' }, -> null
        assert @request.firstCall.args[0].method is 'put'
        assert @request.firstCall.args[0].path is '/atom/edit/123'
        body = @request.firstCall.args[0].body
        assert body.entry.title._ is 'TITLE'

  describe.skip 'destroy', ->
    beforeEach ->
      @request = @sinon.stub Blog.prototype, '_request', -> null
      @blog = new Blog
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no id options', ->
      it 'calls callback with error', (done) ->
        @blog.destroy {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'all options', ->
      it 'works', ->
        @blog.destroy { id: 123 }, -> null
        assert @request.firstCall.args[0].method is 'delete'
        assert @request.firstCall.args[0].path is '/atom/edit/123'

  describe.skip 'show', ->
    beforeEach ->
      @request = @sinon.stub Blog.prototype, '_request', -> null
      @blog = new Blog
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'no id options', ->
      it 'calls callback with error', (done) ->
        @blog.show {}, (e) =>
          assert @request.callCount is 0
          assert e instanceof Error
          done()

    describe 'all options', ->
      it 'works', ->
        @blog.show { id: 123 }, -> null
        assert @request.firstCall.args[0].method is 'get'
        assert @request.firstCall.args[0].path is '/atom/edit/123'

  describe.skip 'index', ->
    beforeEach ->
      @request = @sinon.stub Blog.prototype, '_request', -> null
      @blog = new Blog
        type: 'wsse'
        username: 'username'
        apikey: 'apikey'

    describe 'all options', ->
      it 'works', ->
        @blog.index {}, -> null
        assert @request.firstCall.args[0].method is 'get'
        assert @request.firstCall.args[0].path is '/atom/feed'

    describe 'callback only', ->
      it 'works', ->
        @blog.index -> null
        assert @request.firstCall.args[0].method is 'get'
        assert @request.firstCall.args[0].path is '/atom/feed'

  describe.skip '_request', ->
    describe 'request succeed', ->
      beforeEach ->
        @request = @sinon.stub Blog.prototype, '_requestPromise', ->
          then: (onFulFilled) -> onFulFilled(body: '', statusCode: 200)

      describe 'wsse auth', ->
        beforeEach ->
          @blog = new Blog
            type: 'wsse'
            username: 'username'
            apikey: 'apikey'

        describe 'callback style', ->
          it 'works', (done) ->
            @blog._request {
              method: 'METHOD',
              path: 'PATH',
              body:
                feed:
                  _: 'test'
              statusCode: 200
            }, (err, res) =>
              try
                args = @request.firstCall.args
                assert args[0].method is 'METHOD'
                assert args[0].url is 'http://f.hatena.ne.jpPATH'
                assert args[0].headers.Authorization?
                assert args[0].headers['X-WSSE']?
              catch e
                done(e)
              done(err)

        describe 'promise style', ->
          describe 'normal case', ->
            it 'works', (done) ->
              @blog._request {
                method: 'METHOD'
                path: 'PATH'
                statusCode: 200
              }
                .then =>
                  args = @request.firstCall.args
                  assert args[0].method is 'METHOD'
                  assert args[0].url is 'http://f.hatena.ne.jpPATH'
                  assert args[0].headers.Authorization?
                  assert args[0].headers['X-WSSE']?
                .then (-> done()), done

          describe 'invalid status code', ->
            it 'works', (done) ->
              @blog._request {
                method: 'METHOD'
                path: 'PATH'
                statusCode: 201
              }
                .then null, (e) ->
                  assert e instanceof Error
                .then (-> done()), done

      describe 'oauth auth', ->
        beforeEach ->
          @blog = new Blog
            type: 'oauth'
            consumerKey: 'CONSUMER_KEY'
            consumerSecret: 'CONSUMER_SECRET'
            accessToken: 'ACCESS_TOKEN'
            accessTokenSecret: 'ACCESS_TOKEN_SECRET'

        describe 'callback style', ->
          it 'works', (done) ->
            @blog._request {
              method: 'METHOD'
              path: 'PATH'
              statusCode: 200
            }, (err, res) =>
              args = @request.firstCall.args
              assert args[0].method is 'METHOD'
              assert args[0].url is 'http://f.hatena.ne.jpPATH'
              assert args[0].oauth.consumer_key is 'CONSUMER_KEY'
              assert args[0].oauth.consumer_secret is 'CONSUMER_SECRET'
              assert args[0].oauth.token is 'ACCESS_TOKEN'
              assert args[0].oauth.token_secret is 'ACCESS_TOKEN_SECRET'
              done(err)

        describe 'promise style', ->
          it 'works', (done) ->
            @blog._request {
              method: 'METHOD'
              path: 'PATH'
              statusCode: 200
            }
              .then =>
                args = @request.firstCall.args
                assert args[0].method is 'METHOD'
                assert args[0].url is 'http://f.hatena.ne.jpPATH'
                assert args[0].oauth.consumer_key is 'CONSUMER_KEY'
                assert args[0].oauth.consumer_secret is 'CONSUMER_SECRET'
                assert args[0].oauth.token is 'ACCESS_TOKEN'
                assert args[0].oauth.token_secret is 'ACCESS_TOKEN_SECRET'
              .then (-> done()), done

    describe 'request failure', ->
      beforeEach ->
        @request = @sinon.stub Blog.prototype, '_requestPromise', ->
          then: (_, onError) -> onError(new Error())

      describe 'wsse auth', ->
        beforeEach ->
          @blog = new Blog
            type: 'wsse'
            username: 'username'
            apikey: 'apikey'

        describe 'callback style', ->
          it 'works', (done) ->
            @blog._request { method: 'METHOD', path: 'PATH' }, (err) ->
              assert err instanceof Error
              done()

        describe 'promise style', ->
          it 'works', (done) ->
            @blog._request(method: 'METHOD', path: 'PATH')
              .then null, (e) ->
                assert e instanceof Error
              .then (-> done()), done

      describe 'oauth auth', ->
        beforeEach ->
          @blog = new Blog
            type: 'oauth'
            consumerKey: 'CONSUMER_KEY'
            consumerSecret: 'CONSUMER_SECRET'
            accessToken: 'ACCESS_TOKEN'
            accessTokenSecret: 'ACCESS_TOKEN_SECRET'

        describe 'callback style', ->
          it 'works', (done) ->
            @blog._request { method: 'METHOD', path: 'PATH' }, (err) ->
              assert err instanceof Error
              done()

        describe 'promise style', ->
          it 'works', (done) ->
            @blog._request(method: 'METHOD', path: 'PATH')
              .then null, (e) ->
                assert e instanceof Error
              .then (-> done()), done

  describe '_requestPromise', ->
    describe 'request succeed', ->
      it 'works', (done) ->
        params = { a: 'a', b: 1 }
        @request = @sinon.stub Blog.prototype, '_rawRequest', (_, cb) ->
          cb(null)
        promise = Blog.prototype._requestPromise params
        promise.then (-> done()), done

    describe 'request failure', ->
      it 'works', (done) ->
        params = { a: 'a', b: 1 }
        @request = @sinon.stub Blog.prototype, '_rawRequest', (_, cb) ->
          cb(new Error())
        promise = Blog.prototype._requestPromise params
        promise
          .then null, (e) ->
            assert e instanceof Error
          .then (-> done()), done

  describe '_toJson / _toXml', ->
    describe 'invalid elements', ->
      describe '_toJson', ->
        it 'works', (done) ->
          Blog.prototype._toJson '<>'
            .then null, (e) ->
              assert e instanceof Error
            .then (-> done()), done

      describe '_toXml', ->
        it 'works', (done) ->
          Blog.prototype._toXml 1
            .then null, (e) ->
              assert e instanceof Error
            .then (-> done()), done

    describe 'single elements', ->
      beforeEach ->
        @xml = '''
          <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <entry xmlns="http://purl.org/atom/ns#">
            <title>&lt;TITLE</title>
            <content mode="base64" type="&quot;TYPE">&lt;ENCODED</content>
          </entry>
        '''
        @json =
          entry:
            $:
              xmlns: 'http://purl.org/atom/ns#'
            title:
              _: '<TITLE'
            content:
              $:
                mode: 'base64'
                type: '"TYPE'
              _: '<ENCODED'

      describe '_toJson', ->
        it 'works', (done) ->
          Blog.prototype._toJson @xml
            .then (json) =>
              assert.deepEqual json, @json
            .then (-> done()), done

      describe '_toXml', ->
        it 'works', (done) ->
          Blog.prototype._toXml @json
            .then (xml) =>
              assert xml is @xml
            .then (-> done()), done

    describe 'multiple elements', ->
      beforeEach ->
        @xml = '''
          <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
          <entry xmlns="http://purl.org/atom/ns#">
            <title attr="ATTR1">&lt;TITLE1</title>
            <title attr="ATTR2">&lt;TITLE2</title>
          </entry>
        '''
        @json =
          entry:
            $:
              xmlns: 'http://purl.org/atom/ns#'
            title:
              [
                $:
                  attr: 'ATTR1'
                _: '<TITLE1'
              ,
                $:
                  attr: 'ATTR2'
                _: '<TITLE2'
              ]

      describe '_toJson', ->
        it 'works', (done) ->
          Blog.prototype._toJson @xml
            .then (json) =>
              assert.deepEqual json, @json
            .then (-> done()), done

      describe '_toXml', ->
        it 'works', (done) ->
          Blog.prototype._toXml @json
            .then (xml) =>
              assert xml is @xml
            .then (-> done()), done
