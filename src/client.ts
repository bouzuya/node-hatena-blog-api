import { Node } from '@bouzuya/xml';
import request from 'request';
import { promisify } from 'util';
import wsse from 'wsse';
import {
  Request,
  deleteMember,
  getCollection,
  getMember,
  getService,
  postCollection,
  putMember
} from './atom-pub';
import { BlogEntry, BlogEntryParams } from './blog-type';
import { getEntries, getEntry, toXml } from './xml';

type Credentials = BasicAuthCredentials | OAuthCredentials | WSSECredentials;

interface BasicAuthCredentials {
  apiKey: string;
  authType: 'basic';
  hatenaId: string;
}

interface OAuthCredentials {
  authType: 'oauth';
  consumerKey: string;
  consumerSecret: string;
  token: string;
  tokenSecret: string;
}

interface WSSECredentials {
  apiKey: string;
  authType: 'wsse';
  hatenaId: string;
}

// TODO
// const getCategoryUri = (hatenaId: string, blogId: string): string => {
//   return `https://blog.hatena.ne.jp/${hatenaId}/${blogId}/atom/category`;
// };

const getServiceDocumentUri = (hatenaId: string, blogId: string): string => {
  return `https://blog.hatena.ne.jp/${hatenaId}/${blogId}/atom`;
};

const getUnprefixedName = (prefixedName: string): string => {
  const prefixAndLocalPart = prefixedName.split(':');
  return prefixAndLocalPart[prefixAndLocalPart.length - 1];
};

const getCollectionUri = async (
  authorized: Request,
  serviceDocumentUri: string
): Promise<string | null> => {
  const xml = await getService(
    authorized,
    serviceDocumentUri
  );
  // //collection@href
  const f = (node: Node): string | null => {
    if (typeof node === 'string') return null;
    const { attributes, children, name } = node;
    return getUnprefixedName(name) === 'collection'
      ? attributes.href
      : children.reduce((a: string | null, i) => a !== null ? a : f(i), null);
  };
  return f(xml.rootElement);
};

class Client {
  private _blogId: string;
  private _credentials: Credentials;
  private _hatenaId: string;
  private _collectionUri: string | null;

  constructor(params: Credentials & { blogId: string; hatenaId: string; }) {
    this._credentials = params;
    this._blogId = params.blogId;
    this._hatenaId = params.hatenaId;
    this._collectionUri = null;
  }

  public async create(entryParams: BlogEntryParams): Promise<BlogEntry> {
    const collectionUri = await this._ensureCollectionUri();
    const requestXml = toXml(entryParams);
    const responseXml = await postCollection(
      authorizedRequest(this._credentials),
      collectionUri,
      requestXml
    );
    return getEntry(responseXml.rootElement);
  }

  public async delete(memberUrl: BlogEntry['editUrl']): Promise<void> {
    await deleteMember(
      authorizedRequest(this._credentials),
      memberUrl
    );
  }

  public async edit(
    memberUrl: BlogEntry['editUrl'],
    entryParams: BlogEntryParams
  ): Promise<BlogEntry> {
    const requestXml = toXml(entryParams);
    const responseXml = await putMember(
      authorizedRequest(this._credentials),
      memberUrl,
      requestXml
    );
    return getEntry(responseXml.rootElement);
  }

  public async list(page?: string): Promise<BlogEntry[]> {
    const collectionUri = await this._ensureCollectionUri();
    const responseXml = await getCollection(
      authorizedRequest(this._credentials),
      collectionUri + (typeof page === 'undefined' ? '' : '?page=' + page)
    );
    return getEntries(responseXml.rootElement);
  }

  public async retrieve(memberUrl: BlogEntry['editUrl']): Promise<BlogEntry> {
    const responseXml = await getMember(
      authorizedRequest(this._credentials),
      memberUrl
    );
    return getEntry(responseXml.rootElement);
  }

  private async _ensureCollectionUri(): Promise<string> {
    const oldCollectionUri = this._collectionUri;
    if (oldCollectionUri !== null) return oldCollectionUri; // use cache
    const serviceDocumentUri =
      getServiceDocumentUri(this._hatenaId, this._blogId);
    const newCollectionUri = await getCollectionUri(
      authorizedRequest(this._credentials),
      serviceDocumentUri
    );
    if (newCollectionUri === null) throw new Error('no collection uri');
    this._collectionUri = newCollectionUri;
    return newCollectionUri;
  }
}

const promisedRequest = promisify(request) as (
  p: request.UrlOptions & request.CoreOptions
) => Promise<request.Response>;

const authorizedRequest: ((auth: Credentials) => Request) = (
  credentials: Credentials
) => {
  return async ({ method, body, url }) => {
    const response = await promisedRequest({
      ...(
        credentials.authType === 'basic'
          ? {
            auth: {
              password: credentials.apiKey,
              username: credentials.hatenaId
            }
          }
          : credentials.authType === 'oauth'
            ? {
              oauth: {
                consumer_key: credentials.consumerKey,
                consumer_secret: credentials.consumerSecret,
                token: credentials.token,
                token_secret: credentials.tokenSecret
              }
            }
            : credentials.authType === 'wsse'
              ? {
                headers: {
                  'Authorization': 'WSSE profile="UsernameToken"',
                  'X-WSSE': wsse({
                    password: credentials.apiKey,
                    username: credentials.hatenaId
                  }).getWSSEHeader({ nonceBase64: true })
                }
              }
              : {}
      ),
      body,
      method,
      url
    });
    return response;
  };
};

export { Client };
