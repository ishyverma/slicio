import React, { useState } from 'react';
import { validateYouTubeUrl } from '../../lib/validators';
import { useVideoStore } from '../../store/video-store';
import { fetchVideoInfo } from '../../services/api';
import { Button, Card } from '@/components/ui';

export default function VideoInput() {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const { setVideoInfo, setLoading, setError } = useVideoStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    const validation = validateYouTubeUrl(newUrl);
    setIsValid(validation.isValid);
  };

  const handleSubmit = async () => {
    if (!isValid || !url) return;
    setLoading(true);
    setError(null);
    try {
      const videoInfo = await fetchVideoInfo(url);
      setVideoInfo(videoInfo);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch video info');
      setVideoInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <div className="space-y-4 p-4 sm:p-6">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={url}
            onChange={handleChange}
            className={`w-full rounded-lg border p-3 text-base sm:text-lg text-gray-900 shadow-sm transition-colors
              ${isValid ? 'border-gray-300 focus:border-blue-500' : 'border-red-500 focus:border-red-600'}
              placeholder:text-sm sm:placeholder:text-base`}
            placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
          />
          {!isValid && url && (
            <p className="text-sm sm:text-base text-red-500">Please enter a valid YouTube URL</p>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!isValid || !url}
          className="w-full text-base sm:text-lg py-3"
          variant="primary"
          size="lg"
        >
          Get Video Info
        </Button>
      </div>
    </Card>
  );
}