var blog = require('../'); // require('hatena-blog-api')

var client = blog({
  type: 'wsse',
  username: process.env.HATENA_USERNAME,
  blogId: process.env.HATENA_BLOG_ID,
  apikey: process.env.HATENA_APIKEY
});

client.create({
  title: 'bouzuya\'s entry',
  content: 'fun is justice!'
}).then(function(res) {
  console.log('uploaded');
}, function(err) {
  console.error(err);
});
