"use client";
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from 'remotion';

export const TextNetworkTemplate: React.FC<any> = ({ chartData = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const data = chartData.length > 0 ? chartData : [{ label: "Spec 1" }, { label: "Spec 2" }];
  const positions = [
    { x: -320, y: 0 },
    { x: -160, y: 0 },
    { x: 160, y: 0 },
    { x: 320, y: 0 }
  ];

      return (
        <AbsoluteFill style={{ backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
          {/* 🎙️ Central Core */}
          <div style={{
            position: 'absolute', width: '110px', height: '110px', borderRadius: '50%',
            backgroundColor: '#f1f5fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10, transform: `scale(${spring({ frame: frame - 5, fps, config: { damping: 12 } })})`
          }}>
            <span style={{ fontSize: '50px' }}>📱</span>
          </div>

          {data.map((node: any, i: number) => {
            if (!positions[i]) return null;
            const pos = positions[i % positions.length]; // 🟢 This was defined but unused
            const pop = spring({ frame: frame - 20 - (i * 5), fps });
            return (
              <div key={i} style={{
                position: 'absolute',
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${pop})`,
                backgroundColor: '#f40009', // Coke Red
                padding: '12px 20px',
                borderRadius: '12px',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(244, 0, 9, 0.2)'
              }}>
                {node.label}
              </div>
            );
          })}
          {data.map((node: any, i: number) => {
            const pop = spring({ frame: frame - 20 - (i * 5), fps });
            
            return (
              <React.Fragment key={i}>
                {/* 🟢 Connecting Line */}
                <div style={{
                  position: 'absolute', width: '2px', height: '100px', backgroundColor: '#3b82f6',
                  transform: `rotate(${i * 90}deg) translateY(-80px) scaleY(${pop})`,
                  opacity: 0.3, transformOrigin: 'bottom'
                }} />
                {/* The Node Box... */}
                {/* ...existing node box code... */}
              </React.Fragment>
            )
          })}
    </AbsoluteFill>
  );
};
