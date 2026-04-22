import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export interface StampChecklistItem {
  label: string;
  checked?: boolean;
}

export interface StampChecklistProps {
  chartData: StampChecklistItem[];
  color: string;
}

export const StampChecklistTemplate: React.FC<StampChecklistProps> = ({ chartData, color }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const data = chartData && chartData.length > 0 ? chartData : [
    { label: 'Step One', checked: true },
    { label: 'Step Two', checked: false },
    { label: 'Step Three', checked: false },
  ];

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: color }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {data.map((item, i) => {
          const entrance = spring({
            frame: frame - (i * 7),
            fps,
            config: { damping: 14, stiffness: 100 },
          });
          const translateX = interpolate(entrance, [0, 1], [100, 0]);
          return (
            <div key={i} style={{
              transform: `translateX(${translateX}px)`,
              background: 'white',
              borderRadius: 16,
              padding: '24px 36px',
              boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)',
              display: 'flex',
              alignItems: 'center',
              minWidth: 320,
              gap: 24,
            }}>
              <span style={{ fontSize: 32 }}>{item.checked ? '✅' : '⬜'}</span>
              <span style={{ color: color, fontWeight: 600, fontSize: 24 }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
