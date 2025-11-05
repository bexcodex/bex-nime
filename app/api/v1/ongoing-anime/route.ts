export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"

export async function GET(request: NextRequest) {
  try {
    const result = await otakudesu.ongoingAnime()
    const { paginationData, ongoingAnimeData } = result

    if (!paginationData) {
      return Response.json({ status: "Error", message: "There's nothing here ;_;" }, { status: 404 })
    }

    return Response.json({
      status: "Ok",
      data: ongoingAnimeData,
      pagination: paginationData,
    })
  } catch (error) {
    console.error("Error in ongoing anime route:", error)
    return Response.json({ status: "Error", message: "Internal server error" }, { status: 500 })
  }
}
