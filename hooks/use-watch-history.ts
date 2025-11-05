"use client"

import { useEffect, useState } from "react"

export interface WatchHistoryItem {
  slug: string
  episodeTitle: string
  animeSlug: string
  animeTitle?: string
  animeImage?: string
  timestamp: number
  currentTime?: number
  duration?: number
}

const STORAGE_KEY = "anime-watch-history"
const MAX_HISTORY_ITEMS = 50

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (e) {
        console.error("Failed to parse watch history:", e)
      }
    }
  }, [])

  const addToHistory = (item: Omit<WatchHistoryItem, "timestamp">) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.slug !== item.slug)
      const newHistory = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const updateProgress = (slug: string, currentTime: number, duration: number) => {
    setHistory((prev) => {
      const newHistory = prev.map((item) =>
        item.slug === slug ? { ...item, currentTime, duration, timestamp: Date.now() } : item,
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const removeFromHistory = (slug: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.slug !== slug)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    history,
    addToHistory,
    updateProgress,
    removeFromHistory,
    clearHistory,
  }
}
