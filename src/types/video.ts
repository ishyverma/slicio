export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnailUrl: string;
  formats: Format[];
}

export interface Format {
  id: string;
  quality: string;
  container: string;
  size: number;
}

export interface TimeRange {
  start: number; // in seconds
  end: number; // in seconds
}

export interface DownloadOptions extends TimeRange {
  format: 'mp4' | 'mp3';
  quality: 'high' | 'medium' | 'low';
}

export interface DownloadProgress {
  status: 'idle' | 'downloading' | 'processing' | 'completed' | 'error';
  progress: number; // 0-100
  message?: string;
  error?: string;
}