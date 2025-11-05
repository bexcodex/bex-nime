export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"

export async function GET(request: NextRequest, { params }: { params: { slug: string; episode: string } }) {
  try {
    const { slug: animeSlug, episode } = params
    const data = await otakudesu.episode({
      animeSlug,
      episodeNumber: Number.parseInt(episode),
    })

    if (!data) {
      return Response.json({ status: "Error", message: "There's nothing here ;_;" }, { status: 404 })
    }

    return Response.json({ status: "Ok", data })
  } catch (error) {
    console.error("Error in episode by number route:", error)
    return Response.json({ status: "Error", message: "Internal server error" }, { status: 500 })
  }
}
