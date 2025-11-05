export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"

export async function GET(request: NextRequest, { params }: { params: { page?: string } }) {
  try {
    const { page } = params

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

    let result
    if (page) {
      result = await otakudesu.completeAnime(Number.parseInt(page))
    } else {
      result = await otakudesu.completeAnime()
    }

    const { paginationData, completeAnimeData } = result

    if (!paginationData) {
      return Response.json({ status: "Error", message: "There's nothing here ;_;" }, { status: 404 })
    }

    return Response.json({
      status: "Ok",
      data: completeAnimeData,
      pagination: paginationData,
    })
  } catch (error) {
    console.error("Error in complete anime route:", error)
    return Response.json({ status: "Error", message: "Internal server error" }, { status: 500 })
  }
}
