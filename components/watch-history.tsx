"use client"

import { useWatchHistory } from "@/hooks/use-watch-history"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Clock, Trash2, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

export function WatchHistory() {
  const { history, removeFromHistory, clearHistory } = useWatchHistory()
  const [isOpen, setIsOpen] = useState(false)

  if (history.length === 0) return null

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
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-2 right-2 z-50 bg-background/95 backdrop-blur h-8 text-xs"
      >
        <Clock className="w-3 h-3 mr-1" />
        History ({history.length})
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div
            className="fixed right-0 top-0 h-full w-full max-w-xs bg-background border-l border-border overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 border-b border-border">
              <h2 className="text-sm font-bold">History</h2>
              <div className="flex gap-1">
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory} className="text-xs h-7">
                    Clear
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-7 w-7 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {history.map((item) => (
                <Card key={item.slug} className="p-2 hover:bg-muted/50 transition-colors">
                  <Link href={`/watch/${item.slug}`} className="flex gap-2" onClick={() => setIsOpen(false)}>
                    {item.animeImage ? (
                      <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                        <Image
                          src={item.animeImage || "/placeholder.png"}
                          alt={item.animeTitle || "Anime"}
                          width={48}
                          height={64}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.png"
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden bg-muted" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-medium line-clamp-1">{item.episodeTitle}</h3>
                      {item.animeTitle && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.animeTitle}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <span>{formatDate(item.timestamp)}</span>
                        {item.currentTime && item.duration && (
                          <>
                            <span>•</span>
                            <span>
                              {formatTime(item.currentTime)} / {formatTime(item.duration)}
                            </span>
                          </>
                        )}
                      </div>
                      {item.currentTime && item.duration && (
                        <div className="mt-1 h-0.5 bg-muted rounded-full overflow-hidden">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromHistory(item.slug)}
                    className="shrink-0 h-6 w-6 p-0 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
