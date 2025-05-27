import React from 'react';
import { Button } from '@/components/ui';
import { useVideoStore } from '@/store';
import { useDownloadStore } from '@/store';
import { initiateDownload } from '@/services/api';
import { validateTimeRange } from '@/lib/time-utils';

export default function DownloadButton() {
  const { videoInfo } = useVideoStore();
  const { 
    isDownloading, 
    setDownloading, 
    startTime, 
    endTime, 
    selectedFormat,
    setError,
    setDownloadId
  } = useDownloadStore();

  const handleDownload = async () => {
    if (!videoInfo) {
      setError('No video selected');
      return;
    }

    if (startTime === null || endTime === null) {
      setError('Please select a time range');
      return;
    }

    if (!selectedFormat) {
      setError('Please select a video format');
      return;
    }

    try {
      // Validate time range
      const validation = validateTimeRange(startTime, endTime, videoInfo.duration);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid time range');
        return;
      }

      setError(null);
      setDownloading(true);
      
      const downloadUrl = `https://youtube.com/watch?v=${videoInfo.id}`;
      const result = await initiateDownload(
        downloadUrl,
        startTime,
        endTime,
        selectedFormat
      );
      
      setDownloadId(result.downloadId);
      
    } catch (error) {
      console.error('Download failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to start download');
      setDownloadId(null);
    } finally {
      setDownloading(false);
    }
  };

  const getButtonText = () => {
    if (isDownloading) return 'Processing...';
    if (!videoInfo) return 'Select a video first';
    if (startTime === null || endTime === null) return 'Select time range';
    if (!selectedFormat) return 'Select format';
    return 'Download Video';
  };

  const isDisabled = !videoInfo || 
                    startTime === null || 
                    endTime === null || 
                    !selectedFormat || 
                    isDownloading;

  return (
    <div className="space-y-2">
      <Button
        onClick={handleDownload}
        disabled={isDisabled}
        isLoading={isDownloading}
        className="w-full"
      >
        {getButtonText()}
      </Button>
    </div>
  );
}
