'use client';

import { Card } from '@/components/ui';
import { useVideoStore } from '@/store';
import VideoInput from '../components/video/VideoInput';
import VideoPreview from '../components/video/VideoPreview';
import TimeSelector from '../components/video/TimeSelector';
import FormatSelector from '../components/video/FormatSelector';
import DownloadButton from '../components/video/DownloadButton';
import DownloadSuccess from '../components/video/DownloadSuccess';

export default function Page() {
  const { videoInfo } = useVideoStore();


  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">YouTube Downloader</h1>
        
        <div className="grid gap-4 sm:gap-6 md:gap-8">
          <VideoInput />
          {videoInfo && (
            <>
              <VideoPreview />
              <Card className="w-full p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <TimeSelector />
                  <FormatSelector />
                  <DownloadButton />
                  <DownloadSuccess />
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
