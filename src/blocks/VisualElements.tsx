import React, { useEffect, useState } from 'react';
import { Video, Img, useCurrentFrame, useVideoConfig, spring, interpolate, delayRender, continueRender } from 'remotion';
import { Lottie } from '@remotion/lottie';

// ==========================================
// 1. MEDIA CONTAINER
// AI just passes a URL. This block figures out if it's a video or image.
// ==========================================
export const MediaContainer: React.FC<{
  url: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  style?: React.CSSProperties;
}> = ({ url, objectFit = 'cover', style }) => {
  if (!url) return null;
  
  const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('video');

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ...style }}>
      {isVideo ? (
        <Video src={url} style={{ width: '100%', height: '100%', objectFit }} />
      ) : (
        <Img src={url} style={{ width: '100%', height: '100%', objectFit }} />
      )}
    </div>
  );
};

// ==========================================
// 2. KINETIC TEXT
// Accepts a "mode" prop so the AI can change the animation style instantly.
// ==========================================
export const KineticText: React.FC<{
  text: string;
  mode?: 'stomp' | 'typewriter' | 'fade';
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  delay?: number;
}> = ({ text, mode = 'stomp', color = '#ffffff', fontSize = 100, fontFamily = 'Montserrat', delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const activeFrame = Math.max(0, frame - delay);

  // Mode 1: Aggressive Stomp (Harvested from Kinetic Stomp)
  const stompScale = spring({ frame: activeFrame, fps, config: { stiffness: 200, damping: 10 } });
  
  // Mode 2: Elegant Fade 
  const fadeOpacity = interpolate(activeFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeY = interpolate(activeFrame, [0, 15], [50, 0], { extrapolateRight: 'clamp' });

  let animatedStyle: React.CSSProperties = {};
  if (mode === 'stomp') animatedStyle = { transform: `scale(${stompScale})` };
  if (mode === 'fade') animatedStyle = { opacity: fadeOpacity, transform: `translateY(${fadeY}px)` };

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color, fontSize, fontWeight: 800, textTransform: 'uppercase',
      textAlign: 'center', lineHeight: 1.1, ...animatedStyle 
    }}>
      {text}
    </div>
  );
};

