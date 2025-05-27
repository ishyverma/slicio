import { exec as execCallback, spawn } from 'child_process';
import { promisify } from 'util';
import { Readable } from 'stream';
import type { VideoInfo } from '@/types/video';
import type { YtDlpResponse, YtDlpVideoFormat } from '@/types/youtube-dl';

const exec = promisify(execCallback);

// Check if yt-dlp is installed
async function checkYtDlp() {
  try {
    await exec('yt-dlp --version');
    return true;
  } catch (error) {
    console.error('yt-dlp is not installed:', error);
    return false;
  }
}

function filterValidFormats(formats: YtDlpVideoFormat[]): YtDlpVideoFormat[] {
  return formats.filter(format => {
    const hasVideo = format.vcodec !== 'none' && format.height;
    const hasAudio = format.acodec !== 'none';
    return hasVideo && hasAudio;
  });
}

function formatQualityLabel(format: YtDlpVideoFormat): string {
  if (!format.height) return 'audio';
  const label = `${format.height}p`;
  if (format.format_note?.includes('60fps')) {
    return `${label}60`;
  }
  return label;
}

export async function getVideoInfo(url: string): Promise<VideoInfo> {
  if (!url) {
    throw new Error('URL is required');
  }

  try {
    // Ensure yt-dlp is using HTTPS
    const secureUrl = url.replace('http://', 'https://');
    
    const { stdout } = await exec(
      `yt-dlp "${secureUrl}" --dump-json --no-warnings --no-call-home --format "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]"`
    );
    
    const data = JSON.parse(stdout) as YtDlpResponse;

    if (!data || !data.id || !data.title) {
      throw new Error('Invalid response from youtube-dl');
    }

    const validFormats = filterValidFormats(data.formats);

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      duration: data.duration,
      thumbnailUrl: data.thumbnail,
      formats: validFormats.map(format => ({
        id: format.format_id,
        quality: formatQualityLabel(format),
        container: format.ext,
        size: format.filesize || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch video info: ${error.message}`);
    }
    throw new Error('Failed to fetch video info');
  }
}

export function createDownloadStream(
  url: string,
  startTime: number,
  endTime: number,
  format: string
): Readable {
  if (!url) {
    throw new Error('URL is required');
  }

  const secureUrl = url.replace('http://', 'https://');
  
  const args = [
    secureUrl,
    '--no-warnings',
    '--no-call-home',
    '--format', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    '--merge-output-format', 'mp4',
    '--no-playlist',
    '--no-part',
    '--download-sections', `*${startTime}-${endTime}`,
    '--force-keyframes-at-cuts',
    '-o', '-'  // Output to stdout
  ];

  // Spawn yt-dlp process
  const ytDlp = spawn('yt-dlp', args, {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Handle potential errors
  ytDlp.stderr.on('data', (data) => {
    console.error(`yt-dlp stderr: ${data}`);
  });

  ytDlp.on('error', (error) => {
    console.error('Error in yt-dlp process:', error);
    throw error;
  });

  // Return stdout as a readable stream
  const stream = ytDlp.stdout;
  
  // Ensure stream errors are handled
  stream.on('error', (error) => {
    console.error('Stream error:', error);
    throw error;
  });

  return stream;
}
