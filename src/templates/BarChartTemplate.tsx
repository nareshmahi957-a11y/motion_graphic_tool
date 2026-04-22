"use client";

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { BarChartProps } from './Animations';

export const BarChartTemplate: React.FC<BarChartProps> = ({ 
  chartData, color, barWidth = 70, barSpacing = 40, scale = 1, headerText 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 🟢 Guard Clause: If there's no data, don't try to map
  if (!chartData || chartData.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'white' }} />;
  }

  const values = chartData.map(d => d.value);
  const maxVal = Math.max(...values, 1);
  
  // Defaults to green if no color is provided
  const activeColor = (!color || color === '#000000') ? '#10b981' : color;

  return (
    <AbsoluteFill style={{ 
      padding: '80px', display: 'flex', flexDirection: 'column', 
      alignItems: 'center', justifyContent: 'center' 
    }}>
      {/* HEADER */}
      {headerText && (
        <h1 style={{ 
          color: 'white', fontSize: '42px', fontWeight: '900', 
          marginBottom: '20px', textTransform: 'uppercase', textAlign: 'center',
          zIndex: 20 // Keeps title above the chart if scaled aggressively
        }}>
          {headerText}
        </h1>
      )}

      {/* CHART CONTAINER */}
      <div style={{ 
        display: "flex", flexDirection: "row", alignItems: "flex-end", 
        justifyContent: "center", gap: `${barSpacing}px`, 
        width: "100%", height: '600px', 
        transform: `scale(${scale})`, transformOrigin: "bottom center" 
      }}>
        {chartData.map((item, i) => {
          const entrance = spring({ frame: frame - i * 5, fps, config: { damping: 14 } });
          
          const maxBarHeightPx = 380; // Adjusted to leave room for the floating value on top
          const targetHeightPx = (item.value / maxVal) * maxBarHeightPx; 
          const animatedHeight = interpolate(entrance, [0, 1], [0, targetHeightPx], { extrapolateRight: "clamp" });

          return (
            <div key={i} style={{ 
              position: 'relative', 
              width: `${barWidth + 70}px`, // Extra width so long car names don't overlap each other
              height: '100%', 
            }}>
              
              {/* 🟢 TOP: Floating Value */}
              <div style={{ 
                position: 'absolute', 
                bottom: `${90 + animatedHeight}px`, // Floats exactly 10px above the animated bar!
                left: 0, right: 0,
                display: 'flex', justifyContent: 'center', zIndex: 10
              }}>
                <span style={{ 
                  color: 'white', fontSize: '24px', fontWeight: '900', opacity: entrance 
                }}>
                  {item.value}
                </span>
              </div>

              {/* 🟢 MIDDLE: The Bar with Rounded Top Edges */}
              <div style={{ 
                position: 'absolute', 
                bottom: '80px', // Baseline moved up slightly to fit names below
                left: '50%', 
                transform: 'translateX(-50%)',
                backgroundColor: activeColor,
                width: `${barWidth}px`, 
                height: `${animatedHeight}px`, 
                borderRadius: '12px 12px 0 0', // Rounded top, flat bottom
              }} />

              {/* 🟢 BOTTOM: Static Car Name */}
              <div style={{ 
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '70px', display: 'flex', alignItems: 'flex-start', // Aligns text to the top of this container
                justifyContent: 'center', paddingTop: '10px'
              }}>
                <span style={{ 
                  color: 'rgba(255,255,255,0.85)', 
                  fontSize: '16px', fontWeight: 'bold', 
                  textAlign: 'center', lineHeight: '1.2', opacity: entrance 
                }}>
                  {item.label}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};