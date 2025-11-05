import { AnimeCard } from "./anime-card"

interface AnimeGridProps {
  items: Array<{
    title?: string
    slug?: string
    poster?: string
    current_episode?: string
    release_day?: string
    newest_release_date?: string
    episode_count?: string
    rating?: string
    last_release_date?: string
    status?: string
    genres?: Array<{ name?: string; slug?: string }>
  }>
}

export function AnimeGrid({ items }: AnimeGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No anime found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((anime, index) => (
        <AnimeCard
          key={`${anime.slug}-${index}`}
          title={anime.title ?? ""}
          slug={anime.slug ?? ""}
          poster={anime.poster ?? ""}
          episode={anime.current_episode || anime.episode_count}
          status={anime.status || anime.release_day}
          rating={anime.rating}
        />
      ))}
    </div>
  )
}
