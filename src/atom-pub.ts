import * as xml from "@bouzuya/xml";
import { Document } from "@bouzuya/xml";

// workaround for node.js esm behavior
const { format, parse } = xml;

type Request = (params: {
  body?: string;
  method: "DELETE" | "GET" | "POST" | "PUT";
  url: string;
}) => Promise<{ body: string }>;

const deleteMember = async (
  request: Request,
  memberUri: string
): Promise<void> => {
  await request({
    method: "DELETE",
    url: memberUri,
  });
};

const getCollection = async (
  request: Request,
  collectionUri: string
): Promise<Document> => {
  // TODO: Document -> Atom Feed
  const response = await request({
    method: "GET",
    url: collectionUri,
  });
  return parse(response.body);
};

const getMember = async (
  request: Request,
  memberUri: string
): Promise<Document> => {
  // TODO: Document -> Atom Entry
  const response = await request({
    method: "GET",
    url: memberUri,
  });
  return parse(response.body);
};

const getService = async (
  request: Request,
  serviceDocumentUri: string
): Promise<Document> => {
  // TODO: Document -> Service
  const response = await request({
    method: "GET",
    url: serviceDocumentUri,
  });
  return parse(response.body);
};

const postCollection = async (
  request: Request,
  collectionUri: string,
  requestXml: Document // TODO: Document -> Atom Entry
): Promise<Document> => {
  // TODO: Document -> Atom Entry
  const response = await request({
    body: format(requestXml),
    method: "POST",
    url: collectionUri,
  });
  return parse(response.body);
};

const putMember = async (
  request: Request,
  memberUri: string,
  requestXml: Document // TODO: Document -> Atom Entry
): Promise<Document> => {
  // TODO: Document -> Atom Entry
  const response = await request({
    body: format(requestXml),
    method: "PUT",
    url: memberUri,
  });
  return parse(response.body);
};

export {
  Request,
  deleteMember,
  getCollection,
  getMember,
  getService,
  postCollection,
  putMember,
};
