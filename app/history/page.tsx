"use client"

import { useWatchHistory } from "@/hooks/use-watch-history"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Trash2, ArrowLeft } from "lucide-react"

export default function HistoryPage() {
  const { history, removeFromHistory, clearHistory } = useWatchHistory()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-2 sm:px-3 py-3">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 text-xs bg-transparent">
              <ArrowLeft className="w-3 h-3 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-bold">Watch History</h1>
          {history.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearHistory} className="ml-auto h-8 text-xs bg-transparent">
              Clear All
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <Card className="p-4 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground">No watch history yet. Start watching anime to see it here!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {history.map((item) => (
              <Card key={item.slug} className="overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                <Link href={`/watch/${item.slug}`} className="block">
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    {item.animeImage && (
                      <Image
                        src={item.animeImage || "/placeholder.png"}
                        alt={item.animeTitle || "Anime"}
                        fill
                        className="object-cover"
                      />
                    )}
                    {item.currentTime && item.duration && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
                        <div
                          className="h-full bg-primary"
                          style={{
                            width: `${(item.currentTime / item.duration) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-2">
                  <h3 className="text-xs sm:text-sm font-medium line-clamp-1">{item.episodeTitle}</h3>
                  {item.animeTitle && <p className="text-xs text-muted-foreground line-clamp-1">{item.animeTitle}</p>}
                  <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                    <span>{formatDate(item.timestamp)}</span>
                    {item.currentTime && item.duration && (
                      <span>
                        {formatTime(item.currentTime)} / {formatTime(item.duration)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      removeFromHistory(item.slug)
                    }}
                    className="w-full mt-2 h-7 text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-border mt-8">
        <div className="max-w-4xl mx-auto px-2 sm:px-3 py-2">
          <div className="text-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} AnimeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
