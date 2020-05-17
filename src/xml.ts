import * as xml from "@bouzuya/xml";
import { Document, Element, Node } from "@bouzuya/xml";
import { BlogEntry, BlogEntryContentType, BlogEntryParams } from "./blog-type";

// workaround for node.js esm behavior
const { create, createDeclaration, createElement } = xml;

const isElement = (i: Node): i is Element => typeof i !== "string";

const isText = (i: Node): i is string =>
  typeof i === "string" && i.trim().length > 0;

const getUnprefixedName = (prefixedName: string): string => {
  const prefixAndLocalPart = prefixedName.split(":");
  return prefixAndLocalPart[prefixAndLocalPart.length - 1];
};

// names: ['a', 'b'] ... /a/b
const getElementByTagNames = (
  element: Element,
  names: string[]
): Element | null => {
  return names.reduce((e, name) => {
    if (e === null) return e;
    const found = e.children.find((i): i is Element => {
      return isElement(i) && getUnprefixedName(i.name) === name;
    });
    return typeof found === "undefined" ? null : found;
  }, element as Element | null);
};

const getText = (element: Element): string | null => {
  if (element.children.length === 0) return null;
  if (element.children.some((i) => !isText(i))) return null;
  return element.children
    .filter((i): i is string => isText(i))
    .reduce((a, i) => a + i, "");
};

const getElementTextByTagNames = (
  element: Element,
  names: string[]
): string => {
  const e = getElementByTagNames(element, names);
  if (e === null) throw new Error(`no ${names.join("/")}`);
  const text = getText(e);
  if (text === null) throw new Error(`invalid ${names.join("/")}`);
  return text;
};

const getElementsByTagName = (element: Element, tagName: string): Element[] => {
  return element.children.reduce((elements, node) => {
    return isElement(node)
      ? elements
          .concat(getUnprefixedName(node.name) === tagName ? [node] : [])
          .concat(getElementsByTagName(node, tagName))
      : elements;
  }, [] as Element[]);
};

const getEntry = (entry: Element): BlogEntry => {
  const elements = entry.children.filter(isElement);

  const authorName = getElementTextByTagNames(entry, ["author", "name"]);

  const categories = getElementsByTagName(entry, "category").map(
    (category) => category.attributes.term
  );

  const contentElement = getElementByTagNames(entry, ["content"]);
  if (contentElement === null) throw new Error("no content");
  if (
    contentElement.children.length === 0 ||
    (contentElement.attributes.type !== "text/html" &&
      contentElement.attributes.type !== "text/x-hatena-syntax" &&
      contentElement.attributes.type !== "text/x-markdown")
  )
    throw new Error("invalid content");
  const content = getText(contentElement);
  if (content === null) throw new Error("no content text");
  const contentType = contentElement.attributes.type as BlogEntryContentType;

  const draft = getElementTextByTagNames(entry, ["control", "draft"]) === "yes";

  const editUrlElement = elements.find((i) => {
    return (
      getUnprefixedName(i.name) === "link" &&
      i.attributes.rel === "edit" &&
      typeof i.attributes.href !== "undefined"
    );
  });
  if (typeof editUrlElement === "undefined") throw new Error("no edit url");
  const editUrl = editUrlElement.attributes.href;

  const edited = getElementTextByTagNames(entry, ["edited"]);
  const formattedContent = getElementTextByTagNames(entry, [
    "formatted-content",
  ]);

  const htmlUrlElement = elements.find((i) => {
    return (
      getUnprefixedName(i.name) === "link" &&
      i.attributes.rel === "alternate" &&
      i.attributes.type === "text/html" &&
      typeof i.attributes.href !== "undefined"
    );
  });
  if (typeof htmlUrlElement === "undefined") throw new Error("no html url");
  const htmlUrl = htmlUrlElement.attributes.href;

  const id = getElementTextByTagNames(entry, ["id"]);
  const published = getElementTextByTagNames(entry, ["published"]);
  const summary = getElementTextByTagNames(entry, ["summary"]);
  const title = getElementTextByTagNames(entry, ["title"]);
  const updated = getElementTextByTagNames(entry, ["updated"]);

  return {
    authorName,
    categories,
    content,
    contentType,
    draft,
    editUrl,
    edited,
    formattedContent,
    htmlUrl,
    id,
    published,
    summary,
    title,
    updated,
  };
};

const getEntries = (element: Element): BlogEntry[] => {
  return getElementsByTagName(element, "entry").map((entry) => getEntry(entry));
};

const toXml = (i: BlogEntryParams): Document => {
  const { categories, content, contentType, draft, title, updated } = i;
  const h = createElement;
  return create(
    createDeclaration("1.0", "UTF-8"),
    h(
      "entry",
      {
        xmlns: "http://www.w3.org/2005/Atom",
        "xmlns:app": "http://www.w3.org/2007/app",
      },
      [h("title", {}, [title]), h("content", { contentType }, [content])]
        .concat(
          typeof updated === "undefined" ? [] : [h("updated", {}, [updated])]
        )
        .concat(
          typeof categories === "undefined"
            ? []
            : categories.map((term) => h("category", { term }, []))
        )
        .concat(
          typeof draft === "undefined"
            ? []
            : h("app:control", {}, [h("app:draft", {}, [draft ? "yes" : "no"])])
        )
    )
  );
};

export { getEntries, getEntry, toXml };
