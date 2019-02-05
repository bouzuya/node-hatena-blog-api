import { Category } from './atom-type';

// https://tools.ietf.org/html/rfc5023#section-8.3.1
interface Service { // app:service
  workspace: Workspace[]; // .length >= 1
}

// https://tools.ietf.org/html/rfc5023#section-8.3.2
interface Workspace { // app:workspace
  collection: Collection[]; // .length >= 0
  title: string; // atom:title
}

// https://tools.ietf.org/html/rfc5023#section-8.3.3
interface Collection { // app:collection
  accept: string[]; // app:accept .length >= 0
  categories: Categories;
  href: string; // app:collection@href
  title: string; // atom:title
}

// https://tools.ietf.org/html/rfc5023#section-7.2.1
type Categories = InlineCategories | OutOfLineCategories;

interface InlineCategories { // app:categories
  category: Category[]; // atom:category .length >= 0
  fixed?: boolean; // app:categories@fixed
  scheme?: string; // app:categories@scheme
}

interface OutOfLineCategories { // app:categories
  href: string; // app:categories@href
}

export {
  Categories,
  Collection,
  Service,
  Workspace
};
