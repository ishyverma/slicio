import { NextRequest, NextResponse } from 'next/server';
import type { DownloadResponse } from '@/types/api';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoUrl, startTime, endTime, format } = body;

    if (!videoUrl || startTime === undefined || endTime === undefined || !format) {
      return NextResponse.json<DownloadResponse>({
        success: false,
        error: 'Missing required parameters'
      }, { status: 400 });
    }

    const timestamp = Date.now();
    const downloadId = `download-${timestamp}`;
    
    return NextResponse.json<DownloadResponse>({
      success: true,
      data: {
        downloadId,
        fileName: `${downloadId}.mp4`
      }
    });

  } catch (error) {
    console.error('Error processing download request:', error);
    return NextResponse.json<DownloadResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}
