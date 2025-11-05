import Link from "next/link"
import Image from "next/image"

interface AnimeCardProps {
  title: string
  slug: string
  poster: string
  episode?: string
  status?: string
  rating?: string
}

export function AnimeCard({ title, slug, poster, episode, status, rating }: AnimeCardProps) {
  return (
    <Link href={`/anime/${slug}`} className="group">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        <Image
          src={poster || "/placeholder.png"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {status && <span className="px-2 py-1 text-xs font-semibold bg-primary rounded text-white">{status}</span>}
          {rating && <span className="px-2 py-1 text-xs font-semibold bg-secondary rounded text-white">{rating}</span>}
        </div>

        {/* Episode Info */}
        {episode && (
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-xs text-white font-medium">{episode}</p>
          </div>
        )}
      </div>
      <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{title}</h3>
    </Link>
  )
}
