/**
 * Convert time string (MM:SS or HH:MM:SS) to seconds
 */
export function parseTimeString(timeStr: string): number {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  throw new Error('Invalid time format. Use MM:SS or HH:MM:SS');
}

/**
 * Convert seconds to formatted time string
 */
export function formatSeconds(seconds: number): string {
  if (seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Validate time range for video with proper type safety
 */
export function validateTimeRange(start: number, end: number, duration: number): {
  isValid: boolean;
  error?: string;
} {
  if (start < 0) {
    return { isValid: false, error: 'Start time cannot be negative' };
  }
  if (end <= start) {
    return { isValid: false, error: 'End time must be greater than start time' };
  }
  if (end > duration) {
    return { isValid: false, error: 'End time cannot exceed video duration' };
  }
  return { isValid: true };
}
