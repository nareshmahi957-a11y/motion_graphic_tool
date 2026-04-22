"use client";
"use client";
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SparkleTransition } from './SparkleTransition'; 

export const TiltedCarouselTemplate: React.FC<any> = ({
  chartData = [],
  headerText,
  color,
  scale,
  logoUrl,
  primaryColor,
  accentColor,
  fontFamily,
  vectorUrl,
}) => {

  // chartData fallback
  const data = chartData && chartData.length > 0 ? chartData : [
    { label: "Follow up dropped" }, { label: "Revenue tracking" }, { label: "Late response" }
  ];

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fallbackIcons = ["💎", "⏰", "📉", "👍"];
  const fallbackStatuses = ["!", "✎", "!", "✎"];

  // (Removed duplicate declaration)

  // Theme-aware fallbacks
  const fallbackColor = primaryColor || color || '#1e293b';
  // fallbackHeader removed (was unused)
  const fallbackData = data.length > 0 ? data : [
    { label: 'Item 1', value: 10, icon: '⭐', status: 'active' },
    { label: 'Item 2', value: 20, icon: '🔥', status: 'inactive' },
    { label: 'Item 3', value: 30, icon: '💡', status: 'active' },
  ];
  const fallbackScale = scale || 1;
  const fallbackAccent = accentColor || '#38bdf8';
  const fallbackFont = fontFamily || 'Inter, sans-serif';

  // 🟢 The Phone Entrance Animation
  const phoneEntrance = spring({ frame: frame - 5, fps, config: { damping: 14 } });
  const phoneTranslateY = interpolate(phoneEntrance, [0, 1], [800, 0]);
  const phoneRotateX = interpolate(phoneEntrance, [0, 1], [40, 15]); 
  const phoneRotateY = interpolate(phoneEntrance, [0, 1], [-15, -5]);
  const phoneRotateZ = interpolate(phoneEntrance, [0, 1], [5, 2]);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: fallbackColor, 
      perspective: '2000px', 
      alignItems: 'center', justifyContent: 'center',
      fontFamily: fallbackFont
    }}>
      <SparkleTransition />
      {logoUrl && (
        <img src={logoUrl} alt="Brand Logo" style={{ width: 64, height: 64, marginBottom: 24, borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }} />
      )}
      {/* 📱 OUTER WRAPPER: Handles the 3D Tilt and Bezel Shadow */}
      <div style={{
        width: '85%',
        height: '800px', 
        borderRadius: '50px', 
        boxShadow: '-20px 30px 60px rgba(59, 130, 246, 0.15), inset 0 0 0 8px #ffffff',
        transform: `translateY(${phoneTranslateY}px) rotateX(${phoneRotateX}deg) rotateY(${phoneRotateY}deg) rotateZ(${phoneRotateZ}deg)`,
        position: 'relative',
        backgroundColor: '#ffffff'
      }}>
        {/* 📱 INNER WRAPPER: Handles the overflow:hidden scroll clipping! */}
        <div style={{
          position: 'absolute',
          inset: '8px', // Keeps it inside the white bezel
          borderRadius: '42px', // Matches the outer curve
          backgroundColor: '#f4f8ff', 
          overflow: 'hidden', 
          transform: 'translateZ(0)', // Force GPU hardware acceleration to fix CSS clipping bugs
          display: 'flex', flexDirection: 'column', gap: '14px',
          padding: '40px 22px'
        }}>
          
          <p style={{ color: fallbackAccent, fontSize: '24px', fontWeight: '800', marginBottom: '10px', marginLeft: '10px', textTransform: 'uppercase', fontFamily: fallbackFont }}>
            The Key Challenges
          </p>

          {fallbackData.map((item: any, i: number) => {
            // Cards slide up from the bottom of the inner screen
            const entrance = spring({ frame: frame - 15 - (i * 6), fps, config: { damping: 16 } });
            const translateY = interpolate(entrance, [0, 1], [600, 0]);
            return (
              <div key={i} style={{
                transform: `translateY(${translateY}px) scale(${fallbackScale})`,
                opacity: interpolate(entrance, [0, 0.2], [0, 1]),
                backgroundColor: 'white', borderRadius: '20px', padding: '18px 25px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.06)',
                border: `2px solid ${fallbackAccent}`,
                fontFamily: fallbackFont
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: '#f1f5fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    {item.icon || fallbackIcons[i % fallbackIcons.length]}
                  </div>
                  <span style={{ color: '#111', fontSize: '26px', fontWeight: '700', fontFamily: fallbackFont }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: fallbackAccent, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                  {item.status || fallbackStatuses[i % fallbackStatuses.length]}
                </div>
                {vectorUrl && (
                  <img src={vectorUrl} alt="Brand Vector" style={{ width: 32, height: 32, marginLeft: 12 }} />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </AbsoluteFill>
  );
};