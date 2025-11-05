"use client"

export const runtime = 'edge';
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import useSWR from "swr"
import Image from "next/image"
import Link from "next/link"
import { Play, Calendar, Clock, Star } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AnimeDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { data, error, isLoading } = useSWR(`/api/v1/anime/${slug}`, fetcher)

  const anime = data?.data

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error || !anime ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Failed to load anime details</p>
        </div>
      ) : (
        <>

          <div className="relative h-[40vh] overflow-hidden">
            <Image
              src={anime.poster || "/placeholder.png"}
              alt={anime.title || "Anime"}
              fill
              className="object-cover blur-sm scale-110"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={anime.poster || "/placeholder.png"}
                    alt={anime.title || "Anime"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-balance mb-4">{anime.title}</h1>
                  {anime.japanese_title && <p className="text-lg text-muted-foreground mb-4">{anime.japanese_title}</p>}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {anime.genres?.map((genre: { name?: string; slug?: string }) => (
                      <Link key={genre.slug} href={`/genres/${genre.slug}`}>
                        <Badge variant="secondary">{genre.name}</Badge>
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {anime.status && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Status:</span>
                        <span>{anime.status}</span>
                      </div>
                    )}
                    {anime.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span>{anime.rating}</span>
                      </div>
                    )}
                    {anime.episode_count && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Episodes:</span>
                        <span>{anime.episode_count}</span>
                      </div>
                    )}
                    {anime.duration && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{anime.duration}</span>
                      </div>
                    )}
                    {anime.release_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{anime.release_date}</span>
                      </div>
                    )}
                    {anime.studio && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Studio:</span>
                        <span>{anime.studio}</span>
                      </div>
                    )}
                    {anime.type && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Type:</span>
                        <span>{anime.type}</span>
                      </div>
                    )}
                  </div>
                </div>

                {anime.synopsis && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
                    <p className="text-muted-foreground leading-relaxed">{anime.synopsis}</p>
                  </div>
                )}
              </div>
            </div>

            {anime.episode_lists && anime.episode_lists.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Episodes</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {anime.episode_lists.map((episode: any) => (
                    <Link key={episode.slug} href={`/watch/${episode.slug}`}>
                      <Card className="p-4 hover:bg-accent transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between">
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {episode.episode || "Episode"}
                          </span>
                          <Play className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {anime.recommendations && anime.recommendations.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Recommendations</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {anime.recommendations.map((rec: any, index: number) => (
                    <Link key={rec.slug || index} href={`/anime/${rec.slug}`}>
                      <Card className="overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer group">
                        <div className="relative aspect-[2/3]">
                          <Image
                            src={rec.poster || "/placeholder.png"}
                            alt={rec.title || "Anime"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {rec.title}
                          </h3>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-border mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-sm text-muted-foreground">
                <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
