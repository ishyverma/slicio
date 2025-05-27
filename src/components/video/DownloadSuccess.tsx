import React, { useState } from 'react';
import { Card } from '@/components/ui';
import { useDownloadStore } from '@/store';
import { useVideoStore } from '@/store';

export default function DownloadSuccess() {
  const { downloadId, progress, startTime, endTime } = useDownloadStore();
  const { videoInfo } = useVideoStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!downloadId || !progress || progress.status !== 'completed' || !videoInfo) {
    return null;
  }

  const handleDownload = async () => {
    if (!videoInfo || startTime === null || endTime === null) return;
    
    setIsDownloading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        url: `https://youtube.com/watch?v=${videoInfo.id}`,
        start: String(startTime),
        end: String(endTime),
        title: videoInfo.title
      });

      const response = await fetch(`/api/download/${downloadId}?${params.toString()}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'video.mp4';
      if (contentDisposition) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download video. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full bg-green-50 border-green-200">
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <svg
            className="h-6 w-6 text-green-500"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-lg font-semibold text-green-700">Ready to Download!</h3>
        </div>
        <p className="text-green-600">
          Click the button below to download your trimmed video.
        </p>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`inline-block w-full text-center py-2 px-4 rounded-md transition-colors
            ${isDownloading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {isDownloading ? 'Processing...' : 'Download Video'}
        </button>
      </div>
    </Card>
  );
}
