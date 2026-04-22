"use client";

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const MovingGradientBg: React.FC<{ children?: React.ReactNode, themeColor?: string }> = ({ 
  children,
  themeColor = "#a855f7" // Fallback purple
}) => {
  const frame = useCurrentFrame();

  // 🌊 Organic movement using sine waves mapped to the exact video frame
  const move1x = Math.sin(frame / 60) * 30;
  const move1y = Math.cos(frame / 50) * 30;
  
  const move2x = Math.sin(frame / 40) * 40 + 50;
  const move2y = Math.cos(frame / 70) * 40 + 50;

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden' }}>
      
      {/* Blob 1: Tied to the Scene's Theme Color */}
      <div style={{
        position: 'absolute', 
        inset: -400, // Oversized to hide hard edges
        background: `radial-gradient(circle at ${50 + move1x}% ${50 + move1y}%, ${themeColor}33 0%, transparent 60%)`,
        filter: 'blur(100px)', // Creates the "fluid" mesh look
        zIndex: 0
      }} />

      {/* Blob 2: A complementary cool tone (blue/cyan) */}
      <div style={{
        position: 'absolute', 
        inset: -400,
        background: `radial-gradient(circle at ${move2x}% ${move2y}%, #3b82f622 0%, transparent 50%)`,
        filter: 'blur(120px)',
        zIndex: 0
      }} />

      {/* Content Container */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
