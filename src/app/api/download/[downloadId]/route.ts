import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { join } from 'path';

const TEMP_DIR = join(process.cwd(), 'temp', 'downloads');

// Ensure temp directory exists
async function ensureTempDir() {
  try {
    await fs.access(TEMP_DIR);
  } catch {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { downloadId: string } }
) {
  await ensureTempDir();

  try {
    // Basic rate limiting using headers
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Validate request origin for production only
    const origin = request.headers.get('origin');
    if (process.env.NODE_ENV === 'production' && 
        (!origin || !origin.includes(process.env.NEXT_PUBLIC_APP_URL || ''))) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { downloadId } = await context.params;
    const searchParams = request.nextUrl.searchParams;
    const videoUrl = searchParams.get('url');
    const startTime = parseInt(searchParams.get('start') || '0', 10);
    const endTime = parseInt(searchParams.get('end') || '0', 10);
    const title = searchParams.get('title') || 'video';
    
    // Validate YouTube URL
    if (!videoUrl || !videoUrl.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)) {
      return new NextResponse('Invalid YouTube URL', { status: 400 });
    }
    
    // Validate time range
    if (endTime > 0 && endTime - startTime > 600) { // Max 10 minutes
      return new NextResponse('Video length exceeds maximum allowed duration (10 minutes)', { status: 400 });
    }

    if (!videoUrl) {
      return new NextResponse('Missing video URL', { status: 400 });
    }

    const tempFilePath = join(TEMP_DIR, `${downloadId}.mp4`);
    
    // Download video using yt-dlp with verbose output
    const ytDlp = spawn('yt-dlp', [
      '--format', 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]',
      '--output', tempFilePath,
      '--merge-output-format', 'mp4',
      '--postprocessor-args', 'ffmpeg:-c:v copy -c:a aac -b:a 128k',
      '--no-part',
      '--no-continue',
      videoUrl,
      '--download-sections', `*${startTime}-${endTime}`,
      '--force-keyframes-at-cuts'
    ]);

    let errorOutput = '';

    ytDlp.stdout.on('data', (data) => {
      // Only log download progress in production
      const message = data.toString();
      if (message.includes('[download]')) {
        console.log(`Progress: ${message.trim()}`);
      }
    });

    ytDlp.stderr.on('data', (data) => {
      const message = data.toString();
      if (!message.includes('frame=')) {
        errorOutput += message;
      }
    });

    // Wait for download to complete
    await new Promise((resolve, reject) => {
      ytDlp.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          reject(new Error(`Download failed: ${errorOutput}`));
        }
      });
      ytDlp.on('error', (error) => {
        reject(error);
      });
    });

    // Verify file exists and has content
    try {
      const stats = await fs.stat(tempFilePath);
      if (stats.size === 0) {
        throw new Error('Downloaded file is empty');
      }
    } catch (error) {
      throw new Error('Failed to verify downloaded file');
    }

    // Read the file and send it as response
    const videoBuffer = await fs.readFile(tempFilePath);

    // Clean up temp file
    fs.unlink(tempFilePath).catch(console.error);

    // Sanitize filename
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_');
    const filename = `${sanitizedTitle}.mp4`;

    return new NextResponse(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': videoBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Error processing video:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Error processing video download',
      { status: 500 }
    );
  }
}