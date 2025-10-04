import Parser from "rss-parser";

export type PodcastItem = {
  id: string;
  title: string;
  link?: string;
  pubDate?: string;
};

const parser = new Parser();

export async function fetchPodcastItems(feedUrl: string): Promise<PodcastItem[]> {
  const feed = await parser.parseURL(feedUrl);
  console.log("feed", feed);
  return (feed.items || []).map((item) => {
    const guid = (item.guid as string | undefined) || (item.link as string | undefined) || item.title || "";
    return {
      id: guid,
      title: item.title || "Untitled",
      link: item.link,
      pubDate: item.pubDate,
    };
  });
}


