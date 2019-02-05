// https://tools.ietf.org/html/rfc4287#section-4.2.2
interface Category { // atom:category
  label?: string; // atom:category@label
  scheme?: string; // atom:category@scheme
  term: string; // atom:category@term
}

export {
  Category
};
