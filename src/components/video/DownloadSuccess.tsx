import React from 'react';
import { Card } from '@/components/ui';
import { useDownloadStore } from '@/store';

export default function DownloadSuccess() {
  const { downloadId, progress } = useDownloadStore();
  
  if (!downloadId || !progress || progress.status !== 'completed') {
    return null;
  }

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
          <h3 className="text-lg font-semibold text-green-700">Download Complete!</h3>
        </div>
        <p className="text-green-600">
          Your video has been processed successfully. Click the button below to download.
        </p>
        <a
          href={`/api/download/${downloadId}`}
          download
          className="inline-block w-full text-center py-2 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          Download File
        </a>
      </div>
    </Card>
  );
}
