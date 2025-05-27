import { NextRequest, NextResponse } from 'next/server';
import { validateYouTubeUrl } from '@/lib/validators';
import type { VideoInfoResponse } from '@/types/api';

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json<VideoInfoResponse>({
        success: false,
        error: 'URL parameter is required'
      }, { status: 400 });
    }

    const validation = validateYouTubeUrl(url);
    if (!validation.isValid) {
      return NextResponse.json<VideoInfoResponse>({
        success: false,
        error: validation.error || 'Invalid YouTube URL'
      }, { status: 400 });
    }

    // Mock response as specified in Task 12
    return NextResponse.json<VideoInfoResponse>({
      success: true,
      data: {
        id: validation.videoId!,
        title: "Rick Astley - Never Gonna Give You Up",
        description: "The official video for Never Gonna Give You Up",
        duration: 212,
        thumbnailUrl: `https://img.youtube.com/vi/${validation.videoId}/maxresdefault.jpg`,
        formats: [
          {
            id: "137+140",
            quality: "1080p",
            container: "mp4",
            size: 1024 * 1024 * 20 // Mock 20MB size
          },
          {
            id: "136+140",
            quality: "720p",
            container: "mp4",
            size: 1024 * 1024 * 10 // Mock 10MB size
          }
        ]
      }
    });

  } catch (error) {
    console.error('Error processing video info request:', error);
    return NextResponse.json<VideoInfoResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}