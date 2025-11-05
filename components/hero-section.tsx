"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Info } from "lucide-react"

interface HeroAnime {
  title?: string
  slug?: string
  poster?: string
  current_episode?: string
  release_day?: string
  newest_release_date?: string
}

interface HeroSectionProps {
  featured: HeroAnime[]
}

export function HeroSection({ featured }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!featured || featured.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [featured])

  if (!featured || featured.length === 0) return null

  const current = featured[currentIndex]

  return (
    <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={current.poster || "/placeholder.png"}
          alt={current.title || "Anime"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-16">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">{current.title}</h1>
          {current.current_episode && <p className="text-lg text-muted-foreground">{current.current_episode}</p>}
          {current.release_day && <p className="text-sm text-muted-foreground">{current.release_day}</p>}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/anime/${current.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Watch Now
            </Link>
            <Link
              href={`/anime/${current.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg font-semibold transition-colors"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        {featured.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-primary w-8" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
