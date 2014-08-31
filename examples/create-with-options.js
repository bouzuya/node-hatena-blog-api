var blog = require('../'); // require('hatena-blog-api')

var client = blog({
  type: 'wsse',
  username: process.env.HATENA_USERNAME,
  blogId: process.env.HATENA_BLOG_ID,
  apikey: process.env.HATENA_APIKEY
});

client.create({
  title: 'bouzuya\'s icon',
  file: './bouzuya.png',

  folder: 'bouzuya-icon',
  generator: 'hatena-fotolife-api example'

}, function(err, res) {
  if (err) {
    console.error(err);
  } else {
    console.log('uploaded');
  }
});
