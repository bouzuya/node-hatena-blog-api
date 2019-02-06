// const h = createElement;
// const example = create(
//   createDeclaration('1.0', 'UTF-8'),
//   createElement(
//     'entry',
//     {
//       xmlns: 'http://www.w3.org/2005/Atom'
//     },
//     [
//       h('title', {}, ['TITLE'])
//     ]
//   )
// );
// console.log(format(example));

// const isNullOrUndefined = <T>(v: T | null | undefined): v is T =>
//   typeof v === 'undefined' || v === null;

// interface Entry {
//   categories: string[];
//   content: string;
//   draft?: boolean;
//   title: string;
//   updated?: string;
// }

// const postEntry = (entry: Entry): Promise<void> => {
//   const root = h(
//     'entry',
//     {
//       'xmlns': 'http://www.w3.org/2005/Atom',
//       'xmlns:app': 'http://www.w3.org/2007/app'
//     },
//     [
//       h('title', {}, [title]),
//       h('content', { type: 'text/plain' }, [content])
//     ].concat(
//       categories.map((category) => h('category', { term: category }, []))
//     ).concat(
//       typeof draft === 'undefined'
//         ? []
//         : [h('app:control', {}, [h('app:draft', {}, [draft ? 'yes' : 'no'])])]
//     ).concat(
//       typeof updated === 'undefined'
//         ? []
//         : [h('updated', {}, [updated])]
//     ));
//   return request({ method, path, body: build(root) });
// };

// const categories = [] as string[];
// const content = 'CONTENT';
// const draft = true as boolean | undefined;
// const title = 'TITLE';
// const updated = void 0 as string | undefined;

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
