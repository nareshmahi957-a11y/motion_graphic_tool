"use client";
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const SparkleTransition: React.FC<{ color?: string }> = ({ color = 'white' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fast expansion animation (0 to 15 frames)
  const progress = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const scale = interpolate(progress, [0, 1], [0, 20]);
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const rotate = interpolate(frame, [0, 20], [0, 45]);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '100px',
        height: '100px',
        backgroundColor: color,
        clipPath: 'polygon(50% 0%, 62% 38%, 100% 50%, 62% 62%, 50% 100%, 38% 62%, 0% 50%, 38% 38%)',
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity: opacity,
        boxShadow: `0 0 50px ${color}`,
      }} />
    </AbsoluteFill>
  );
}