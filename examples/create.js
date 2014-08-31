var blog = require('../'); // require('hatena-blog-api')

var client = blog({
  type: 'wsse',
  username: process.env.HATENA_USERNAME, // 'username'
  blogId: process.env.HATENA_BLOG_ID,    // 'blog id'
  apikey: process.env.HATENA_APIKEY      // 'apikey'
});

// POST CollectionURI (/<username>/<blog_id>/atom/entry)
client.create({
  title: 'bouzuya\'s entry',
  content: 'fun is justice!'
}, function(err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log('uploaded');
  }
});