// ==========================================
// 3. GENERATIVE BACKGROUND
// Harvested from Pentagon Flow: Renders moving stars or gradients
// ==========================================
export const GenerativeBackground: React.FC<{
  type?: 'stars' | 'gradient';
  color?: string;
}> = ({ type = 'stars', color = '#ffffff' }) => {
  const frame = useCurrentFrame();

  if (type === 'gradient') {
    // A slow-moving radial gradient
    const shift = Math.sin(frame / 60) * 20;
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: `radial-gradient(circle at ${50 + shift}% ${50 - shift}%, ${color}40 0%, #000000 70%)`
      }} />
    );
  }

  return (
    <div style={{ 
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      opacity: 0.4
    }}>
      {[...Array(60)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(Math.abs(Math.sin(i * 555)) * 100)}%`,
          top: `${(Math.abs(Math.cos(i * 777)) * 100)}%`,
          width: '3px', height: '3px', backgroundColor: color, 
          borderRadius: '50%', boxShadow: `0 0 10px ${color}`,
          opacity: Math.abs(Math.sin(frame / 20 + i)) // Twinkle effect
        }} />
      ))}
    </div>
  );
};

// ==========================================
// 4. DYNAMIC PATH (The Bridge)
// Harvested from Pentagon Flow: Draws a line between two coordinates
// ==========================================
export const DynamicPath: React.FC<{
  p1: { x: number, y: number };
  p2: { x: number, y: number };
  color?: string;
  dashed?: boolean;
  arcHeight?: number; // How high the "mountain" curve goes
}> = ({ p1, p2, color = 'white', dashed = true, arcHeight = -200 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Control point for the bezier curve (creates the arc)
  const midX = (p1.x + p2.x) / 2;
  // If arcHeight is 0, it draws a straight line. Otherwise, it arcs upwards.
  const pathD = `M ${p1.x} ${p1.y} Q ${midX} ${arcHeight} ${p2.x} ${p2.y}`;

  return (
    <svg width={width} height={height} style={{ position: 'absolute', overflow: 'visible', zIndex: 1 }}>
      <path 
        d={pathD}
        fill="none" 
        stroke={color} 
        strokeWidth="6" 
        strokeDasharray={dashed ? "25 25" : "none"}
        strokeDashoffset={dashed ? frame * -5 : 0} // Marching ants effect
        strokeLinecap="round"
      />
    </svg>
  );
};

// ==========================================
// 5. SCREEN MARKER (Hand-drawn Highlights)
// AI places this over screen recordings to draw circles/underlines.
// ==========================================
export const ScreenMarker: React.FC<{
  type?: 'circle' | 'underline' | 'arrow';
  color?: string;
  delay?: number;
  width?: number;
  height?: number;
}> = ({ type = 'circle', color = '#ef4444', delay = 15, width = 200, height = 100 }) => {
  const frame = useCurrentFrame();
  
  // Animate the stroke drawing itself over 20 frames
  const drawProgress = interpolate(frame - delay, [0, 20], [1000, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Slightly imperfect SVG paths to look "hand-drawn"
  const paths = {
    circle: `M ${width/2}, ${height * 0.1} a ${width * 0.4},${height * 0.4} 0 1,0 10,0`,
    underline: `M 10, ${height * 0.8} Q ${width / 2}, ${height * 0.9} ${width - 10}, ${height * 0.7}`,
    arrow: `M 10, ${height / 2} L ${width - 20}, ${height / 2} M ${width - 40}, ${height * 0.2} L ${width - 10}, ${height / 2} L ${width - 40}, ${height * 0.8}`
  };

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', filter: `drop-shadow(0px 4px 10px ${color}80)` }}>
      <path 
        d={paths[type]} 
        fill="none" 
        stroke={color} 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        strokeDasharray="1000"
        strokeDashoffset={drawProgress}
      />
    </svg>
  );
};

// ==========================================
// 6. MOCKUP FRAME (Device Shells)
// Wraps any inner media inside a clean CSS Phone or Browser window.
// ==========================================
export const MockupFrame: React.FC<{
  device?: 'phone' | 'browser';
  mediaUrl: string;
  width?: number;
}> = ({ device = 'phone', mediaUrl, width = 400 }) => {
  if (device === 'browser') {
    return (
      <div style={{ width, backgroundColor: '#18181b', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        {/* Browser Top Bar */}
        <div style={{ height: '30px', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', padding: '0 12px', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
        </div>
        {/* Browser Content */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
          <MediaContainer url={mediaUrl} objectFit="cover" />
        </div>
      </div>
    );
  }

  // Phone Mockup
  return (
    <div style={{ width, aspectRatio: '9/19.5', backgroundColor: '#000', borderRadius: '40px', padding: '12px', border: '2px solid #3f3f46', boxShadow: '0 25px 50px rgba(0,0,0,0.6)', position: 'relative' }}>
      {/* Dynamic Island / Notch */}
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', width: '30%', height: '25px', backgroundColor: '#000', borderRadius: '20px', zIndex: 10 }} />
      <div style={{ width: '100%', height: '100%', borderRadius: '28px', overflow: 'hidden', position: 'relative' }}>
        <MediaContainer url={mediaUrl} objectFit="cover" />
      </div>
    </div>
  );
};

// ==========================================
// 7. AVATAR BUBBLE (Speaker Profile)
// A circular profile picture that can have "speaking" soundwave rings.
// ==========================================
export const AvatarBubble: React.FC<{
  imageUrl: string;
  size?: number;
  isSpeaking?: boolean;
  color?: string;
}> = ({ imageUrl, size = 150, isSpeaking = true, color = '#a855f7' }) => {
  const frame = useCurrentFrame();
  
  // Creates a pulsing scale effect if the person is speaking
  const pulse = isSpeaking ? Math.sin(frame / 5) * 5 : 0;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* Glowing animated background ring */}
      {isSpeaking && (
        <div style={{
          position: 'absolute', inset: -10, borderRadius: '50%',
          backgroundColor: color, opacity: 0.3 + Math.abs(Math.sin(frame / 10)) * 0.4,
          transform: `scale(${1 + Math.abs(Math.sin(frame / 8)) * 0.2})`,
          filter: 'blur(10px)', zIndex: 0
        }} />
      )}
      {/* Main Image */}
      <div style={{
        position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
        border: `4px solid ${color}`, zIndex: 1, transform: `scale(${(size + pulse) / size})`,
        backgroundColor: '#111'
      }}>
        <Img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  );
};

// ==========================================
// 8. PROGRESS INDICATOR (Visual Timers)
// AI uses this to show a loading bar or circular countdown at the bottom of the screen.
// ==========================================
export const ProgressIndicator: React.FC<{
  type?: 'bar' | 'circle';
  durationInFrames: number;
  color?: string;
  width?: number;
}> = ({ type = 'bar', durationInFrames, color = '#22c55e', width = 800 }) => {
  const frame = useCurrentFrame();
  
  // Calculate percentage of completion
  const progress = Math.min(1, frame / durationInFrames);

  if (type === 'circle') {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress * circumference);
    return (
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
        <circle cx="50" cy="50" r={radius} stroke={color} strokeWidth="8" fill="none" 
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
    );
  }

  // Horizontal Bar
  return (
    <div style={{ width, height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
      <div style={{ 
        width: `${progress * 100}%`, height: '100%', backgroundColor: color, 
        boxShadow: `0 0 10px ${color}`, borderRadius: '4px' 
      }} />
    </div>
  );
};

// ==========================================
// 9. VECTOR SHAPE (Dynamic Geometry)
// AI defines the math, and it draws perfectly crisp SVGs.
// ==========================================
export const VectorShape: React.FC<{
  shapeType?: 'rectangle' | 'circle' | 'polygon';
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number; // Only for rectangle
  points?: string;       // Only for polygon (e.g., "50,5 95,38 78,92 22,92 5,38" for pentagon)
}> = ({ 
  shapeType = 'rectangle', width = 200, height = 200, 
  fill = '#a855f7', stroke = 'none', strokeWidth = 0, 
  borderRadius = 0, points = "50,5 95,38 78,92 22,92 5,38" 
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none" style={{ overflow: 'visible', filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.5))` }}>
      {shapeType === 'rectangle' && (
        <rect x="0" y="0" width="100" height="100" rx={borderRadius} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      )}
      {shapeType === 'circle' && (
        <circle cx="50" cy="50" r="50" fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      )}
      {shapeType === 'polygon' && (
        <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
      )}
    </svg>
  );
};

// ==========================================
// 10. LOTTIE STICKER (Complex JSON Animations)
// The AI passes a remote Lottie JSON URL, and Remotion pauses rendering until it downloads!
// ==========================================
export const LottieSticker: React.FC<{
  url: string;
  width?: number;
  height?: number;
}> = ({ url, width = 300, height = 300 }) => {
  const [animationData, setAnimationData] = useState<any>(null);
  
  // ⚡ Remotion Hook: Tells the cloud renderer to PAUSE until the AI's Lottie file is fully downloaded
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    if (!url) {
      continueRender(handle);
      return;
    }
    
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
        continueRender(handle); // ⚡ Unpause the renderer
      })
      .catch((err) => {
        console.error("Failed to load Lottie URL:", err);
        continueRender(handle); // Unpause even on error so it doesn't crash the whole video
      });
  }, [url, handle]);

  if (!animationData) return null;

  return (
    <div style={{ width, height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Lottie animationData={animationData} />
    </div>
  );
};
