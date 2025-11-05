"use client"

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar"
import { AnimeGrid } from "@/components/anime-grid"
import useSWR from "swr"

export const runtime = "edge"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SearchPage({ params }: { params: { keyword: string } }) {
  const { keyword } = params
  const decodedKeyword = decodeURIComponent(keyword)
  const { data, error, isLoading } = useSWR(`/api/v1/search/${keyword}`, fetcher)

  const results = data?.data || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-2 text-balance">Search Results</h1>
        <p className="text-muted-foreground mb-8">Showing results for "{decodedKeyword}"</p>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-muted-foreground">Failed to search anime</p>
          </div>
        ) : results.length === 0 ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-muted-foreground">No results found for "{decodedKeyword}"</p>
          </div>
        ) : (
          <AnimeGrid items={results} />
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
