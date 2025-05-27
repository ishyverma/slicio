import React, { useState } from 'react';
import { validateYouTubeUrl } from '../../lib/validators';

export default function VideoInput() {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValid(validateYouTubeUrl(newUrl));
  };

  return (
    <div className="video-input">
      <input
        type="text"
        value={url}
        onChange={handleChange}
        className={`border p-2 ${isValid ? 'border-gray-300' : 'border-red-500'}`}
        placeholder="Enter YouTube URL"
      />
      {!isValid && <p className="text-red-500">Invalid YouTube URL</p>}
      <button
        className="bg-blue-500 text-white p-2 mt-2"
        disabled={!isValid || !url}
      >
        Submit
      </button>
    </div>
  );
}