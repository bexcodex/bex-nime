"use client"

import { useEffect, useRef, useState } from "react"
import Plyr from "plyr"
import "plyr/dist/plyr.css"

interface VideoPlayerProps {
  streamUrl: string
  streamList?: { [key: string]: string | undefined }
  onTimeUpdate?: (currentTime: number, duration: number) => void
  initialTime?: number
  slug?: string
  episodeTitle?: string
  animeSlug?: string
  animeTitle?: string
  animeImage?: string
}

declare global {
  interface ScreenOrientation extends EventTarget {
    lock(
      orientation:
        | "any"
        | "landscape"
        | "landscape-primary"
        | "landscape-secondary"
        | "natural"
        | "portrait"
        | "portrait-primary"
        | "portrait-secondary",
    ): Promise<void>
    unlock(): void
  }
}

export function VideoPlayer({
  streamUrl,
  streamList,
  onTimeUpdate,
  initialTime = 0,
  slug,
  episodeTitle,
  animeSlug,
  animeTitle,
  animeImage,
}: VideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState<string>(streamUrl)
  const [isDirectVideo, setIsDirectVideo] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentQuality, setCurrentQuality] = useState<string>("480p")
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<Plyr | null>(null)
  const timeUpdateRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (streamList && Object.keys(streamList).length > 0) {
      const qualities = Object.keys(streamList).filter((q) => streamList[q] && streamList[q].startsWith("/api/v1/stream"))
      if (qualities.length > 0) {
        const defaultQuality = qualities[qualities.length - 1] || streamUrl
        setCurrentQuality(defaultQuality)
        setCurrentUrl(streamList[defaultQuality] || streamUrl)
      }
    } else {
      setCurrentUrl(streamUrl)
    }
  }, [streamUrl, streamList])

  useEffect(() => {
    setIsDirectVideo(currentUrl.startsWith("/api/v1/stream"))
  }, [currentUrl])

  useEffect(() => {
    if (!videoRef.current || !isDirectVideo) return

    const qualityOptions = streamList ? Object.keys(streamList).filter((q) => streamList[q] && streamList[q].startsWith("/api/v1/stream")).map((quality) => Number.parseInt(quality)) : [];

    const player = new Plyr(videoRef.current, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "captions",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["quality", "speed"],
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
      ...(qualityOptions.length > 0 && {
        quality: {
          default: Number.parseInt(currentQuality) || qualityOptions[0],
          options: qualityOptions,
          forced: true,
          onChange: (newQuality: number) => {
            handleQualityChange(newQuality)
          },
        },
      }),
    })

    playerRef.current = player

    if (initialTime > 0) {
      player.on("loadedmetadata", () => {
        player.currentTime = initialTime
      })
    }

    return () => {
      player.destroy()
      playerRef.current = null
    }
  }, [currentUrl, isDirectVideo])

  useEffect(() => {
    const player = playerRef.current
    if (!player || !isDirectVideo || !slug) return

    const handleTimeUpdate = () => {
      if (timeUpdateRef.current) return

      timeUpdateRef.current = setTimeout(() => {
        const currentTime = player.currentTime
        const duration = player.duration

        if (onTimeUpdate) {
          onTimeUpdate(currentTime, duration)
        }

        timeUpdateRef.current = undefined
      }, 5000)
    }

    player.on("timeupdate", handleTimeUpdate)

    return () => {
      player.off("timeupdate", handleTimeUpdate)
      if (timeUpdateRef.current) {
        clearTimeout(timeUpdateRef.current)
      }
    }
  }, [isDirectVideo, slug, episodeTitle, animeSlug, animeTitle, animeImage, onTimeUpdate])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const player = playerRef.current
      if (!player) return

      if (window.innerWidth < window.innerHeight) return

      if (player.fullscreen.active) {
        if (screen?.orientation?.lock) {
          screen.orientation.lock("landscape").catch(() => {})
        }
      } else {
        if (screen?.orientation?.unlock) {
          screen.orientation.unlock()
        }
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("enterfullscreen", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("enterfullscreen", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  const handleQualityChange = (newQuality: number) => {
    if (!streamList || !playerRef.current) return

    const qualityLabel = `${newQuality}p`
    const newUrl = streamList[qualityLabel]

    if (newUrl && newUrl !== currentUrl) {
      const currentTime = playerRef.current.currentTime
      const wasPlaying = !playerRef.current.paused

      setCurrentQuality(qualityLabel)
      setCurrentUrl(newUrl)

      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.currentTime = currentTime
          if (wasPlaying) {
            playerRef.current.play()
          }
        }
      }, 500)
    }
  }

  if (!isMounted) return null

  return (
    <div className="relative w-full h-full bg-black">
      {isDirectVideo ? (
        <video ref={videoRef} className="w-full h-full" playsInline>
          <source src={currentUrl} type="video/mp4" />
        </video>
      ) : (
        <iframe
          src={currentUrl}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </div>
  )
}