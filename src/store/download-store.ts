import { create } from 'zustand';
import { DownloadProgress } from '@/types';

interface DownloadState {
  downloadId: string | null;
  progress: DownloadProgress | null;
  isDownloading: boolean;
  error: string | null;
  setDownloadId: (id: string | null) => void;
  setProgress: (progress: DownloadProgress | null) => void;
  setDownloading: (downloading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  downloadId: null,
  progress: null,
  isDownloading: false,
  error: null,
  setDownloadId: (id) => set({ downloadId: id }),
  setProgress: (progress) => set({ progress }),
  setDownloading: (downloading) => set({ isDownloading: downloading }),
  setError: (error) => set({ error }),
  reset: () => set({
    downloadId: null,
    progress: null,
    isDownloading: false,
    error: null
  })
}));