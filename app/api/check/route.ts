import { NextResponse } from "next/server";
import { fetchPodcastItems } from "@/lib/rss";
import { getLastSeenId, setLastSeenId } from "@/lib/storage";
import { notifyNewEpisode } from "@/lib/notify";

function getFeedUrlFromEnvOrSearchParams(request: Request): string {
  const { searchParams } = new URL(request.url);
  const fromQuery = searchParams.get("feed");
  // Hard code Founder's Podcast for now
  const fromEnv = "https://feeds.simplecast.com/3hnxp7yk"
  const feedUrl = fromQuery || fromEnv || "";
  if (!feedUrl) {
    throw new Error("Missing feed URL. Provide FEED_URL env or ?feed=...");
  }
  return feedUrl;
}

export async function GET(request: Request) {
  try {
    const feedUrl = getFeedUrlFromEnvOrSearchParams(request);
    const items = await fetchPodcastItems(feedUrl);
    if (items.length === 0) {
      return NextResponse.json({ ok: true, newCount: 0, message: "No items in feed" });
    }

    // Most feeds are newest-first already
    const latestId = items[0].id;
    const lastSeenId = await getLastSeenId(feedUrl);

    if (!lastSeenId) {
      await setLastSeenId(feedUrl, latestId);
      return NextResponse.json({ ok: true, newCount: 0, message: "Initialized last seen" });
    }

    // Collect new items until we hit lastSeenId
    const newItems = [] as typeof items;
    for (const item of items) {
      if (item.id === lastSeenId) break;
      newItems.push(item);
    }

    if (newItems.length === 0) {
      return NextResponse.json({ ok: true, newCount: 0, message: "No new episodes" });
    }

    // Notify oldest-first so notifications read chronologically
    for (const item of newItems.reverse()) {
      await notifyNewEpisode({
        title: item.title,
        url: item.link,
        feedUrl,
        publishedAt: item.pubDate,
      });
    }

    await setLastSeenId(feedUrl, latestId);
    return NextResponse.json({ ok: true, newCount: newItems.length });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}


