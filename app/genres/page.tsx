"use client"

import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import useSWR from "swr"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function GenresPage() {
  const { data, error, isLoading } = useSWR("/api/v1/genres", fetcher)

  const genres = data?.data || []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 text-balance">Browse by Genre</h1>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-muted-foreground">Failed to load genres</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genres.map((genre: any) => (
              <Link key={genre.slug} href={`/genres/${genre.slug}`}>
                <Card className="p-6 hover:bg-accent transition-colors cursor-pointer group text-center">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{genre.name}</h3>
                </Card>
              </Link>
            ))}
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
    </div>
  )
}
