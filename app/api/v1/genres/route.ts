export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"

export async function GET(request: NextRequest) {
  try {
    const data = await otakudesu.genreLists()
    return Response.json({ status: "Ok", data })
  } catch (error) {
    console.error("Error in genre lists route:", error)
    return Response.json({ status: "Error", message: "Internal server error" }, { status: 500 })
  }
}
