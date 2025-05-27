import { VideoInfo, DownloadOptions, DownloadProgress } from './video';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface VideoInfoResponse extends ApiResponse<VideoInfo> {}

export interface DownloadResponse extends ApiResponse<{
  downloadId: string;
  fileName: string;
}> {}

export interface ProgressResponse extends ApiResponse<DownloadProgress> {}