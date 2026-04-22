import React from 'react';
import { useCurrentFrame } from 'remotion';

export type ModifierType = 
  | 'ClipMask'
  | 'NeonGlow'
  | 'ColorTint'
  | 'DynamicBorder'
  | 'Glassmorphism'
  | 'DropShadow'
  | 'GlitchDistortion'
  | 'Vignette'
  | 'DuotoneFilter'
  | 'MotionBlur';

export const StyleModifier: React.FC<{
  type: ModifierType;
  color?: string;       // Used for Neon, Tint, Border, Duotone
  intensity?: number;   // Controls opacity/blur amounts
  clipPoints?: string;  // Polygon points for ClipMask
  radius?: number;      // Border radius for Glass/Borders
  children: React.ReactNode;
}> = ({ 
  type, color = '#00ffff', intensity = 1, clipPoints = '50% 0%, 100% 50%, 50% 100%, 0% 50%', radius = 16, children 
}) => {
  const frame = useCurrentFrame();

  // ==========================================
  // 1. GLITCH DISTORTION MATH
  // Creates random horizontal jitter and RGB splits every few frames
  // ==========================================
  const isGlitchFrame = frame % 12 === 0 || frame % 17 === 0;
  const glitchX = isGlitchFrame ? (Math.random() * 20 - 10) * intensity : 0;
  const glitchFilter = isGlitchFrame 
    ? `drop-shadow(${5 * intensity}px 0px 0px rgba(255,0,0,0.8)) drop-shadow(${-5 * intensity}px 0px 0px rgba(0,255,255,0.8))` 
    : 'none';

  // ==========================================
  // 2. DYNAMIC BORDER MATH
  // Creates a spinning gradient border using a conic-gradient trick
  // ==========================================
  const spinAngle = (frame * 5) % 360;

  if (type === 'ClipMask') {
    return (
      <div style={{ width: '100%', height: '100%', clipPath: `polygon(${clipPoints})` }}>
        {children}
      </div>
    );
  }

  if (type === 'NeonGlow') {
    return (
      <div style={{ 
        width: '100%', height: '100%',
        filter: `drop-shadow(0 0 ${10 * intensity}px ${color}) drop-shadow(0 0 ${30 * intensity}px ${color}) drop-shadow(0 0 ${60 * intensity}px ${color})` 
      }}>
        {children}
      </div>
    );
  }

  if (type === 'ColorTint') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {children}
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundColor: color, mixBlendMode: 'multiply', opacity: intensity * 0.7 
        }} />
      </div>
    );
  }

  if (type === 'DynamicBorder') {
    return (
      <div style={{ 
        position: 'relative', width: '100%', height: '100%', borderRadius: radius,
        padding: 4 * intensity, overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: '-50%', zIndex: 0,
          background: `conic-gradient(from ${spinAngle}deg, transparent, ${color}, transparent 30%)`
        }} />
        <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#000', borderRadius: radius - 4, zIndex: 1, overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    );
  }

  if (type === 'Glassmorphism') {
    return (
      <div style={{ 
        width: '100%', height: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: `blur(${16 * intensity}px)`,
        WebkitBackdropFilter: `blur(${16 * intensity}px)`,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: radius,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      }}>
        {children}
      </div>
    );
  }

  if (type === 'DropShadow') {
    return (
      <div style={{ 
        width: '100%', height: '100%',
        filter: `drop-shadow(0px ${10 * intensity}px ${15 * intensity}px rgba(0,0,0,0.6))` 
      }}>
        {children}
      </div>
    );
  }

  if (type === 'GlitchDistortion') {
    return (
      <div style={{ 
        width: '100%', height: '100%',
        transform: `translateX(${glitchX}px)`,
        filter: glitchFilter
      }}>
        {children}
      </div>
    );
  }

  if (type === 'Vignette') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {children}
        <div style={{ 
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle, transparent ${50 - (intensity * 10)}%, rgba(0,0,0,${0.8 * intensity}) 100%)`
        }} />
      </div>
    );
  }

  if (type === 'DuotoneFilter') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ filter: 'grayscale(100%)', width: '100%', height: '100%' }}>
          {children}
        </div>
        <div style={{ 
          position: 'absolute', inset: 0, 
          backgroundColor: color, mixBlendMode: 'color', opacity: intensity 
        }} />
      </div>
    );
  }

  if (type === 'MotionBlur') {
    return (
      <div style={{ 
        width: '100%', height: '100%',
        filter: `blur(${8 * intensity}px)` 
      }}>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};
