# hatena-blog-api

Hatena::Blog AtomPub API wrapper for Node.js (unofficial)

## Installation

    $ npm install hatena-blog-api

## Usage

See [`examples/`](examples/).

### Coding style (Callback/Promise)

#### Callback style

```javascript
var blog = require('hatena-blog-api');

var client = blog({
  type: 'wsse',
  username: 'username',
  blogId: 'blogId',
  apikey: 'apikey'
});
var options = { title: 'bouzuya\'s entry', content: 'fun is justice!' };

client.create(options, function(err) {
  if (err) {
    console.error(err);
  } else {
    console.log('uploaded');
  }
});
```

#### Promise style

```javascript
var blog = /* ... */;
var client = /* ... */;
var options = /* ... */;

client.create(options).then(function() {
  console.log('uploaded');
}, function(err) {
  console.error(err);
});
```

### Configuration (WSSE/OAuth)

#### WSSE

See ["How to use Hatena WSSE"](http://developer.hatena.ne.jp/ja/documents/auth/apis/wsse).

- username ... Your username.
- blogId ... Your blod id.
- apikey ... See [AtomPub API key](http://blog.hatena.ne.jp/my/config/detail).

#### OAuth

See ["How to use Hatena OAuth"](http://developer.hatena.ne.jp/ja/documents/auth/apis/oauth).

Application scope is "read_private" and "write_private".

```javascript
var blog = require('hatena-blog-api');

var client = blog({
  type: 'oauth',
  blogId: 'blogId',
  consumerKey: 'consumerKey',
  consumerSecret: 'consumerSecret',
  accessToken: 'accessToken',
  accessTokenSecret: 'accessTokenSecret'
});

// ...
```

## API Docs

See [Hatena::Blog AtomPub API](http://developer.hatena.ne.jp/ja/documents/blog/apis/atom), [`test/`](test/) and [`examples/`](examples/).

## Development

`npm run`

## License

[MIT](LICENSE)

## Author

[bouzuya][user] &lt;[m@bouzuya.net][mail]&gt; ([http://bouzuya.net][url])

## Badges

[![Build Status][travis-badge]][travis]
[![Dependencies status][david-dm-badge]][david-dm]
[![Coverage Status][coveralls-badge]][coveralls]

[travis]: https://travis-ci.org/bouzuya/node-hatena-blog-api
[travis-badge]: https://travis-ci.org/bouzuya/node-hatena-blog-api.svg?branch=master
[david-dm]: https://david-dm.org/bouzuya/node-hatena-blog-api
[david-dm-badge]: https://david-dm.org/bouzuya/node-hatena-blog-api.png
[coveralls]: https://coveralls.io/r/bouzuya/node-hatena-blog-api
[coveralls-badge]: https://img.shields.io/coveralls/bouzuya/node-hatena-blog-api.svg
[user]: https://github.com/bouzuya
[mail]: mailto:m@bouzuya.net
[url]: http://bouzuya.net
