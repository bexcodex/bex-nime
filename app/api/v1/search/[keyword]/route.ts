export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"
import { okResponse, errorResponse } from "@/src/utils/apiResponse"

export async function GET(request: NextRequest, { params }: { params: { keyword: string } }) {
  try {
    const { keyword } = params
    const data = await otakudesu.search(keyword)
    return Response.json(okResponse(data))
  } catch (error: any) {
    console.error("Error in search route:", error)
    return Response.json(errorResponse("Internal server error", error?.message), { status: 500 })
  }
}
