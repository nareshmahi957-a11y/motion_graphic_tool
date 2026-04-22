import { useEffect, useState } from 'react';
import { Lottie } from '@remotion/lottie';
import { delayRender, continueRender } from 'remotion';

interface DynamicLottieProps {
  url: string;
}

export const DynamicLottie = ({ url }: DynamicLottieProps) => {
  // delayRender tells Remotion to freeze the timeline until the animation downloads
  const [handle] = useState(() => delayRender("Fetching Lottie"));
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
        continueRender(handle); // Tell Remotion it's safe to resume the video!
      })
      .catch((err) => {
        console.error("Failed to load Lottie:", err);
        continueRender(handle); // Don't crash the video if a link is broken
      });
  }, [url, handle]);

  if (!animationData) return null;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Lottie 
        animationData={animationData} 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
      />
    </div>
  );
};
