export const runtime = 'edge';
import type { NextRequest } from "next/server"
import otakudesu from "@/src/otakudesu"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const data = await otakudesu.batch({ animeSlug: slug })

    if (data) {
      return Response.json({ status: "Ok", data })
    } else {
      return Response.json(
        {
          status: "Error",
          message: "This anime doesn't have a batch yet ;_;",
        },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("Error in batch by anime slug route:", error)
    return Response.json({ status: "Error", message: "Internal server error" }, { status: 500 })
  }
}
