import { Client } from "../src/client";

// tslint:disable:no-console
const main = async (): Promise<void> => {
  const apiKey = process.env.API_KEY;
  if (typeof apiKey === "undefined") throw new Error("API_KEY");
  const blogId = process.env.BLOG_ID;
  if (typeof blogId === "undefined") throw new Error("BLOG_ID");
  const hatenaId = process.env.HATENA_ID;
  if (typeof hatenaId === "undefined") throw new Error("HATENA_ID");

  const client = new Client({
    apiKey,
    authType: "basic",
    blogId,
    hatenaId,
  });
  const entries = await client.list();
  console.log("listed");
  console.log(entries);

  const created = await client.create({
    categories: ["category1"],
    content: [
      "[link](http://example.com)",
      "",
      "- item 1",
      "- item 2",
      "- item 3",
    ].join("\n"),
    contentType: "text/x-markdown",
    draft: true,
    title: "test",
    updated: "2019-02-07T12:00:00+09:00",
  });
  console.log("created");
  console.log(created);

  const retrieved = await client.retrieve(created.editUrl);
  console.log("retrieved");
  console.log(retrieved);

  await client.delete(created.editUrl);
  console.log("deleted");
};

export { main };
