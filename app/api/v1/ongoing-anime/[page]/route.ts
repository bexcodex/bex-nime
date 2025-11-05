export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"
import { errorResponse, paginatedResponse } from "@/src/utils/apiResponse"

export async function GET(request: NextRequest, { params }: { params: { page?: string } }) {
  try {
    const { page } = params

    if (page) {
      const pageNum = Number.parseInt(page)
      if (isNaN(pageNum)) {
        return Response.json(errorResponse("The page parameter must be a number!"), { status: 400 })
      }
      if (pageNum < 1) {
        return Response.json(errorResponse("The page parameter must be greater than 0!"), { status: 400 })
      }
    }

    let result
    if (page) {
      result = await otakudesu.ongoingAnime(Number.parseInt(page))
    } else {
      result = await otakudesu.ongoingAnime()
    }

    const { paginationData, ongoingAnimeData } = result

    if (!paginationData) {
      return Response.json(errorResponse("There's nothing here ;_;"), { status: 404 })
    }

    return Response.json(paginatedResponse(ongoingAnimeData, paginationData))
  } catch (error: any) {
    console.error("Error in ongoing anime route:", error)
    return Response.json(errorResponse("Internal server error", error?.message), { status: 500 })
  }
}
