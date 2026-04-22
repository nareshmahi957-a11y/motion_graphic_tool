"use client";
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const VerticalCarouselTemplate: React.FC<any> = ({ chartData = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = chartData.length > 0 ? chartData : [
    { label: "Follow up dropped" }, { label: "Revenue tracking" },
    { label: "Late response" }, { label: "Forecast tracking" }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: '#d9e9ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '85%' }}>
        {data.map((item: any, i: number) => {
          // Slide in from right
          const entrance = spring({ frame: frame - (i * 7), fps, config: { damping: 14, stiffness: 100 } });
          const translateX = interpolate(entrance, [0, 1], [900, 0]);

          return (
            <div key={i} style={{
              transform: `translateX(${translateX}px)`,
              backgroundColor: 'white', borderRadius: '28px', padding: '26px 40px',
              display: 'flex', alignItems: 'center', gap: '24px',
              boxShadow: '0 12px 35px rgba(0,0,0,0.05)'
            }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ebf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontSize: '28px' }}>
                🏠
              </div>
              <span style={{ color: '#111', fontSize: '34px', fontWeight: '700', fontFamily: 'Inter, sans-serif' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};