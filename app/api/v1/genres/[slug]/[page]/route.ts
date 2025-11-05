export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"

export async function GET(request: NextRequest, { params }: { params: { slug: string; page?: string } }) {
  try {
    const { slug, page } = params

    if (page) {
      const pageNum = Number.parseInt(page)
      if (isNaN(pageNum)) {
        return Response.json({ status: "Error", message: "The page parameter must be a number!" }, { status: 400 })
      }
      if (pageNum < 1) {
        return Response.json(
          { status: "Error", message: "The page parameter must be greater than 0!" },
          { status: 400 },
        )
      }
    }

    const data = await otakudesu.animeByGenre(slug, page)
    return Response.json({ status: "Ok", data })
  } catch (error) {
    console.error("Error in anime by genre route:", error)
    return Response.json({ status: "Error", message: "Internal server error" }, { status: 500 })
  }
}
