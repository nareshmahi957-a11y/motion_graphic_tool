import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, Video, Img, interpolate } from 'remotion';

// The AI will output an array of these elements
export type CanvasElement = {
  type: 'text' | 'shape' | 'media';
  id: string;
  x: number; // 0 to 1080
  y: number; // 0 to 1920
  width?: number;
  height?: number;
  color?: string;
  content?: string; // Text content or Media URL
  shapeType?: 'rectangle' | 'circle';
  animation?: 'pop' | 'slide-up' | 'fade';
  delay?: number; // Frames to wait before animating
  fontSize?: number;
  fontWeight?: number | string;
};

export const DynamicSceneRenderer: React.FC<{ elements: CanvasElement[], sceneBgColor?: string }> = ({ 
  elements = [], 
  sceneBgColor = "transparent" 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: sceneBgColor, overflow: 'hidden' }}>
      {elements.map((el, i) => {
        // ⏱️ ANIMATION LOGIC
        const delay = el.delay || (i * 10); // Auto-stagger if AI forgets delay
        const activeFrame = Math.max(0, frame - delay);

        let scale = 1;
        let translateY = 0;
        let opacity = 1;

        if (el.animation === 'pop') {
          scale = spring({ frame: activeFrame, fps, config: { stiffness: 120, damping: 14 } });
          opacity = interpolate(activeFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });
        } else if (el.animation === 'slide-up') {
          const slideSpring = spring({ frame: activeFrame, fps, config: { stiffness: 80, damping: 15 } });
          translateY = interpolate(slideSpring, [0, 1], [100, 0]);
          opacity = interpolate(slideSpring, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });
        } else if (el.animation === 'fade') {
          opacity = interpolate(activeFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
        }

        // 🎯 POSITIONING LOGIC (Center-anchored so X/Y from AI works perfectly)
        const baseStyle: React.CSSProperties = {
          position: 'absolute',
          left: `${el.x}px`,
          top: `${el.y}px`,
          transform: `translate(-50%, -50%) scale(${scale}) translateY(${translateY}px)`,
          opacity,
          zIndex: i + 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        };

        // 🧱 RENDER MEDIA (B-Roll or Images)
        if (el.type === 'media' && el.content) {
          const isVideo = el.content.endsWith('.mp4') || el.content.includes('video');
          return (
            <div key={el.id || i} style={{ ...baseStyle, width: el.width || 950, height: el.height || 800, overflow: 'hidden', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              {isVideo ? (
                <Video src={el.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
              ) : (
                <Img src={el.content} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              {/* 🟢 THE FIX: Automatic Cinematic Dark Overlay so text is always readable */}
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1 }} />
            </div>
          );
        }

        // 🧱 RENDER SHAPES
        if (el.type === 'shape') {
          const isCircle = el.shapeType === 'circle';
          return (
            <div key={el.id || i} style={{ 
              ...baseStyle, 
              width: el.width || 200, 
              height: el.height || (isCircle ? (el.width || 200) : 200),
              backgroundColor: el.color || '#00d4ff',
              borderRadius: isCircle ? '50%' : '20px',
              boxShadow: `0 10px 30px rgba(0,0,0,0.4)`
            }} />
          );
        }

        // 🧱 RENDER TEXT
        if (el.type === 'text') {
          return (
            <div key={el.id || i} style={{ 
              ...baseStyle, 
              color: el.color || '#ffffff', 
              fontSize: `${el.fontSize || 80}px`, 
              fontWeight: el.fontWeight || 900,
              fontFamily: 'Montserrat, sans-serif',
              // 🟢 THE FIX: Added stroke and heavy shadow for maximum legibility
              WebkitTextStroke: '3px black',
              paintOrder: 'stroke fill' as any,
              textShadow: '0 15px 40px rgba(0,0,0,0.9)',
              width: el.width ? `${el.width}px` : 'auto',
              lineHeight: 1.1,
              textTransform: 'uppercase'
            }}>
              {el.content}
            </div>
          );
        }

        return null;
      })}
    </AbsoluteFill>
  );
};
