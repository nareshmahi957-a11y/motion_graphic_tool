import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface CarouselItem {
  label: string;
  icon?: string;
}

export interface CarouselProps {
  chartData: CarouselItem[];
  color: string;
}

export const CarouselTemplate: React.FC<CarouselProps> = ({ chartData, color }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const data = chartData && chartData.length > 0 ? chartData : [
    { label: 'First', icon: '🌟' },
    { label: 'Second', icon: '🔥' },
    { label: 'Third', icon: '💡' },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: color }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 40 }}>
        {data.map((item, i) => {
          const entrance = spring({
            frame: frame - (i * 7),
            fps,
            config: { damping: 14, stiffness: 100 },
          });
          const translateY = interpolate(entrance, [0, 1], [200, 0]);
          return (
            <div key={i} style={{
              transform: `translateY(${translateY}px)`,
              background: 'white',
              borderRadius: 20,
              padding: '32px 48px',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 180,
            }}>
              <div style={{ fontSize: 48 }}>{item.icon || '🌀'}</div>
              <div style={{ color: color, fontWeight: 700, fontSize: 28, marginTop: 16 }}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
