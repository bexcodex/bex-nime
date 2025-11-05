"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { siteConfig } from "@/config/site"
import { Search, Menu, X } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search/${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {siteConfig.name}
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/ongoing" className="text-sm font-medium hover:text-primary transition-colors">
              Ongoing
            </Link>
            <Link href="/complete" className="text-sm font-medium hover:text-primary transition-colors">
              Complete
            </Link>
            <Link href="/genres" className="text-sm font-medium hover:text-primary transition-colors">
              Genres
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pl-10 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </form>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-muted">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </form>
            <Link href="/" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/ongoing" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Ongoing
            </Link>
            <Link href="/complete" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Complete
            </Link>
            <Link href="/genres" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
              Genres
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}