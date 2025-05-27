import { create } from 'zustand';
import { DownloadProgress } from '@/types';

interface DownloadState {
  startTime: number | null;
  endTime: number | null;
  selectedFormat: string | null;
  downloadId: string | null;
  progress: DownloadProgress | null;
  isDownloading: boolean;
  error: string | null;
  setTimeRange: (start: number | null, end: number | null) => void;
  setFormat: (format: string | null) => void;
  setDownloadId: (id: string | null) => void;
  setProgress: (progress: DownloadProgress | null) => void;
  setDownloading: (downloading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  startTime: null,
  endTime: null,
  selectedFormat: null,
  downloadId: null,
  progress: null,
  isDownloading: false,
  error: null,
  setTimeRange: (start, end) => set({ startTime: start, endTime: end }),
  setFormat: (format) => set({ selectedFormat: format }),
  setDownloadId: (id) => set({ downloadId: id }),
  setProgress: (progress) => set({ progress }),
  setDownloading: (downloading) => set({ isDownloading: downloading }),
  setError: (error) => set({ error }),
  reset: () => set({
    startTime: null,
    endTime: null,
    selectedFormat: null,
    downloadId: null,
    progress: null,
    isDownloading: false,
    error: null
  })
}));