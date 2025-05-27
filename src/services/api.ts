import axios from 'axios';
import type { VideoInfoResponse, DownloadResponse } from '@/types/api';
import type { VideoInfo } from '@/types/video';

export const fetchVideoInfo = async (url: string): Promise<VideoInfo> => {
  try {
    const response = await axios.get<VideoInfoResponse>(`/api/video-info?url=${encodeURIComponent(url)}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch video info');
    }
    return response.data.data;
  } catch (error) {
    console.error('Error fetching video info:', error);
    throw new Error('Failed to fetch video info');
  }
};

export const initiateDownload = async (
  videoUrl: string,
  startTime: number,
  endTime: number,
  format: string
): Promise<{ downloadId: string; fileName: string }> => {
  try {
    const response = await axios.post<DownloadResponse>('/api/download', {
      videoUrl,
      startTime,
      endTime,
      format
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to initiate download');
    }
    
    return response.data.data;
  } catch (error) {
    console.error('Error initiating download:', error);
    throw error instanceof Error ? error : new Error('Failed to initiate download');
  }
};