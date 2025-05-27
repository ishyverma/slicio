// Types based on youtube-dl-exec JSON output
export interface YtDlpVideoFormat {
  format_id: string;
  ext: string;
  width?: number;
  height?: number;
  filesize?: number;
  format_note?: string;
  vcodec: string;
  acodec: string;
}

export interface YtDlpResponse {
  id: string;
  title: string;
  description?: string;
  duration: number;
  thumbnail: string;
  formats: YtDlpVideoFormat[];
  webpage_url: string;
}
