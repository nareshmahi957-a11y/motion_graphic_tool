"use client";

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const TitleIntroTemplate: React.FC<any> = ({ headerText = "for real estate" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const scale = interpolate(pop, [0, 1], [0.85, 1]);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
      {/* 🟣 THE SOFT RADIAL GLOW */}
      <div style={{
        position: 'absolute',
        width: '800px', height: '800px',
        background: 'radial-gradient(circle, rgba(191,191,255,0.3) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(60px)',
      }} />

      {/* ⚪ THE LIGHT BLUE PILL OVERLAY */}
      <div style={{
        backgroundColor: '#f1f5fe', 
        padding: '14px 48px',
        borderRadius: '100px',
        transform: `scale(${scale})`,
        opacity: pop,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}>
        <span style={{ color: '#8cb3f2', fontSize: '48px', fontWeight: '600' }}>{headerText}</span>
        <span style={{ fontSize: '42px', color: '#3b82f6' }}>🏠</span>
      </div>
    </AbsoluteFill>
  );
};