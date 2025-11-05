"use client"

import { siteConfig } from "@/config/site"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AnimeGrid } from "@/components/anime-grid"
import { useWatchHistory } from "@/hooks/use-watch-history"
import useSWR from "swr"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HomePage() {
  const { data: homeData, error, isLoading } = useSWR("/api/v1/home", fetcher)
  const { history } = useWatchHistory()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount)
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isLoading ? (
        <div className="h-[35vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="h-[35vh] flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Failed to load anime data</p>
        </div>
      ) : (
        <HeroSection featured={homeData?.data?.ongoing_anime?.slice(0, 5) || []} />
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-3 py-6 space-y-8">
        {!isLoading && history.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-bold">Continue Watching</h2>
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => scroll("left")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => scroll("right")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Link href="/history">
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative group">
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(var(--primary), 0.2) transparent",
                }}
              >
                {history.slice(0, 10).map((item) => (
                  <Link key={item.slug} href={`/watch/${item.slug}`}>
                    <Card className="flex-shrink-0 w-[280px] sm:w-[320px] overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer snap-start">
                      <div className="relative aspect-video bg-muted">
                        {item.animeImage && (
                          <Image
                            src={item.animeImage || "/placeholder.png"}
                            alt={item.animeTitle || "Anime"}
                            fill
                            className="object-cover"
                          />
                        )}
                        {item.currentTime && item.duration && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${(item.currentTime / item.duration) * 100}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium line-clamp-1">{item.episodeTitle}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {item.animeTitle}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {!isLoading && homeData?.data?.ongoing_anime && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-bold">Ongoing Anime</h2>
              <Link href="/ongoing">
                <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                  View All
                </Button>
              </Link>
            </div>
            <AnimeGrid items={homeData.data.ongoing_anime.slice(0, 12)} />
          </section>
        )}

        {!isLoading && homeData?.data?.complete_anime && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base sm:text-lg font-bold">Complete Anime</h2>
              <Link href="/complete">
                <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
                  View All
                </Button>
              </Link>
            </div>
            <AnimeGrid items={homeData.data.complete_anime.slice(0, 12)} />
          </section>
        )}
      </div>

      <footer className="border-t border-border mt-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 py-2">
          <div className="text-center text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <p className="text-xs mt-1">Watch your favorite anime series online</p>
          </div>
        </div>
      </footer>
    </div>
  )
}