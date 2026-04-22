import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';

export type MotionType = 
  | 'PopIn' 
  | 'WhipPan' 
  | 'ElasticDrop' 
  | 'FadeUp' 
  | 'HoverIdle' 
  | 'PulseIdle' 
  | 'ParallaxPan' 
  | 'CameraZoomTarget' 
  | 'RotateReveal' 
  | 'TypewriterWipe';

export const MotionPrimitive: React.FC<{
  type: MotionType;
  delay?: number;
  direction?: 'left' | 'right' | 'up' | 'down'; // For WhipPan
  zDepth?: number; // For Parallax
  targetScale?: number; // For CameraZoom
  children: React.ReactNode;
}> = ({ 
  type, delay = 0, direction = 'right', zDepth = 1, targetScale = 2, children 
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const activeFrame = Math.max(0, frame - delay);

  // ==========================================
  // 1. IN/OUT TRANSITIONS (Springs)
  // ==========================================
  
  // 1. PopIn: Bouncy scale up (Standard standard UI pop)
  const popInScale = spring({ frame: activeFrame, fps, config: { stiffness: 200, damping: 12 } });

  // 2. WhipPan: High-speed directional slide with simulated motion blur
  const whipSpring = spring({ frame: activeFrame, fps, config: { stiffness: 80, damping: 18 } });
  const whipOffset = interpolate(whipSpring, [0, 1], [direction === 'right' ? width : direction === 'left' ? -width : direction === 'up' ? -height : height, 0]);
  const whipBlur = interpolate(whipSpring, [0, 0.8, 1], [20, 5, 0], { extrapolateRight: 'clamp' });

  // 3. ElasticDrop: Falls from top and bounces heavily (high mass, low damping)
  const dropSpring = spring({ frame: activeFrame, fps, config: { mass: 2, stiffness: 150, damping: 8 } });
  const dropY = interpolate(dropSpring, [0, 1], [-height, 0]);

  // 4. FadeUp: Elegant opacity slide (Great for subtitles/descriptions)
  const fadeOpacity = interpolate(activeFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeY = interpolate(activeFrame, [0, 15], [50, 0], { extrapolateRight: 'clamp' });

  // 9. RotateReveal: Spins on Z axis while scaling up
  const rotateSpring = spring({ frame: activeFrame, fps, config: { stiffness: 120, damping: 14 } });
  const rotateDeg = interpolate(rotateSpring, [0, 1], [-180, 0]);

  // 10. TypewriterWipe: Generic Left-to-Right masking wipe (Works on text OR images!)
  const wipeProgress = interpolate(activeFrame, [0, 20], [0, 100], { extrapolateRight: 'clamp' });

  // ==========================================
  // 2. IDLE ANIMATIONS (Continuous Math)
  // ==========================================
  
  // 5. HoverIdle: Gentle floating using infinite sine waves
  const hoverY = Math.sin((frame - delay) / 15) * 15;

  // 6. PulseIdle: Heartbeat scaling effect
  const pulseScale = 1 + Math.sin((frame - delay) / 10) * 0.05;

  // 7. ParallaxPan: Continuous movement based on Z-Index depth
  const parallaxX = (frame - delay) * (zDepth * -2); 

  // ==========================================
  // 3. CAMERA MOVES
  // ==========================================

  // 8. CameraZoomTarget: Smooth push-in effect
  const zoomSpring = spring({ frame: activeFrame, fps, config: { stiffness: 60, damping: 20 } });
  const cameraScale = interpolate(zoomSpring, [0, 1], [1, targetScale]);

  // ==========================================
  // APPLY STYLES BASED ON TYPE
  // ==========================================
  let animatedStyle: React.CSSProperties = {};

  switch (type) {
    case 'PopIn':
      animatedStyle = { transform: `scale(${popInScale})` };
      break;
    case 'WhipPan':
      const isHorizontal = direction === 'left' || direction === 'right';
      animatedStyle = { 
        transform: `translate${isHorizontal ? 'X' : 'Y'}(${whipOffset}px)`,
        // ⚡ FIX: Using standard valid CSS blur instead of the invalid directional hack
        filter: `blur(${whipBlur}px)` 
      };
      break;
    case 'ElasticDrop':
      animatedStyle = { transform: `translateY(${dropY}px)` };
      break;
    case 'FadeUp':
      animatedStyle = { opacity: fadeOpacity, transform: `translateY(${fadeY}px)` };
      break;
    case 'RotateReveal':
      animatedStyle = { transform: `scale(${rotateSpring}) rotate(${rotateDeg}deg)` };
      break;
    case 'TypewriterWipe':
      animatedStyle = { clipPath: `polygon(0 0, ${wipeProgress}% 0, ${wipeProgress}% 100%, 0 100%)` };
      break;
    case 'HoverIdle':
      animatedStyle = { transform: `translateY(${hoverY}px)` };
      break;
    case 'PulseIdle':
      animatedStyle = { transform: `scale(${pulseScale})` };
      break;
    case 'ParallaxPan':
      animatedStyle = { transform: `translateX(${parallaxX}px)` };
      break;
    case 'CameraZoomTarget':
      animatedStyle = { transform: `scale(${cameraScale})`, transformOrigin: 'center center' };
      break;
  }

  // Prevent rendering at all if a delay hasn't been reached (only for entrance animations)
  const isEntrance = ['PopIn', 'WhipPan', 'ElasticDrop', 'FadeUp', 'RotateReveal', 'TypewriterWipe'].includes(type);
  if (isEntrance && frame < delay) return null;

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', ...animatedStyle }}>
      {children}
    </div>
  );
};
