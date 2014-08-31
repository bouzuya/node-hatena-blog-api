var blog = require('../'); // require('hatena-blog-api')

var client = blog({
  type: 'wsse',
  username: process.env.HATENA_USERNAME,
  blogId: process.env.HATENA_BLOG_ID,
  apikey: process.env.HATENA_APIKEY
});

client.create({
  title: 'bouzuya\'s entry',
  content: 'fun is justice!',

  updated: '2014-08-31T12:34:56+09:00',
  categories: ['hatena'],
  draft: true
}, function(err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log('uploaded');
  }
});
