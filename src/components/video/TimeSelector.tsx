import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui';
import { useVideoStore, useDownloadStore } from '@/store';
import { parseTimeString, formatSeconds, validateTimeRange } from '@/lib/time-utils';

export default function TimeSelector() {
  const { videoInfo } = useVideoStore();
  const { setTimeRange, setError } = useDownloadStore();
  
  const [startTimeStr, setStartTimeStr] = useState('0:00');
  const [endTimeStr, setEndTimeStr] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (videoInfo) {
      setEndTimeStr(formatSeconds(videoInfo.duration));
    }
  }, [videoInfo]);

  const handleTimeChange = (value: string, isStart: boolean) => {
    try {
      // Get the updated time values
      const newStartTimeStr = isStart ? value : startTimeStr;
      const newEndTimeStr = isStart ? endTimeStr : value;
      
      // Update the state
      if (isStart) {
        setStartTimeStr(value);
      } else {
        setEndTimeStr(value);
      }

      if (!videoInfo) return;

      // Validate with the new values
      const startSeconds = parseTimeString(newStartTimeStr);
      const endSeconds = parseTimeString(newEndTimeStr);
      
      const validation = validateTimeRange(startSeconds, endSeconds, videoInfo.duration);
      
      if (!validation.isValid) {
        setValidationError(validation.error || 'Invalid time range');
        setTimeRange(null, null);
        setError(validation.error || 'Invalid time range');
      } else {
        setValidationError(null);
        setTimeRange(startSeconds, endSeconds);
        setError(null);
      }
    } catch (error) {
      const errorMessage = 'Invalid time format. Use MM:SS or HH:MM:SS';
      setValidationError(errorMessage);
      setTimeRange(null, null);
      setError(errorMessage);
    }
  };

  if (!videoInfo) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Select Time Range</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <Input
            type="text"
            value={startTimeStr}
            onChange={(e) => handleTimeChange(e.target.value, true)}
            placeholder="MM:SS"
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <Input
            type="text"
            value={endTimeStr}
            onChange={(e) => handleTimeChange(e.target.value, false)}
            placeholder="MM:SS"
            className="w-full"
          />
        </div>
      </div>
      {validationError && (
        <p className="text-sm text-red-500">{validationError}</p>
      )}
      <p className="text-sm text-gray-500">
        Video duration: {formatSeconds(videoInfo.duration)}
      </p>
    </div>
  );
}
