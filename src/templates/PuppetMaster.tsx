import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring } from 'remotion';

export const PuppetMasterTemplate: React.FC<any> = ({ 
  headerText = "CONTROL YOUR MIND", 
  subText = "Master the Game",
  color = "#ff4444", 
  fontFamily = "Montserrat" 
}) => {
  const frame = useCurrentFrame();

  // 1. MASTER ENTRANCE (Slide down from top)
  const entrance = spring({ frame, fps: 30, config: { stiffness: 60, damping: 14 } });
  const masterY = interpolate(entrance, [0, 1], [-800, 0]);

  // 2. FINGER TWITCH LOGIC (Subtle, independent oscillations)
  const thumbMove = Math.sin(frame / 8) * 4;
  const indexMove = Math.sin(frame / 12) * 6;
  const middleMove = Math.cos(frame / 10) * 5;
  const pinkyMove = Math.sin(frame / 15) * 8;

  // 3. TEXT ANIMATIONS
  const textPop = spring({ frame: Math.max(0, frame - 45), fps: 30, config: { stiffness: 100, damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', overflow: 'hidden', fontFamily: fontFamily }}>
      
      {/* --- 🎭 THE PUPPET MASTER GRAPHIC --- */}
      <div style={{ 
        position: 'absolute', top: '50px', left: '50%', transform: `translateX(-50%) translateY(${masterY}px)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10
      }}>
        <svg width="600" height="800" viewBox="0 0 400 600" style={{ filter: `drop-shadow(0 0 30px ${color}66)` }}>
          {/* --- THE STRINGS --- */}
          <line x1="80" y1="180" x2="150" y2="500" stroke={color} strokeWidth="1.5" opacity="0.6" style={{ transform: `translateX(${thumbMove}px)` }} />
          <line x1="160" y1="140" x2="190" y2="480" stroke={color} strokeWidth="1.5" opacity="0.6" style={{ transform: `translateX(${indexMove}px)` }} />
          <line x1="240" y1="140" x2="220" y2="480" stroke={color} strokeWidth="1.5" opacity="0.6" style={{ transform: `translateX(${middleMove}px)` }} />
          <line x1="320" y1="190" x2="260" y2="500" stroke={color} strokeWidth="1.5" opacity="0.6" style={{ transform: `translateX(${pinkyMove}px)` }} />

          {/* --- THE HAND (Stylized Silhouette) --- */}
          <path d="M100 250 Q120 180 200 180 Q280 180 300 250" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" />
          
          {/* TWITCHING FINGERS */}
          <circle cx="80" cy="190" r="10" fill="white" style={{ transform: `translateY(${thumbMove}px)` }} />
          <circle cx="160" cy="150" r="10" fill="white" style={{ transform: `translateY(${indexMove}px)` }} />
          <circle cx="240" cy="150" r="10" fill="white" style={{ transform: `translateY(${middleMove}px)` }} />
          <circle cx="320" cy="200" r="10" fill="white" style={{ transform: `translateY(${pinkyMove}px)` }} />

          {/* --- THE BRAIN (Graphic representation at bottom of strings) --- */}
          <g style={{ transform: 'translate(130px, 450px) scale(0.6)', opacity: 0.9 }}>
            <path d="M110 50 Q160 0 210 50 T310 50 Q360 100 310 150 T210 150 T110 150 Q60 100 110 50" fill={color} />
            <path d="M210 50 V150" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
          </g>
        </svg>
      </div>

      {/* --- ✍️ KINETIC TEXT (Bottom Aligned like Speaker Template) --- */}
      <AbsoluteFill style={{ 
        justifyContent: 'flex-end', alignItems: 'center', paddingBottom: '180px', 
        opacity: textPop, transform: `translateY(${(1 - textPop) * 50}px)` 
      }}>
        <h2 style={{ fontSize: '45px', color: 'white', fontWeight: 500, margin: 0, opacity: 0.7 }}>{subText}</h2>
        <h1 style={{ 
          fontSize: '110px', fontWeight: 900, color: 'white', textTransform: 'uppercase', 
          textAlign: 'center', margin: 0, letterSpacing: '8px', lineHeight: 1,
          textShadow: `0 10px 40px rgba(0,0,0,0.9), 0 0 50px ${color}`
        }}>
          {headerText.split(' ').join('\n')}
        </h1>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
