'use client';

import { useState } from 'react';
import { Button, Input, Card } from '@/components/ui';
import { useVideoStore, useDownloadStore } from '@/store';
import VideoInput from '../components/video/VideoInput';

export default function Page() {
  const [inputValue, setInputValue] = useState('');
  const { videoInfo, isLoading: videoLoading, setVideoInfo } = useVideoStore();
  const { isDownloading, setDownloading } = useDownloadStore();

  const testVideoStore = () => {
    setVideoInfo({
      id: 'test-id',
      title: 'Test Video',
      description: 'A test video description.',
      duration: 120,
      thumbnailUrl: 'https://example.com/thumb.jpg',
      formats: [{
        id: 'format1',
        quality: '720p',
        container: 'mp4',
        size: 1024
      }]
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">YouTube Downloader</h1>
      <VideoInput />
      <Card title="Store Test" className="w-full max-w-md">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Video Store Test</h4>
            <Button
              onClick={testVideoStore}
              isLoading={videoLoading}
            >
              Set Test Video Info
            </Button>
            {videoInfo && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(videoInfo, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </Card>
    </main>
  );
}
