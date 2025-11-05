export const runtime = 'edge';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return Response.json({
      status: 'OK',
      message: 'Scraper API otakudesu',
    });
  } catch (error) {
    console.error('Error in system info route:', error);
    return Response.json(
      { status: 'Error', message: 'Internal server error' },
      { status: 500 }
    );
  }
}
