import { useEffect, useRef } from "react";
import { Video, useCurrentFrame, useVideoConfig } from "remotion";

// 🟢 ADD startFrom to the props!
export const ChromaKeyVideo: React.FC<{ src: string; startFrom?: number }> = ({ src, startFrom = 0 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const videoRatio = video.videoWidth / video.videoHeight;
    const canvasRatio = width / height;

    let drawWidth = width;
    let drawHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (videoRatio > canvasRatio) {
      drawWidth = height * videoRatio;
      offsetX = (width - drawWidth) / 2;
    } else {
      drawHeight = width / videoRatio;
      offsetY = (height - drawHeight) / 2;
    }

    ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

    const frameData = ctx.getImageData(0, 0, width, height);
    const data = frameData.data;

    // 🟢 CLEAN CHROMA KEY MATH (No yellow halos!)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // 1. If it is strongly green, make it 100% transparent
      if (g > 90 && g > r * 1.3 && g > b * 1.3) {
        data[i + 3] = 0; 
      } 
      // 2. THE EDGE FIX: If it's slightly green (a border pixel), neutralize the glow
      else if (g > r && g > b) {
        // Average out the green so it matches the real lighting, removing the halo
        data[i + 1] = (r + b) / 2; 
        
        // Slightly fade the edge to make it blend into the background smoothly
        data[i + 3] = 200; 
      }
    }

    ctx.putImageData(frameData, 0, 0);
  }, [frame, width, height]);

  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Video
        ref={videoRef}
        src={src}
        // 🟢 THE FIX: Tell the video to fast-forward to the right timestamp
        startFrom={startFrom}
        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} // 🟢 THE FIX
        crossOrigin="anonymous"
      />
      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};