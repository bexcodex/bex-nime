"use client"

import { useState } from "react"
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar"
import { AnimeGrid } from "@/components/anime-grid"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { ChevronLeft, ChevronRight } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CompletePage() {
  const [page, setPage] = useState(1)
  const { data, error, isLoading } = useSWR(`/api/v1/complete-anime/${page}`, fetcher)

  const animeData = data?.data || []
  const pagination = data?.pagination

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-balance">Complete Anime</h1>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-muted-foreground">Failed to load complete anime</p>
          </div>
        ) : (
          <>
            <AnimeGrid items={animeData} />

            {pagination && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.has_previous_page}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.current_page} of {pagination.last_visible_page}
                </span>
                <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={!pagination.has_next_page}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
