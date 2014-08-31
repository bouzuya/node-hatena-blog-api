var blog = require('../'); // require('hatena-blog-api')

var client = blog({
  type: 'oauth',
  username: process.env.HATENA_USERNAME,
  blogId: process.env.HATENA_BLOG_ID,
  consumerKey: process.env.HATENA_CONSUMER_KEY,
  consumerSecret: process.env.HATENA_CONSUMER_SECRET,
  accessToken: process.env.HATENA_ACCESS_TOKEN,
  accessTokenSecret: process.env.HATENA_ACCESS_TOKEN_SECRET
});

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
