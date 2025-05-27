interface YouTubeValidationResult {
  isValid: boolean;
  videoId: string | null;
  error?: string;
}

export function validateYouTubeUrl(url: string): YouTubeValidationResult {
  if (!url) {
    return {
      isValid: false,
      videoId: null,
      error: 'URL is required'
    };
  }

  // Handle youtu.be links
  const shortUrlRegex = /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]+)$/;
  const shortUrlMatch = url.match(shortUrlRegex);
  if (shortUrlMatch) {
    return {
      isValid: true,
      videoId: shortUrlMatch[3]
    };
  }

  // Handle standard youtube.com links
  const standardUrlRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)(&.*)?$/;
  const standardUrlMatch = url.match(standardUrlRegex);
  if (standardUrlMatch) {
    return {
      isValid: true,
      videoId: standardUrlMatch[3]
    };
  }

  // Handle mobile youtube.com links
  const mobileUrlRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)(\?.*)?$/;
  const mobileUrlMatch = url.match(mobileUrlRegex);
  if (mobileUrlMatch) {
    return {
      isValid: true,
      videoId: mobileUrlMatch[3]
    };
  }

  return {
    isValid: false,
    videoId: null,
    error: 'Invalid YouTube URL format'
  };
}