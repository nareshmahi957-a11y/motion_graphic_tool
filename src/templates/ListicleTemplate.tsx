import React from 'react';
import { spring, useVideoConfig, useCurrentFrame, AbsoluteFill } from 'remotion';

export interface ListicleItem {
  label: string;
  value?: number;
}

export interface ListicleProps {
  chartData: ListicleItem[];
  color: string;
  // Note: we remove 'scale' and 'backgroundImage' from here because 
  // MainTemplate handles them now
}

export const ListicleTemplate: React.FC<ListicleProps> = ({ chartData, color }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          zIndex: 10,
          padding: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {chartData.map((item, i) => {
          const entrance = spring({
            frame: frame - (i * 5),
            fps,
            config: { damping: 12, mass: 0.8, stiffness: 100 },
          });

          return (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px) saturate(180%)',
                WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '24px',
                padding: '24px 32px',
                width: '600px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 0 0 1px ${color}33`,
                opacity: entrance,
                transform: `translateX(${(1 - entrance) * 50}px)`
              }}
            >
              <div style={{ fontSize: '32px', fontWeight: '900', color: color }}>
                {i + 1}
              </div>
              <span style={{ color: 'white', fontSize: '28px', fontWeight: '600' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
