"use client"

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover } from "@/components/ui/popover";

type SpotifyImage = { url: string; width?: number; height?: number };

type Artist = { id: string; name: string; images?: SpotifyImage[] };
type Album = { id: string; name: string; images?: SpotifyImage[]; artists?: Artist[] };
type Track = { id: string; name: string; album?: Album; artists?: Artist[] };
type Show = { id: string; name: string; publisher?: string; images?: SpotifyImage[]; description?: string };

export type SearchPayload = {
  artists?: { items?: Artist[] };
  albums?: { items?: Album[] };
  tracks?: { items?: Track[] };
  shows?: { items?: Show[] };
};

function getImageUrl(images?: SpotifyImage[]): string | undefined {
  if (!images || images.length === 0) return undefined;
  // choose the medium-sized image if possible
  const sorted = [...images].sort((a, b) => (a.width || 0) - (b.width || 0));
  return sorted[Math.floor(sorted.length / 2)]?.url || sorted[0]?.url;
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

export default function SearchResults({ data }: { data: SearchPayload | null }) {
  const normalized = useMemo(() => data || {}, [data]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl">
      <Section<Show>
        title="Shows"
        items={normalized.shows?.items}
        render={(show) => (
          <>
            <CardTitle>{show.name}</CardTitle>
            <CardDescription>{show.publisher || "Show"}</CardDescription>
            <CardContent>
              {getImageUrl(show.images) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getImageUrl(show.images)} alt={show.name} className="w-full h-40 object-cover rounded-md" />
              ) : (
                <div className="text-sm text-black/60 dark:text-white/60">No image</div>
              )}
            </CardContent>
          </>
        )}
      />
      <Section<Artist>
        title="Artists"
        items={normalized.artists?.items}
        render={(artist) => (
          <>
            <CardTitle>{artist.name}</CardTitle>
            <CardDescription>Artist</CardDescription>
            <CardContent>
              {getImageUrl(artist.images) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getImageUrl(artist.images)} alt={artist.name} className="w-full h-40 object-cover rounded-md" />
              ) : (
                <div className="text-sm text-black/60 dark:text-white/60">No image</div>
              )}
            </CardContent>
          </>
        )}
      />

      <Section<Album>
        title="Albums"
        items={normalized.albums?.items}
        render={(album) => (
          <>
            <CardTitle>{album.name}</CardTitle>
            <CardDescription>{album.artists?.map((a) => a.name).join(", ")}</CardDescription>
            <CardContent>
              {getImageUrl(album.images) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getImageUrl(album.images)} alt={album.name} className="w-full h-40 object-cover rounded-md" />
              ) : (
                <div className="text-sm text-black/60 dark:text-white/60">No image</div>
              )}
            </CardContent>
          </>
        )}
      />

      <Section<Track>
        title="Tracks"
        items={normalized.tracks?.items}
        render={(track) => (
          <>
            <CardTitle>{track.name}</CardTitle>
            <CardDescription>{track.artists?.map((a) => a.name).join(", ")}</CardDescription>
            <CardContent>
              {getImageUrl(track.album?.images) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getImageUrl(track.album?.images)} alt={track.name} className="w-full h-40 object-cover rounded-md" />
              ) : (
                <div className="text-sm text-black/60 dark:text-white/60">No image</div>
              )}
            </CardContent>
          </>
        )}
      />
    </div>
  );
}


