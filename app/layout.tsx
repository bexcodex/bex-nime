import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { siteConfig } from "@/config/site";
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: `${siteConfig.name} - Watch Anime Online`,
  description: "Stream your favorite anime in high quality"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
