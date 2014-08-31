
throw new Error('not implement yet');

// all (create -> index -> update -> show -> destroy)

var fotolife = require('../'); // require('hatena-fotolife-api')

var client = fotolife({
  type: 'wsse',
  username: process.env.HATENA_USERNAME, // 'username'
  apikey: process.env.HATENA_APIKEY      // 'apikey'
});

var imageId = null;

// POST PostURI (/atom/post)
client.create({
  title: 'bouzuya\'s icon',
  file: './bouzuya.png'
})
.then(function(res) {
  console.log(res);

  // assertion
  console.log(
    'test 1 ' + (res.entry.title._ === 'bouzuya\'s icon' ? 'OK' : 'NG')
  );

  // get image id for `show()`, `update()` and `destroy()`.
  imageId = res.entry.id._.match(/^tag:[^:]+:[^-]+-[^-]+-(\d+)$/)[1];
  console.log(imageId);

  // GET FeedURI (/atom/feed)
  return client.index();
})
.then(function(res) {
  console.log(res);

  // PUT EditURI (/atom/edit/XXXXXXXXXXXXXX)
  return client.update({ id: imageId, title: 'special bouzuya\'s icon' });
})
.then(function() {
  console.log('updated');

  // GET EditURI (/atom/edit/XXXXXXXXXXXXXX)
  return client.show({ id: imageId });
})
.then(function(res) {
  console.log(res);

  // assertion
  console.log(
    'test 2 ' + (res.entry.title._ === 'special bouzuya\'s icon' ? 'OK' : 'NG')
  );

  // DELETE EditURI (/atom/edit/XXXXXXXXXXXXXX)
  return client.destroy({ id: imageId });
})
.then(function() {
  console.log('deleted');
});

// **OUTPUT**
//
// { entry:
//    { '$':
//       { xmlns: 'http://purl.org/atom/ns#',
//         'xmlns:hatena': 'http://www.hatena.ne.jp/info/xmlns#' },
//      title: { _: 'bouzuya\'s icon' },
//      link: [ [Object], [Object] ],
//      issued: { _: '2014-08-22T00:02:16+09:00' },
//      author: { name: [Object] },
//      generator: { _: 'Hatena::Fotolife', '$': [Object] },
//      'dc:subject': { '$': [Object] },
//      id: { _: 'tag:hatena.ne.jp,2005:fotolife-bouzuya-20140822000216' },
//      'hatena:imageurl': { _: 'http://f.st-hatena.com/images/fotolife/b/bouzuya/20140822/20140822000216.png?1408633338' },
//      'hatena:imageurlmedium': { _: 'http://f.st-hatena.com/images/fotolife/b/bouzuya/20140822/20140822000216_120.jpg?1408633338' },
//      'hatena:imageurlsmall': { _: 'http://f.st-hatena.com/images/fotolife/b/bouzuya/20140822/20140822000216_m.jpg?1408633338' },
//      'hatena:syntax': { _: 'f:id:bouzuya:20140822000216p:image' } } }
// test 1 OK
// 20140822000216
// { feed:
//    { '$':
//       { version: '0.3',
//         xmlns: 'http://purl.org/atom/ns#',
//         'xmlns:hatena': 'http://www.hatena.ne.jp/info/xmlns#',
//         'xml:lang': 'ja' },
//      title: { _: 'bouzuya\'s fotolife' },
//      link: [ [Object], [Object] ],
//      modified: { _: '2014-08-22 00:02:18' },
//      author: { name: [Object] },
//      id: { _: 'tag:hatena.ne.jp,2005:fotolife-bouzuya' },
//      generator: { _: 'Hatena::Fotolife', '$': [Object] },
//      entry:
//       [ [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object],
//         [Object] ] } }
// updated
// { entry:
//    { '$':
//       { xmlns: 'http://purl.org/atom/ns#',
//         'xmlns:hatena': 'http://www.hatena.ne.jp/info/xmlns#' },
//      title: { _: 'special bouzuya\'s icon' },
//      link: [ [Object], [Object] ],
//      issued: { _: '2014-08-22T00:02:16+09:00' },
//      author: { name: [Object] },
//      generator: { _: 'Hatena::Fotolife', '$': [Object] },
//      id: { _: 'tag:hatena.ne.jp,2005:fotolife-bouzuya-20140822000216' },
//      'hatena:imageurl': { _: 'http://f.st-hatena.com/images/fotolife/b/bouzuya/20140822/20140822000216.png?1408633340' },
//      'hatena:imageurlmedium': { _: 'http://f.st-hatena.com/images/fotolife/b/bouzuya/20140822/20140822000216_120.jpg?1408633340' },
//      'hatena:imageurlsmall': { _: 'http://f.st-hatena.com/images/fotolife/b/bouzuya/20140822/20140822000216_m.jpg?1408633340' },
//      'hatena:syntax': { _: 'f:id:bouzuya:20140822000216p:image' } } }
// test 2 OK
// deleted
//
