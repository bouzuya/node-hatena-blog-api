// all (create -> index -> update -> show -> destroy)

var blog = require('../'); // require('hatena-blog-api')

var client = blog({
  type: 'wsse',
  username: process.env.HATENA_USERNAME,
  blogId: process.env.HATENA_BLOG_ID,
  apiKey: process.env.HATENA_APIKEY
});

var entryId = null;

// POST CollectionURI (/<username>/<blog_id>/atom/entry)
client.create({
  title: 'bouzuya\'s entry',
  content: 'fun is justice!',
  draft: true
}).then(function(res) {
  console.log(res);

  // assertion
  console.log(
    'test 1 ' + (res.entry.title._ === 'bouzuya\'s entry' ? 'OK' : 'NG')
  );

  // get image id for `show()`, `update()` and `destroy()`.
  entryId = res.entry.id._.match(/^tag:[^:]+:[^-]+-[^-]+-\d+-(\d+)$/)[1];
  console.log(entryId);

  // GET CollectionURI (/<username>/<blog_id>/atom/entry)
  return client.index();
})
.then(function(res) {
  console.log(res);

  // PUT MemberURI (/<username>/<blog_id>/atom/entry/<entry_id>)
  return client.update({
    id: entryId,
    title: 'special bouzuya\'s entry',
    content: 'fun is justice!!',
    draft: true
  });
})
.then(function() {
  console.log('updated');

  // GET MemberURI (/<username>/<blog_id>/atom/entry/<entry_id>)
  return client.show({ id: entryId });
})
.then(function(res) {
  console.log(res);

  // assertion
  console.log(
    'test 2 ' + (res.entry.title._ === 'special bouzuya\'s entry' ? 'OK' : 'NG')
  );

  // DELETE MemberURI (/<username>/<blog_id>/atom/entry/<entry_id>)
  return client.destroy({ id: entryId });
})
.then(function() {
  console.log('deleted');
});

// **OUTPUT**
//
// { entry:
//    { '$':
//       { xmlns: 'http://www.w3.org/2005/Atom',
//         'xmlns:app': 'http://www.w3.org/2007/app' },
//      id: { _: 'tag:blog.hatena.ne.jp,2013:blog-bouzuya-12704346814673856423-12921228815731812899' },
//      link: [ [Object], [Object] ],
//      author: { name: [Object] },
//      title: { _: 'bouzuya\'s entry' },
//      updated: { _: '2014-09-01T23:18:18+09:00' },
//      published: { _: '2014-09-01T23:18:18+09:00' },
//      'app:edited': { _: '2014-09-01T23:18:18+09:00' },
//      summary: { _: 'fun is justice!', '$': [Object] },
//      content: { _: 'fun is justice!', '$': [Object] },
//      'hatena:formatted-content': { _: '<p>fun is justice!</p>\n', '$': [Object] },
//      'app:control': { 'app:draft': [Object] } } }
// test 1 OK
// 12921228815731812899
// { feed:
//    { '$':
//       { xmlns: 'http://www.w3.org/2005/Atom',
//         'xmlns:app': 'http://www.w3.org/2007/app' },
//      link: [ [Object], [Object], [Object] ],
//      title: { _: '15 min/d' },
//      subtitle: { _: 'http://blog.bouzuya.net/ のミラーですよ。' },
//      updated: { _: '2014-09-01T23:00:17+09:00' },
//      author: { name: [Object] },
//      generator: { _: 'Hatena::Blog', '$': [Object] },
//      id: { _: 'hatenablog://blog/12704346814673856423' },
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
//         [Object] ] } }
// updated
// { entry:
//    { '$':
//       { xmlns: 'http://www.w3.org/2005/Atom',
//         'xmlns:app': 'http://www.w3.org/2007/app' },
//      id: { _: 'tag:blog.hatena.ne.jp,2013:blog-bouzuya-12704346814673856423-12921228815731812899' },
//      link: [ [Object], [Object] ],
//      author: { name: [Object] },
//      title: { _: 'special bouzuya\'s entry' },
//      updated: { _: '2014-09-01T23:18:30+09:00' },
//      published: { _: '2014-09-01T23:18:18+09:00' },
//      'app:edited': { _: '2014-09-01T23:18:30+09:00' },
//      summary: { _: 'fun is justice!!', '$': [Object] },
//      content: { _: 'fun is justice!!', '$': [Object] },
//      'hatena:formatted-content': { _: '<p>fun is justice!!</p>\n', '$': [Object] },
//      'app:control': { 'app:draft': [Object] } } }
// test 2 OK
// deleted
//
