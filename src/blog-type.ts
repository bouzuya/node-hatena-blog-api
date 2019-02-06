interface Blog {
  authorName: string;
  entries: BlogEntry[];
  generator: string;
  id: string;
  nextPage: number | null;
  title: string;
  updated: string;
}

interface BlogEntry {
  authorName: string;
  content: string;
  contentType: BlogEntryContentType;
  draft: boolean;
  editUrl: string;
  edited: string;
  formattedContent: string;
  htmlUrl: string;
  id: string;
  published: string;
  summary: string;
  title: string;
  updated: string;
}

type BlogEntryContentType
  = 'text/html'
  | 'text/x-hatena-syntax'
  | 'text/x-markdown';

interface BlogEntryParams {
  content: string;
  contentType: BlogEntryContentType;
  draft?: boolean;
  title: string;
  updated?: string;
  categories?: string[];
}

export {
  Blog,
  BlogEntry,
  BlogEntryContentType,
  BlogEntryParams
};
