"use client";

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export const FloatingCascadeTemplate: React.FC<any> = ({ 
  chartData, scale = 1, headerText, color 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const themeColor = (!color || color === '#000000') ? '#3b82f6' : color;

  // 🎯 Pre-defined scattered coordinates (X, Y) relative to the center of the screen.
  // This ensures they look perfectly randomly placed without actually overlapping badly.
  const scatterPositions = [
    { x: -160, y: -220 }, // Top Left
    { x: 180, y: -120 },  // Top Right
    { x: -140, y: 120 },  // Bottom Left
    { x: 170, y: 240 },   // Bottom Right
    { x: 0, y: 10 },      // Dead Center
    { x: -240, y: -60 },  // Far Left
    { x: 220, y: 60 },    // Far Right
  ];

  return (
    <AbsoluteFill style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
    }}>
      {/* HEADER */}
      {headerText && (
        <h1 style={{ 
          color: 'white', fontSize: '46px', fontWeight: '900', 
          position: 'absolute', top: '100px', textTransform: 'uppercase', textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)', zIndex: 0
        }}>
          {headerText}
        </h1>
      )}

      {/* 🌊 THE FLOATING CASCADE CANVAS */}
      <div style={{ 
        position: 'relative', width: '100%', height: '100%', 
        transform: `scale(${scale})`, transformOrigin: "center center"
      }}>
        
        {(chartData || []).map((item: any, i: number) => {
          // 1. Get position, loop if there are more than 7 items
          const targetPos = scatterPositions[i % scatterPositions.length];
          
          // 2. Staggered Entrance Animation (Slides in from the edges of the screen)
          const entranceSpring = spring({ frame: frame - (i * 8), fps, config: { damping: 14, mass: 0.9 } });
          
          // Slide in from 3x the distance, landing exactly on their target coordinate
          const currentX = interpolate(entranceSpring, [0, 1], [targetPos.x * 3, targetPos.x]);
          const currentY = interpolate(entranceSpring, [0, 1], [targetPos.y * 3, targetPos.y]);
          const opacity = interpolate(entranceSpring, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

          // 3. Continuous Bobbing/Floating Animation
          // We use Math.sin() and offset it by the index 'i' so they don't all bob up and down at the exact same time
          const floatOffset = Math.sin((frame / 30) + i) * 15; // Floats up and down 15px

          return (
            <div key={i} style={{
              position: 'absolute',
              // Center the card on its coordinate
              left: '50%', top: '50%',
              marginLeft: '-130px', marginTop: '-40px', // Half of width/height
              
              // Apply the entrance slide PLUS the continuous float offset
              transform: `translate(${currentX}px, ${currentY + floatOffset}px)`,
              opacity: opacity,
              zIndex: 10 + i, // Ensures newer items overlap correctly
            }}>
              
              {/* 🟢 THE GLASS CONTACT CARD */}
              <div style={{
                width: '260px', height: '80px', borderRadius: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)', // Premium frost
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.2), inset 0 0 10px rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'row', alignItems: 'center',
                padding: '0 15px', gap: '15px'
              }}>
                
                {/* Avatar Bubble */}
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  <span style={{ color: themeColor, fontSize: '24px', fontWeight: '900' }}>
                    {item.label.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Text Block */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {item.label.substring(0, 15)}
                  </span>
                  
                  {/* Fake "Active" status indicator with a glowing dot */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '500' }}>
                      Active User
                    </span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </div>
    </AbsoluteFill>
  );
};
