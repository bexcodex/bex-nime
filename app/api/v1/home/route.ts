export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"
import { okResponse, errorResponse } from "@/src/utils/apiResponse"

export async function GET(request: NextRequest) {
  try {
    const data = await otakudesu.home()
    return Response.json(okResponse(data))
  } catch (error: any) {
    console.error("Error in home route:", error)
    return Response.json(errorResponse("Internal server error", error?.message), { status: 500 })
  }
}
