export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const data = await otakudesu.animeByGenre(slug)
    return Response.json({ status: "Ok", data })
  } catch (error) {
    console.error("Error in anime by genre route:", error)
    return Response.json({ status: "Error", message: "Internal server error" }, { status: 500 })
  }
}
