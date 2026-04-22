import { useEffect, useState } from 'react';
import { OffthreadVideo, AbsoluteFill } from 'remotion';

interface PexelsVideoProps {
  searchQuery: string;
}

interface VideoFile {
  quality: string;
  link: string;
}

interface PexelsVideo {
  video_files: VideoFile[];
}

interface PexelsResponse {
  videos: PexelsVideo[];
}

export const PexelsVideo = ({ searchQuery }: PexelsVideoProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY || process.env.PEXELS_API_KEY;
      if (!apiKey) {
        console.error('Missing NEXT_PUBLIC_PEXELS_API_KEY env var');
        return;
      }

      try {
        const res = await fetch(`https://api.pexels.com/videos/search?query=${searchQuery}&per_page=1&orientation=portrait`, {
          headers: {
            Authorization: apiKey
          }
        });
        
        const data = (await res.json()) as PexelsResponse;
        
        if (data.videos && data.videos.length > 0) {
          // Find the HD version of the video
          const hdVideo = data.videos[0].video_files.find((file: VideoFile) => file.quality === 'hd') || data.videos[0].video_files[0];
          setVideoUrl(hdVideo.link);
        } else {
          console.warn(`No videos found for query: ${searchQuery}`);
        }
      } catch (error) {
        console.error("Failed to fetch B-Roll:", error);
      }
    };

    fetchVideo();
  }, [searchQuery]);

  // While waiting for the API, show a solid background
  if (!videoUrl) {
    return <AbsoluteFill style={{ backgroundColor: '#2d2d2d' }} />;
  }

  // Once the URL is found, render the real video!
  return (
    <AbsoluteFill style={{ zIndex: 50 }}>
      <OffthreadVideo 
        src={videoUrl} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
    </AbsoluteFill>
  );
};
