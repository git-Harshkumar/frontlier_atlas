import { XMLParser } from "fast-xml-parser";
import { formatDistanceToNow } from "date-fns";

export const getRedditTrending = async () => {
  const response = await fetch(
    "https://www.reddit.com/r/LocalLLaMA/hot.rss",
    {
      headers: {
        "User-Agent": "FrontierAtlas",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Reddit RSS");
  }

  const xml = await response.text();

  const parser = new XMLParser({
    ignoreAttributes: false,
  });

  const data = parser.parse(xml);

  const entries = data.feed.entry.slice(0, 5);
  console.log(entries[0]);
  return entries.map((post: any) => ({
  platform: "reddit",
  source: "r/LocalLLaMA",
  time: formatDistanceToNow(new Date(post.updated), {
  addSuffix: true,
}),
  title: post.title,
  likes: "-",
  comments: "-",
   url: post.link["@_href"],  
}));
};