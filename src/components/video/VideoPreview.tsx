import React from 'react';

interface VideoPreviewProps {
  title: string;
  duration: number;
  thumbnailUrl: string;
}

const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VideoPreview: React.FC<VideoPreviewProps> = ({ title, duration, thumbnailUrl }) => {
  return (
    <div className="video-preview">
      <img src={thumbnailUrl} alt="Video Thumbnail" className="w-full h-auto" />
      <h3 className="text-lg font-bold mt-2">{title}</h3>
      <p className="text-sm text-gray-600">Duration: {formatDuration(duration)}</p>
    </div>
  );
};

export default VideoPreview;