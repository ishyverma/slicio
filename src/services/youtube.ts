import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import type { VideoInfo } from '@/types/video';
import type { YtDlpResponse, YtDlpVideoFormat } from '@/types/youtube-dl';

const exec = promisify(execCallback);

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
