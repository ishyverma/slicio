import React from 'react';
import { useVideoStore, useDownloadStore } from '@/store';

export default function FormatSelector() {
  const { videoInfo } = useVideoStore();
  const { setFormat } = useDownloadStore();

  if (!videoInfo?.formats || videoInfo.formats.length === 0) {
    return null;
  }

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Quality
      </label>
      <select
        onChange={handleFormatChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        defaultValue=""
      >
        <option value="" disabled>Choose a format</option>
        {videoInfo.formats.map(format => (
          <option key={format.id} value={format.id}>
            {format.quality} ({(format.size / (1024 * 1024)).toFixed(1)} MB)
          </option>
        ))}
      </select>
    </div>
  );
}
