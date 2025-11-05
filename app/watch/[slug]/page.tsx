"use client"

export const runtime = "edge"

import { useEffect, useState } from "react"
import { siteConfig } from "@/config/site"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR from "swr"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"
import { VideoPlayer } from "@/components/video-player"
import { useWatchHistory } from "@/hooks/use-watch-history"
import { WatchHistory } from "@/components/watch-history"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function WatchPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { data, error, isLoading } = useSWR(`/api/v1/episode/${slug}`, fetcher)
  const { history } = useWatchHistory()
  const [animeImage, setAnimeImage] = useState<string>("")

  const episode = data?.data

  useEffect(() => {
    if (episode && episode.anime?.slug) {
      fetch(`/api/v1/anime/${episode.anime.slug}`)
        .then((res) => res.json())
        .then((response) => {
          if (response.data?.poster) {
            setAnimeImage(response.data.poster)
          }
        })
        .catch(() => {})
    }
  }, [episode])

  const currentHistory = history.find((h) => h.slug === slug)

  useEffect(() => {
    if (!episode || !slug) return

    const saveToHistory = () => {
      const STORAGE_KEY = "anime-watch-history"
      const MAX_HISTORY_ITEMS = 1000

      const stored = localStorage.getItem(STORAGE_KEY)
      let historyList: any[] = []

      try {
        if (stored) {
          historyList = JSON.parse(stored)
        }
      } catch (e) {
      }

      const filtered = historyList.filter((h) => h.slug !== slug)
      const newHistoryItem = {
        slug,
        episodeTitle: episode.episode || "",
        animeSlug: episode.anime?.slug || "",
        animeTitle: episode.anime?.title || "",
        animeImage: animeImage || "",
        timestamp: Date.now(),
      }

      const newHistory = [newHistoryItem, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    }

    saveToHistory()
  }, [slug, episode, animeImage])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error || !episode ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-xs text-muted-foreground">Failed to load episode</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-2 sm:px-3 py-2">
          <div className="mb-2">
            <h1 className="text-base sm:text-lg font-bold mb-1">{episode.episode}</h1>
            {episode.anime && (
              <Link href={`/anime/${episode.anime.slug}`} className="text-xs text-primary hover:underline">
                Back to anime
              </Link>
            )}
          </div>

          <Card className="mb-3 overflow-hidden">
            <div className="aspect-video bg-black">
              {episode.stream_url ? (
                <VideoPlayer
                  streamUrl={episode.stream_url}
                  streamList={episode.streamList}
                  initialTime={currentHistory?.currentTime}
                  slug={slug}
                  episodeTitle={episode.episode}
                  animeSlug={episode.anime?.slug}
                  animeTitle={episode.anime?.title}
                  animeImage={animeImage}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <p className="text-xs">No stream available</p>
                </div>
              )}
            </div>
          </Card>

          <div className="flex gap-1 mb-3">
            {episode.has_previous_episode && episode.previous_episode && (
              <Link href={`/watch/${episode.previous_episode.slug}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent h-8 text-xs">
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  Prev
                </Button>
              </Link>
            )}
            {episode.has_next_episode && episode.next_episode && (
              <Link href={`/watch/${episode.next_episode.slug}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full bg-transparent h-8 text-xs">
                  Next
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>

          {episode.download_urls &&
            (episode.download_urls.mp4?.length > 0 || episode.download_urls.mkv?.length > 0) && (
              <Card className="p-2 sm:p-3">
                <h2 className="text-xs sm:text-sm font-bold mb-2 flex items-center gap-2">
                  <Download className="w-3 h-3" />
                  Download
                </h2>
                <Tabs defaultValue="mp4">
                  <TabsList className="h-7">
                    {episode.download_urls.mp4?.length > 0 && (
                      <TabsTrigger value="mp4" className="text-xs">
                        MP4
                      </TabsTrigger>
                    )}
                    {episode.download_urls.mkv?.length > 0 && (
                      <TabsTrigger value="mkv" className="text-xs">
                        MKV
                      </TabsTrigger>
                    )}
                  </TabsList>
                  {episode.download_urls.mp4?.length > 0 && (
                    <TabsContent value="mp4" className="space-y-1.5 mt-2">
                      {episode.download_urls.mp4.map((item: any, index: number) => (
                        <div key={index} className="border border-border rounded-lg p-2">
                          <h3 className="text-xs font-semibold mb-1">{item.resolution}</h3>
                          <div className="flex flex-wrap gap-1">
                            {item.urls.map((url: any, urlIndex: number) => (
                              <a key={urlIndex} href={url.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="h-6 text-xs bg-transparent">
                                  {url.provider}
                                </Button>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  )}
                  {episode.download_urls.mkv?.length > 0 && (
                    <TabsContent value="mkv" className="space-y-1.5 mt-2">
                      {episode.download_urls.mkv.map((item: any, index: number) => (
                        <div key={index} className="border border-border rounded-lg p-2">
                          <h3 className="text-xs font-semibold mb-1">{item.resolution}</h3>
                          <div className="flex flex-wrap gap-1">
                            {item.urls.map((url: any, urlIndex: number) => (
                              <a key={urlIndex} href={url.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="h-6 text-xs bg-transparent">
                                  {url.provider}
                                </Button>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  )}
                </Tabs>
              </Card>
            )}
        </div>
      )}

      <footer className="border-t border-border mt-6">
        <div className="max-w-4xl mx-auto px-2 sm:px-3 py-2">
          <div className="text-center text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}