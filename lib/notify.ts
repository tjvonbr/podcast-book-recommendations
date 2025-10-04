type Notification = {
  title: string;
  url?: string;
  feedUrl: string;
  publishedAt?: string;
};

function buildSlackPayload(n: Notification) {
  const text = n.url ? `${n.title} — ${n.url}` : n.title;
  return { text };
}

export async function notifyNewEpisode(n: Notification): Promise<void> {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) {
    console.log("[notify]", n);
    return;
  }

  const payload = buildSlackPayload(n);
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Slack webhook failed: ${res.status} ${res.statusText} ${body}`);
  }
}


