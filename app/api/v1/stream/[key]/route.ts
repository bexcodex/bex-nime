import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const runtime = 'edge';

const getSourceVideo = async (url: string) => {
  try {
    const host = new URL(url).hostname;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    let data: string | undefined;
    
    console.log(host);
    
    $('script').each((i, el) => {
      const content = $(el).html()?.trim();
      if (content && content.includes('VIDEO_CONFIG')) {
        data = content;
      }
    });

    if (!data) return undefined;
    return JSON.parse(data.replace('var VIDEO_CONFIG = ', '')).streams;
  } catch (e) {
    return e;
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = params;
    const googleVideoUrl = `https://www.blogger.com/video.g?token=${key}`;
    const range = req.headers.get('range');

    if (!googleVideoUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    if (key) {
      const match = await getSourceVideo(googleVideoUrl);
      if (!match || !match[0] || !match[0].play_url) {
        return NextResponse.json({ error: 'Failed to get video source' }, { status: 500 });
      }
      
      const Referer = new URL(googleVideoUrl).host;
      console.log(Referer);
      
      const headers: HeadersInit = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Referer': `https://${Referer}`
      };

      if (range) {
        headers['Range'] = range;
      }

      const response = await fetch(match[0].play_url, {
        headers
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch video' }, 
          { status: response.status }
        );
      }

      const responseHeaders = new Headers();
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
      responseHeaders.set('Access-Control-Allow-Headers', 'Range, Content-Type');
      
      const headersToProxy = [
        'content-type',
        'content-length',
        'content-range',
        'accept-ranges',
        'cache-control',
        'etag',
        'last-modified'
      ];

      headersToProxy.forEach(header => {
        const value = response.headers.get(header);
        if (value) {
          responseHeaders.set(header, value);
        }
      });

      const status = range && response.status === 206 ? 206 : 200;

      return new NextResponse(response.body, {
        status,
        headers: responseHeaders
      });
    }

    return NextResponse.json({ error: 'Key parameter is required' }, { status: 400 });
  } catch (error: any) {
    console.error('Stream error:', error);
    return NextResponse.json({
      error: 'Failed to stream video',
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    }, { status: 500 });
  }
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type'
    }
  });
}
