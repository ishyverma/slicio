import { create } from 'zustand';
import { VideoInfo } from '@/types';

interface VideoState {
  videoInfo: VideoInfo | null;
  isLoading: boolean;
  error: string | null;
  setVideoInfo: (info: VideoInfo | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videoInfo: null,
  isLoading: false,
  error: null,
  setVideoInfo: (info) => set({ videoInfo: info }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ videoInfo: null, isLoading: false, error: null })
}));