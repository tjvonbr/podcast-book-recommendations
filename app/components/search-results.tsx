"use client"

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover } from "@/components/ui/popover";

export type ItunesPodcast = {
  collectionId?: number
  trackId?: number
  artistName?: string
  collectionName?: string
  trackName?: string
  collectionViewUrl?: string
  trackViewUrl?: string
  feedUrl?: string
  artworkUrl600?: string
  artworkUrl100?: string
  artworkUrl60?: string
  releaseDate?: string
  primaryGenreName?: string
  trackCount?: number
  country?: string
}

export type ItunesSearchResponse = {
  resultCount?: number
  results?: ItunesPodcast[]
}

function getArtworkUrl(p: ItunesPodcast): string | undefined {
  return p.artworkUrl600 || p.artworkUrl100 || p.artworkUrl60
}

function Section<T>({ title, items, render }: { title: string; items?: T[]; render: (item: T) => React.ReactNode }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <Popover
            key={idx}
            trigger={
              <Card>
                <CardHeader>
                  {render(item)}
                </CardHeader>
              </Card>
            }
          >
            <pre className="whitespace-pre-wrap break-words text-xs leading-5 max-h-80 overflow-auto">
{JSON.stringify(item, null, 2)}
            </pre>
          </Popover>
        ))}
      </div>
    </div>
  );
}

export default function SearchResults({ data }: { data: ItunesSearchResponse | null }) {
  const normalized = useMemo(() => data || {}, [data]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl">
      <Section<ItunesPodcast>
        title="Podcasts"
        items={normalized.results}
        render={(pod) => (
          <>
            <CardTitle>{pod.collectionName || pod.trackName}</CardTitle>
            <CardDescription>{pod.artistName || pod.primaryGenreName || "Podcast"}</CardDescription>
            <CardContent>
              {getArtworkUrl(pod) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getArtworkUrl(pod)} alt={pod.collectionName || pod.trackName || "Podcast artwork"} className="w-full h-40 object-cover rounded-md" />
              ) : (
                <div className="text-sm text-black/60 dark:text-white/60">No image</div>
              )}
              <div className="mt-3 text-xs text-black/70 dark:text-white/70">
                {pod.primaryGenreName ? <span className="mr-2">{pod.primaryGenreName}</span> : null}
                {pod.trackCount ? <span className="mr-2">{pod.trackCount} episodes</span> : null}
                {pod.country ? <span className="mr-2">{pod.country}</span> : null}
              </div>
            </CardContent>
          </>
        )}
      />
    </div>
  );
}


