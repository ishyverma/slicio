import React from 'react';
import { useVideoStore } from '../../store/video-store';
import { Card } from '@/components/ui';

const VideoPreview: React.FC = () => {
  const { videoInfo } = useVideoStore();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  if (!videoInfo) {
    return null;
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className="space-y-4">
        <div className="relative aspect-video w-full">
          <img 
            src={videoInfo.thumbnailUrl} 
            alt={videoInfo.title} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4 sm:p-6 space-y-2">
          <h2 className="text-lg sm:text-xl font-semibold line-clamp-2">{videoInfo.title}</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Duration: {formatDuration(videoInfo.duration)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default VideoPreview;