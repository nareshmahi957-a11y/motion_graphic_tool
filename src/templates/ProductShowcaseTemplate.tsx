"use client";
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate, Img } from 'remotion';

export const ProductShowcaseTemplate: React.FC<any> = ({ 
  chartData = [], headerText, color, bgImageUrl 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const themeColor = color || '#F40009'; // Iconic Coke Red

  // Speed ramp logic: fast then slow-mo
  const timeMapping = interpolate(
    frame,
    [0, 10, 40],
    [0, 20, 30],
    { extrapolateRight: "extend" }
  );

  // Bouncy entrance for the "Ahhh" moment
  const entrance = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const rotationY = interpolate(timeMapping, [0, 150], [0, 360]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', perspective: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* 🔴 Glow to simulate sunlight on the glass */}
      <div style={{
        position: 'absolute', width: '800px', height: '800px',
        background: `radial-gradient(circle, ${themeColor}66 0%, transparent 70%)`,
        filter: 'blur(100px)', transform: `scale(${entrance})`, opacity: 0.6
      }} />

      {/* 🟢 The Spinning Bottle */}
      <div style={{
        transform: `rotateY(${rotationY}deg) scale(${entrance})`,
        transformStyle: 'preserve-3d', zIndex: 10
      }}>
        <Img src={bgImageUrl} style={{ width: '350px', height: '650px', borderRadius: '40px', objectFit: 'cover' }} />
      </div>

      {/* 🟢 Exploding "Real Magic" Specs */}
      <AbsoluteFill style={{ zIndex: 20 }}>
        {chartData.map((item: any, i: number) => {
          const pop = spring({ frame: frame - 20 - (i * 10), fps });
          // Explosive movement logic here...
          // Explode to corners
          const positions = [
            { x: -380, y: -220 }, { x: 380, y: -120 },
            { x: -350, y: 180 }, { x: 350, y: 280 }
          ];
          const pos = positions[i % positions.length];
          const tx = interpolate(pop, [0, 1], [0, pos.x]);
          const ty = interpolate(pop, [0, 1], [0, pos.y]);
          return (
            <div key={i} style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${pop})`,
              opacity: pop,
              backgroundColor: 'white',
              backdropFilter: 'blur(10px)',
              padding: '12px 24px', borderRadius: '40px',
              color: themeColor, fontWeight: '900', fontSize: '22px', whiteSpace: 'nowrap',
              boxShadow: `0 10px 30px ${themeColor}44`,
              border: `2px solid ${themeColor}22`
            }}>
              {item.label}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};